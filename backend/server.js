const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 8000;
const JWT_SECRET = "your-super-secret-key-that-is-long-and-secure";

// --- Middleware ---
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// --- MongoDB Connection ---
mongoose
  .connect("mongodb://localhost:27017/trendyware")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// --- Mongoose Schemas ---

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: false },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", orderSchema);

const festSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    gstNumber: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
const Fest = mongoose.model("Fest", festSchema);

// --- Authentication Middleware ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token is not valid" });
    req.user = decoded;
    next();
  });
};
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await new User({ name, email, password: hashedPassword }).save();
    res
      .status(201)
      .json({ message: "User created successfully. Please log in." });
  } catch (err) {
    res.status(500).json({ message: "Server error during signup" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// -- Product Management Routes (Unaffected) --
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching products" });
  }
});
app.post("/api/products", authMiddleware, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.put("/api/products/:id", authMiddleware, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.delete("/api/products/:id", authMiddleware, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting product" });
  }
});

// -- Fest Management Routes (Refined and Fully Implemented) --
app.get("/api/fests", async (req, res) => {
  try {
    const fests = await Fest.find()
      .populate("createdBy", "name")
      .sort({ startDate: 1 });
    res.json(fests);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching fests" });
  }
});

app.post("/api/fests", authMiddleware, async (req, res) => {
  const { startDate, endDate } = req.body;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (new Date(startDate) < today) {
    return res
      .status(400)
      .json({ message: "Start date cannot be in the past." });
  }
  if (new Date(startDate) > new Date(endDate)) {
    return res
      .status(400)
      .json({ message: "Start date cannot be after the end date." });
  }

  try {
    const newFest = new Fest({ ...req.body, createdBy: req.user.id });
    await newFest.save();
    res.status(201).json(newFest);
  } catch (err) {
    res.status(400).json({ message: "Failed to create fest: " + err.message });
  }
});

app.put("/api/fests/:id", authMiddleware, async (req, res) => {
  try {
    const fest = await Fest.findById(req.params.id);
    if (!fest) return res.status(404).json({ message: "Fest not found" });

    if (fest.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this fest." });
    }

    const updatedFest = await Fest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedFest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/fests/:id", authMiddleware, async (req, res) => {
  try {
    const fest = await Fest.findById(req.params.id);
    if (!fest) return res.status(404).json({ message: "Fest not found" });

    if (fest.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this fest." });
    }

    await Fest.findByIdAndDelete(req.params.id);
    res.json({ message: "Fest deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting fest" });
  }
});

app.get("/api/admin/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

app.post("/api/admin/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/admin/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/admin/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
});
app.get("/api/admin/fests", async (req, res) => {
  try {
    const fests = await Fest.find().sort({ startDate: 1 });
    res.json(fests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching fests" });
  }
});

app.post("/api/admin/fests", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: "Start date cannot be after end date" });
    }
    const newFest = new Fest(req.body); // no createdBy field
    const saved = await newFest.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/admin/fests/:id", async (req, res) => {
  try {
    const updated = await Fest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Fest not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/admin/fests/:id", async (req, res) => {
  try {
    const deleted = await Fest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Fest not found" });
    res.json({ message: "Fest deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting fest" });
  }
});



app.post("/api/fests/:id/upvote", authMiddleware, async (req, res) => {
  try {
    const fest = await Fest.findById(req.params.id);
    if (!fest) return res.status(404).json({ message: "Fest not found" });

    const userId = req.user.id;
    const upvoteIndex = fest.upvotes.findIndex(
      (id) => id.toString() === userId
    );

    if (upvoteIndex > -1) {
      fest.upvotes.splice(upvoteIndex, 1);
    } else {
      fest.upvotes.push(userId);
    }

    await fest.save();
    const populatedFest = await Fest.findById(fest._id).populate(
      "createdBy",
      "name"
    );
    res.json(populatedFest);
  } catch (err) {
    res.status(500).json({ message: "Server error while upvoting" });
  }
});
app.post("/api/orders/create", authMiddleware, async (req, res) => {
  const { products, totalAmount } = req.body;
  const userId = req.user.id;

  if (!products || products.length === 0 || !totalAmount) {
    return res.status(400).json({ message: "Missing order data." });
  }

  try {
    const newOrder = new Order({ userId, products, totalAmount });
    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully!", orderId: newOrder._id });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Server error while placing order." });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});