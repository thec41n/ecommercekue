import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar } from "react-icons/fa";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 4000,
  responsive: [{ breakpoint: 768, settings: { arrows: false } }],
};

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );
  }

  return (
    <Slider {...settings} className="pb-8">
      {products.map((product) => (
        <div key={product._id} className="px-1 py-1">
          <div className="card grid overflow-hidden md:grid-cols-2">
            <img
              src={product.image}
              alt={product.name}
              className="h-64 w-full object-cover md:h-80"
            />
            <div className="flex flex-col justify-center gap-3 p-6 md:p-10">
              <span className="w-fit rounded-full bg-blush-light px-3 py-1 text-xs font-semibold">
                {product.brand}
              </span>
              <h3 className="font-heading text-2xl font-semibold md:text-3xl">
                {product.name}
              </h3>
              <p className="flex items-center gap-2 text-sm text-cocoa-light">
                <FaStar className="text-yellow-500" />
                {product.numReviews > 0
                  ? `${product.rating.toFixed(1)} · ${product.numReviews} ulasan`
                  : "Belum ada ulasan"}
              </p>
              <p className="line-clamp-3 text-cocoa-light">{product.description}</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                <span className="text-2xl font-bold text-orange-700">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
                <Link to={`/product/${product._id}`} className="btn-primary">
                  Lihat Detail
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default ProductCarousel;
