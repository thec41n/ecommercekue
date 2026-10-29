import {
  FaClock,
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import banner from "../img/banner.jpg";

const InfoCard = ({ icon: Icon, title, children }) => (
  <div className="card p-6">
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blush-light text-orange-700">
      <Icon size={20} />
    </span>
    <h3 className="mt-4 font-heading text-xl font-semibold">{title}</h3>
    <div className="mt-2 space-y-2 text-cocoa-light">{children}</div>
  </div>
);

const linkClass = "flex items-center gap-2 hover:text-orange-700";

const AboutUs = () => {
  return (
    <div className="container-page">
      <section className="relative overflow-hidden rounded-3xl">
        <img
          src={banner}
          alt="Etalase aneka kue Kue Yanti"
          className="h-56 w-full object-cover md:h-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa/80 via-cocoa/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-blush-light">
            Tentang Kami
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold text-white md:text-5xl">
            Kue Yanti
          </h1>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-3xl text-center">
        <h2 className="section-title">Cerita Kami</h2>
        <p className="mt-4 text-left text-lg leading-relaxed text-cocoa-light md:text-justify">
          Selamat datang di Kue Yanti, tempat di mana cita rasa dan kualitas
          bertemu untuk menciptakan kelezatan tak terlupakan. Sebagai usaha UMKM
          yang berkomitmen untuk menyajikan kue dan jajanan terbaik yang ada di
          Depok, Kue Yanti menawarkan berbagai pilihan makanan ringan hingga
          kue-kue spesial seperti bolu, brownies, dan kue-kue khas lainnya.
          Dibuat dengan bahan-bahan berkualitas dan penuh cinta, setiap gigitan
          dari Kue Yanti menghadirkan kehangatan dan kebahagiaan bagi Anda dan
          keluarga. Mari rasakan manisnya kebersamaan dengan Kue Yanti, teman
          terbaik untuk setiap momen istimewa Anda.
        </p>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <InfoCard icon={FaMapMarkerAlt} title="Alamat">
          <p>Jl. Stasiun No. 15, Depok, Jawa Barat</p>
        </InfoCard>

        <InfoCard icon={FaPhoneAlt} title="Kontak">
          <a href="tel:+628952315537" className={linkClass}>
            <FaPhoneAlt className="shrink-0" /> +62 895-2315-537
          </a>
          <a
            href="https://wa.me/628952315537"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <FaWhatsapp className="shrink-0" /> WhatsApp
          </a>
          <a
            href="https://instagram.com/kue.yanti"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <FaInstagram className="shrink-0" /> @kue.yanti
          </a>
          <p className="flex items-center gap-2">
            <FaFacebook className="shrink-0" /> Kue Yanti
          </p>
        </InfoCard>

        <InfoCard icon={FaClock} title="Jam Buka">
          <p>Senin – Jumat: 08.00 – 17.00 WIB</p>
          <p>Sabtu: 08.00 – 12.00 WIB</p>
        </InfoCard>
      </section>
    </div>
  );
};

export default AboutUs;
