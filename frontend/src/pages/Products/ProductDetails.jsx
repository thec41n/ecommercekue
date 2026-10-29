import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineShoppingCart } from "react-icons/ai";
import {
  useCreateReviewMutation,
  useGetProductDetailsQuery,
  useGetTopProductsQuery,
} from "../../redux/api/productApiSlice";
import { addToCart } from "../../redux/features/cart/cartSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import QuantityStepper from "../../components/QuantityStepper";
import HeartIcon from "./HeartIcon";
import Product from "./Product";
import Ratings from "./Ratings";

const RATING_OPTIONS = [
  { value: 5, label: "Sempurna" },
  { value: 4, label: "Sangat Baik" },
  { value: 3, label: "Baik" },
  { value: 2, label: "Cukup Baik" },
  { value: 1, label: "Kurang Baik" },
];

const formatDate = (date) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const getErrorMessage = (error) =>
  typeof error?.data === "string"
    ? error.data
    : error?.data?.message || error?.data?.error || error?.error;

const ProductDetails = ({ productId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const cartQty = useSelector(
    (state) =>
      Number(state.cart.cartItems.find((item) => item._id === productId)?.qty) || 0
  );

  const [qty, setQty] = useState(cartQty || 1);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const { data: topProducts } = useGetTopProductsQuery();
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="container-page">
        <Message variant="danger">
          {getErrorMessage(error) || "Produk tidak ditemukan"}
        </Message>
        <Link to="/shop" className="btn-outline mt-4">
          Kembali ke Belanja
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.countInStock === 0;
  const safeQty = Math.min(qty, product.countInStock);
  const alreadyReviewed = product.reviews.some((r) => r.user === userInfo?._id);
  const otherProducts = (topProducts ?? []).filter((p) => p._id !== productId).slice(0, 4);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: safeQty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Ulasan berhasil dikirim!");
      setRating("");
      setComment("");
    } catch (err) {
      toast.error(getErrorMessage(err) || "Gagal mengirim ulasan");
    }
  };

  return (
    <div className="container-page">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-sm text-cocoa-light"
      >
        <Link to="/" className="hover:text-orange-700">
          Beranda
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/shop" className="hover:text-orange-700">
          Belanja
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate font-semibold text-cocoa">{product.name}</span>
      </nav>

      <section className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="card relative h-fit overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
          <HeartIcon product={product} />
        </div>

        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full bg-blush px-3 py-1 text-sm font-semibold">
            {product.brand}
          </span>
          <h1 className="font-heading text-3xl font-semibold leading-tight md:text-4xl">
            {product.name}
          </h1>
          <Ratings
            value={product.rating}
            text={
              product.numReviews > 0
                ? `${product.rating.toFixed(1)} · ${product.numReviews} ulasan`
                : "Belum ada ulasan"
            }
          />
          <p className="text-3xl font-bold text-orange-700">
            Rp {product.price.toLocaleString("id-ID")}
          </p>
          <p className="leading-relaxed text-cocoa-light">{product.description}</p>

          <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-white/60 p-4 text-sm ring-1 ring-blush-soft">
            <div>
              <dt className="text-cocoa-light">Kuantitas</dt>
              <dd className="font-semibold">{product.quantity}</dd>
            </div>
            <div>
              <dt className="text-cocoa-light">Stok</dt>
              <dd className={`font-semibold ${isOutOfStock ? "text-red-700" : ""}`}>
                {isOutOfStock ? "Habis" : `${product.countInStock} tersedia`}
              </dd>
            </div>
          </dl>

          {isOutOfStock ? (
            <button type="button" disabled className="btn-primary w-full sm:w-fit">
              Stok habis
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <QuantityStepper
                value={safeQty}
                max={product.countInStock}
                onChange={setQty}
              />
              <button
                type="button"
                onClick={addToCartHandler}
                className="btn-primary flex-1 sm:flex-none"
              >
                <AiOutlineShoppingCart size={20} />
                {cartQty > 0 ? "Perbarui Keranjang" : "Tambah ke Keranjang"}
              </button>
            </div>
          )}

          {cartQty > 0 && (
            <p className="text-sm text-cocoa-light">Sudah ada {cartQty} di keranjang.</p>
          )}
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="section-title">Ulasan Pembeli</h2>
          {product.reviews.length === 0 ? (
            <p className="mt-4 text-cocoa-light">Belum ada ulasan. Jadilah yang pertama!</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {product.reviews.map((review) => (
                <li key={review._id} className="card p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush font-bold uppercase">
                      {review.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{review.name}</p>
                      <p className="text-xs text-cocoa-light">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Ratings value={review.rating} />
                  </div>
                  <p className="mt-2 leading-relaxed">{review.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="card h-fit p-6">
          <h3 className="font-heading text-xl font-semibold">Tulis Ulasan</h3>
          {!userInfo ? (
            <p className="mt-3 text-cocoa-light">
              Silakan{" "}
              <Link
                to={`/login?redirect=/product/${productId}`}
                className="font-semibold text-orange-700 hover:underline"
              >
                masuk
              </Link>{" "}
              untuk menulis ulasan.
            </p>
          ) : alreadyReviewed ? (
            <p className="mt-3 text-cocoa-light">
              Terima kasih, kamu sudah memberi ulasan untuk produk ini.
            </p>
          ) : (
            <form onSubmit={submitHandler} className="mt-4 space-y-4">
              <div>
                <label htmlFor="rating" className="mb-1 block font-semibold">
                  Rating
                </label>
                <select
                  id="rating"
                  required
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full rounded-xl border-blush-soft focus:border-orange-400 focus:ring-orange-400"
                >
                  <option value="">Pilih rating</option>
                  {RATING_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {value} – {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="comment" className="mb-1 block font-semibold">
                  Komentar
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ceritakan pengalamanmu dengan produk ini"
                  className="w-full rounded-xl border-blush-soft focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              <button type="submit" disabled={loadingProductReview} className="btn-primary w-full">
                {loadingProductReview ? "Mengirim…" : "Kirim Ulasan"}
              </button>
            </form>
          )}
        </aside>
      </section>

      {otherProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title">Produk Populer Lainnya</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {otherProducts.map((p) => (
              <Product key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  return <ProductDetails key={id} productId={id} />;
};

export default ProductDetailsPage;
