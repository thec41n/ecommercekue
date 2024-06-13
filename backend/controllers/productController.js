import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Tolong isi field nama!" });
      case !brand:
        return res.json({ error: "Tolong isi field brand!" });
      case !description:
        return res.json({ error: "Tolong isi field deskripsi!" });
      case !price:
        return res.json({ error: "Tolong isi field harga!" });
      case !category:
        return res.json({ error: "Tolong isi field kategori!" });
      case !quantity:
        return res.json({ error: "Tolong isi field kuantitas!" });
    }

    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

export {
  addProduct,
//   updateProductDetails,
//   removeProduct,
//   fetchProducts,
//   fetchProductById,
//   fetchAllProducts,
//   addProductReview,
//   fetchTopProducts,
//   fetchNewProducts,
//   filterProducts,
};
