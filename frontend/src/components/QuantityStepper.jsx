import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const QuantityStepper = ({ value, max, onChange }) => {
  return (
    <div className="flex w-fit items-center rounded-full bg-white ring-1 ring-blush-soft">
      <button
        type="button"
        aria-label="Kurangi jumlah"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className="rounded-full p-2.5 transition hover:bg-blush-light disabled:opacity-40"
      >
        <AiOutlineMinus />
      </button>
      <span className="w-9 text-center font-semibold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Tambah jumlah"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="rounded-full p-2.5 transition hover:bg-blush-light disabled:opacity-40"
      >
        <AiOutlinePlus />
      </button>
    </div>
  );
};

export default QuantityStepper;
