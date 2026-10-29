import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCarousel from "./Products/ProductCarousel";
import Product from "./Products/Product";
import banner from "../img/banner.jpg";

const Home = () => {
  const { data, isLoading, error } = useGetProductsQuery({});

  return (
    <>
      <section className="container-page grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <span className="inline-block rounded-full bg-blush px-4 py-1 text-sm font-semibold">
            Kue rumahan dari Depok
          </span>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight md:text-5xl">
            Manisnya kebersamaan, dibuat dengan cinta
          </h1>
          <p className="mt-4 text-lg text-cocoa-light">
            Bolu, brownies, dan aneka jajanan khas Kue Yanti dari bahan
            berkualitas, siap menemani setiap momen istimewa kamu.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary">
              Belanja Sekarang
            </Link>
            <Link to="/about" className="btn-outline">
              Tentang Kami
            </Link>
          </div>
        </div>
        <img
          src={banner}
          alt="Etalase aneka kue Kue Yanti"
          className="h-64 w-full rounded-3xl object-cover shadow-md md:h-96"
        />
      </section>

      <section className="container-page mt-16">
        <h2 className="section-title">Favorit Pelanggan</h2>
        <p className="mb-6 mt-1 text-cocoa-light">
          Jajanan dengan rating tertinggi dari pembeli.
        </p>
        <ProductCarousel />
      </section>

      <section className="container-page mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Jajanan Spesial</h2>
            <p className="mt-1 text-cocoa-light">Pilihan kue terbaru dari dapur kami.</p>
          </div>
          <Link to="/shop" className="shrink-0 font-semibold text-orange-700 hover:underline">
            Lihat semua →
          </Link>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : data.products.length === 0 ? (
          <p className="text-cocoa-light">Belum ada produk.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5">
            {data.products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
