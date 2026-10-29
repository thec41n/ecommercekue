import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineClose,
  AiOutlineDown,
  AiOutlineHeart,
  AiOutlineMenu,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import logo from "../../img/logo.png";

const mainLinks = [
  { to: "/", label: "Beranda" },
  { to: "/shop", label: "Belanja" },
  { to: "/about", label: "Tentang Kami" },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/productlist", label: "Tambah Jajanan" },
  { to: "/admin/allproductslist", label: "Daftar Jajanan" },
  { to: "/admin/categorylist", label: "Kategori Makanan" },
  { to: "/admin/orderlist", label: "Pesanan" },
  { to: "/admin/userlist", label: "Users" },
];

const userLinks = [
  { to: "/profile", label: "Profil" },
  { to: "/user-orders", label: "Pesanan Saya" },
];

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 font-semibold transition ${
    isActive ? "bg-blush-light text-orange-700" : "text-cocoa hover:bg-blush-light"
  }`;

const IconLink = ({ to, label, count, children }) => (
  <Link
    to={to}
    aria-label={label}
    className="relative rounded-full p-2 text-cocoa transition hover:bg-blush-light"
  >
    {children}
    {count > 0 && (
      <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange-700 px-1 text-xs font-bold text-white">
        {count}
      </span>
    )}
  </Link>
);

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const favoritesCount = useSelector((state) => state.favorites.length);
  const cartCount = cartItems.reduce((a, c) => a + Number(c.qty), 0);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [logoutApiCall] = useLogoutMutation();

  const accountLinks = userInfo
    ? [...(userInfo.isAdmin ? adminLinks : []), ...userLinks]
    : [];

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const closeDropdown = () => setDropdownOpen(false);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-blush-soft bg-white/95 backdrop-blur">
      <nav className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="" className="h-10 w-10" />
          <span className="font-heading text-xl font-semibold">Kue Yanti</span>
        </Link>

        <div className="hidden flex-1 justify-center gap-1 md:flex">
          {mainLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === "/"} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <IconLink to="/favorite" label="Favorit" count={favoritesCount}>
            <AiOutlineHeart size={24} />
          </IconLink>
          <IconLink to="/cart" label="Keranjang" count={cartCount}>
            <AiOutlineShoppingCart size={24} />
          </IconLink>

          <div className="ml-2 hidden items-center gap-2 md:flex">
            {userInfo ? (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  className="flex items-center gap-1 rounded-full px-3 py-2 font-semibold transition hover:bg-blush-light"
                >
                  {userInfo.username}
                  <AiOutlineDown
                    size={14}
                    className={`transition ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="card absolute right-0 mt-2 w-56 py-2" role="menu">
                    {accountLinks.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        role="menuitem"
                        className="block px-4 py-2 hover:bg-blush-light"
                      >
                        {label}
                      </Link>
                    ))}
                    <div className="my-2 border-t border-blush-soft" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={logoutHandler}
                      className="block w-full px-4 py-2 text-left text-red-700 hover:bg-red-50"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline px-5 py-2">
                  Masuk
                </Link>
                <Link to="/register" className="btn-primary px-5 py-2">
                  Daftar
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            className="rounded-full p-2 transition hover:bg-blush-light md:hidden"
          >
            {menuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-blush-soft bg-white md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {mainLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === "/"} className={navLinkClass}>
                {label}
              </NavLink>
            ))}

            <div className="my-2 border-t border-blush-soft" />

            {userInfo ? (
              <>
                <p className="px-4 py-1 text-sm text-cocoa-light">
                  Halo, {userInfo.username}
                </p>
                {accountLinks.map(({ to, label }) => (
                  <NavLink key={to} to={to} className={navLinkClass}>
                    {label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={logoutHandler}
                  className="rounded-full px-4 py-2 text-left font-semibold text-red-700 hover:bg-red-50"
                >
                  Keluar
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-1">
                <Link to="/login" className="btn-outline flex-1">
                  Masuk
                </Link>
                <Link to="/register" className="btn-primary flex-1">
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
