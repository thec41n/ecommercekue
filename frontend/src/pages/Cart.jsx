import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingBasket, FaTrashAlt } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { FREE_SHIPPING_MIN } from "../Utils/cart";
import QuantityStepper from "../components/QuantityStepper";

const formatRupiah = (value) => `Rp ${Number(value).toLocaleString("id-ID")}`;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state) => state.cart
  );
  const totalQty = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);

  if (cartItems.length === 0) {
    return (
      <div className="container-page">
        <div className="card mx-auto flex max-w-lg flex-col items-center gap-3 px-6 py-14 text-center">
          <FaShoppingBasket size={44} className="text-blush" />
          <h1 className="font-heading text-2xl font-semibold">Keranjangmu masih kosong</h1>
          <p className="text-cocoa-light">Yuk, pilih kue favoritmu dulu.</p>
          <Link to="/shop" className="btn-primary mt-2">
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page">
      <h1 className="section-title">Keranjang</h1>
      <p className="mt-1 text-cocoa-light">{totalQty} barang</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:items-start">
        <ul className="card divide-y divide-blush-soft lg:col-span-2">
          {cartItems.map((item) => {
            const qty = Number(item.qty);

            return (
              <li key={item._id} className="flex gap-4 p-4 sm:p-5">
                <Link to={`/product/${item._id}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover sm:h-24 sm:w-24"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <Link
                      to={`/product/${item._id}`}
                      className="line-clamp-2 font-heading text-lg font-semibold hover:text-orange-700"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-cocoa-light">{item.brand}</p>
                    <p className="mt-1 font-semibold text-orange-700">
                      {formatRupiah(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <QuantityStepper
                      value={qty}
                      max={item.countInStock}
                      onChange={(newQty) => dispatch(addToCart({ ...item, qty: newQty }))}
                    />
                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCart(item._id))}
                      aria-label={`Hapus ${item.name} dari keranjang`}
                      className="rounded-full p-2.5 text-red-700 transition hover:bg-red-50"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="card p-6 lg:sticky lg:top-24">
          <h2 className="font-heading text-xl font-semibold">Ringkasan Belanja</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-cocoa-light">Subtotal ({totalQty} barang)</dt>
              <dd className="font-semibold">{formatRupiah(itemsPrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cocoa-light">Ongkos kirim</dt>
              <dd className="font-semibold">
                {shippingPrice === 0 ? "Gratis" : formatRupiah(shippingPrice)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cocoa-light">Pajak (11%)</dt>
              <dd className="font-semibold">{formatRupiah(taxPrice)}</dd>
            </div>
            <div className="flex justify-between border-t border-blush-soft pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold text-orange-700">{formatRupiah(totalPrice)}</dd>
            </div>
          </dl>

          {shippingPrice > 0 && (
            <p className="mt-4 rounded-xl bg-blush-light px-3 py-2 text-sm">
              Gratis ongkir untuk belanja di atas {formatRupiah(FREE_SHIPPING_MIN)}.
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate("/shipping")}
            className="btn-primary mt-6 w-full"
          >
            Lanjut ke Pengiriman
          </button>
          <Link
            to="/shop"
            className="mt-3 block text-center text-sm font-semibold text-orange-700 hover:underline"
          >
            Lanjut belanja
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
