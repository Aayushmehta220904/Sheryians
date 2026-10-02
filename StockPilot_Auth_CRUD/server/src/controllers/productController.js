import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function productPayload(body) {
  return {
    name: body.name,
    description: body.description,
    category: body.category,
    price: body.price,
    stock: body.stock,
    imageUrl: body.imageUrl || "",
  };
}

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...productPayload(req.body), owner: req.user._id });
  await product.populate("owner", "name");
  return res.status(201).json({ message: "Product created successfully.", product });
});

export const listProducts = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 12;
  const filter = {};

  if (req.query.search) {
    const safe = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: safe, $options: "i" } },
      { description: { $regex: safe, $options: "i" } },
      { category: { $regex: safe, $options: "i" } },
    ];
  }
  if (req.query.category) filter.category = req.query.category;

  const [products, total] = await Promise.all([
    Product.find(filter).populate("owner", "name").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ]);
  return res.json({ products, pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("owner", "name");
  if (!product) return res.status(404).json({ message: "Product not found." });
  return res.json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  if (product.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "You can only update products that you created." });

  Object.assign(product, productPayload(req.body));
  await product.save();
  await product.populate("owner", "name");
  return res.json({ message: "Product updated successfully.", product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  if (product.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "You can only delete products that you created." });
  await product.deleteOne();
  return res.json({ message: "Product deleted successfully." });
});
