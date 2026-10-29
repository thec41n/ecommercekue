import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { addToCart } from "../../redux/features/cart/cartSlice";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const cartQty = useSelector(
    (state) =>
      Number(state.cart.cartItems.find((item) => item._id === product._id)?.qty) || 0
  );

  const isOutOfStock = product.countInStock === 0;

  const addToCartHandler = () => {
    if (cartQty >= product.countInStock) {
      toast.info("Jumlah di keranjang sudah mencapai stok");
      return;
    }

    dispatch(addToCart({ ...product, qty: cartQty + 1 }));
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  return (
    <div className="card group relative flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-md">
      <Link to={`/product/${product._id}`} className="flex flex-1 flex-col">
        <div className="aspect-[4/3] overflow-hidden bg-blush-light">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4 pb-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-cocoa-light">
            {product.brand}
          </span>
          <h3 className="line-clamp-2 font-heading text-lg font-semibold leading-snug">
            {product.name}
          </h3>
          <span className="mt-auto pt-2 font-bold text-orange-700">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={addToCartHandler}
          disabled={isOutOfStock}
          className="btn-primary w-full px-3 py-2 text-sm"
        >
          <AiOutlineShoppingCart size={18} />
          {isOutOfStock ? "Stok habis" : "Keranjang"}
        </button>
      </div>

      {isOutOfStock && (
        <span className="absolute left-3 top-3 rounded-full bg-cocoa px-3 py-1 text-xs font-semibold text-white">
          Stok habis
        </span>
      )}
      <HeartIcon product={product} />
    </div>
  );
};

export default Product;
