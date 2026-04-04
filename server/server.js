import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://barcode-frontend-xb0s.onrender.com",
  "http://192.168.1.5:5173"
];

// ✅ CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // 🔥 enable if using cookies/auth
  })
);

// ✅ Handle preflight requests
app.options("*", cors());

app.use(express.json());

// ✅ Connect DB
connectDB();

// ✅ Routes
app.use("/api/product", productRoutes);
app.use("/api/sale", salesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user", userRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("POS Server Running");
});

// ✅ Port setup
const port = process.env.PORT || 3000;

// ✅ Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
