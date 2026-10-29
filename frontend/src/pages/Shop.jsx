import { useMemo, useState } from "react";
import { AiOutlineFilter } from "react-icons/ai";
import { FaCookieBite } from "react-icons/fa";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "./Products/Product";

const PRICE_RANGES = [
  { id: "lt25", label: "Di bawah Rp25rb", min: 0, max: 25000 },
  { id: "25-50", label: "Rp25rb – Rp50rb", min: 25000, max: 50000 },
  { id: "50-100", label: "Rp50rb – Rp100rb", min: 50000, max: 100000 },
  { id: "gte100", label: "Rp100rb ke atas", min: 100000, max: Infinity },
];

const FilterSection = ({ title, children }) => (
  <fieldset className="border-b border-blush-soft pb-5 last:border-0">
    <legend className="mb-3 font-heading text-lg font-semibold">{title}</legend>
    {children}
  </fieldset>
);

const Shop = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [brand, setBrand] = useState("");
  const [priceRangeId, setPriceRangeId] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: categories } = useFetchCategoriesQuery();
  const {
    data: products,
    isLoading,
    isFetching,
    error,
  } = useGetFilteredProductsQuery({ checked: selectedCategories, radio: [] });

  const brands = useMemo(
    () => [...new Set(products?.map((p) => p.brand).filter(Boolean))],
    [products]
  );
  const activeBrand = brands.includes(brand) ? brand : "";

  const visibleProducts = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.id === priceRangeId);
    return (products ?? []).filter(
      (p) =>
        (!activeBrand || p.brand === activeBrand) &&
        (!range || (p.price >= range.min && p.price < range.max))
    );
  }, [products, activeBrand, priceRangeId]);

  const activeFilterCount =
    selectedCategories.length + (activeBrand ? 1 : 0) + (priceRangeId ? 1 : 0);

  const toggleCategory = (id) => {
    setSelectedCategories((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setBrand("");
    setPriceRangeId("");
  };

  return (
    <div className="container-page">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">Belanja</h1>
          <p className="mt-1 text-cocoa-light">
            {isLoading ? "Memuat produk…" : `${visibleProducts.length} produk ditemukan`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-expanded={filtersOpen}
          aria-controls="shop-filters"
          className="btn-outline md:hidden"
        >
          <AiOutlineFilter size={18} />
          Filter{activeFilterCount > 0 && ` (${activeFilterCount})`}
        </button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <aside
          id="shop-filters"
          className={`${filtersOpen ? "flex" : "hidden"} card flex-col gap-5 p-5 md:sticky md:top-24 md:flex md:w-64 md:shrink-0`}
        >
          <FilterSection title="Kategori">
            {categories?.length ? (
              <div className="space-y-2">
                {categories.map((c) => (
                  <label key={c._id} className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c._id)}
                      onChange={() => toggleCategory(c._id)}
                      className="h-4 w-4 rounded border-blush text-orange-700 focus:ring-orange-400"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-cocoa-light">Belum ada kategori.</p>
            )}
          </FilterSection>

          <FilterSection title="Merk">
            <div className="space-y-2">
              {["", ...brands].map((b) => (
                <label key={b || "all"} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="brand"
                    checked={activeBrand === b}
                    onChange={() => setBrand(b)}
                    className="h-4 w-4 border-blush text-orange-700 focus:ring-orange-400"
                  />
                  {b || "Semua merk"}
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Harga">
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((r) => {
                const selected = priceRangeId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPriceRangeId(selected ? "" : r.id)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                      selected
                        ? "border-orange-700 bg-orange-700 text-white"
                        : "border-blush bg-white hover:bg-blush-light"
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          <button
            type="button"
            onClick={resetFilters}
            disabled={activeFilterCount === 0}
            className="btn-outline w-full"
          >
            Reset filter
          </button>
        </aside>

        <section className="min-w-0 flex-1">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error?.data?.error || error.error}
            </Message>
          ) : visibleProducts.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
              <FaCookieBite size={40} className="text-blush" />
              <h2 className="font-heading text-xl font-semibold">Produk tidak ditemukan</h2>
              <p className="text-cocoa-light">Coba ubah atau reset filter kamu.</p>
              {activeFilterCount > 0 && (
                <button type="button" onClick={resetFilters} className="btn-primary mt-2">
                  Reset filter
                </button>
              )}
            </div>
          ) : (
            <div
              className={`grid grid-cols-2 gap-4 transition-opacity md:gap-6 lg:grid-cols-3 ${
                isFetching ? "opacity-60" : ""
              }`}
            >
              {visibleProducts.map((p) => (
                <Product key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Shop;
