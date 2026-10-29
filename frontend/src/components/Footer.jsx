import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import logo from "../img/logo.png";

const exploreLinks = [
  { to: "/", label: "Beranda" },
  { to: "/shop", label: "Belanja" },
  { to: "/about", label: "Tentang Kami" },
  { to: "/cart", label: "Keranjang" },
];

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-blush-soft bg-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="" className="h-10 w-10" />
            <span className="font-heading text-xl font-semibold">Kue Yanti</span>
          </Link>
          <p className="mt-3 text-sm text-cocoa-light">
            Kue dan jajanan rumahan dari Depok, dibuat dengan bahan berkualitas
            dan penuh cinta.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold">Jelajahi</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {exploreLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-cocoa-light hover:text-orange-700">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold">Hubungi Kami</h3>
          <ul className="mt-3 space-y-2 text-sm text-cocoa-light">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-0.5 shrink-0" />
              Jl. Stasiun No. 15, Depok, Jawa Barat
            </li>
            <li>
              <a
                href="https://wa.me/628952315537"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-orange-700"
              >
                <FaWhatsapp className="shrink-0" /> +62 895-2315-537
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/kue.yanti"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-orange-700"
              >
                <FaInstagram className="shrink-0" /> @kue.yanti
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaFacebook className="shrink-0" /> Kue Yanti
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold">Jam Buka</h3>
          <ul className="mt-3 space-y-2 text-sm text-cocoa-light">
            <li>Senin – Jumat: 08.00 – 17.00 WIB</li>
            <li>Sabtu: 08.00 – 12.00 WIB</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blush-soft py-4 text-center text-sm text-cocoa-light">
        © {new Date().getFullYear()} Kue Yanti. Semua hak dilindungi.
      </div>
    </footer>
  );
};

export default Footer;
