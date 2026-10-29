const Loader = () => {
  return (
    <div className="flex justify-center py-6" role="status" aria-label="Memuat">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blush-soft border-t-orange-700" />
    </div>
  );
};

export default Loader;
