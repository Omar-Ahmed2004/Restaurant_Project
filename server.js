import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin.html"));
});

app.get("/customer-login", (req, res) => {
    res.sendFile(
        path.join(__dirname, "views", "customer-login.html")
    );
});

app.get("/register", (req, res) => {
    res.sendFile(
        path.join(__dirname, "views", "register.html")
    );
});

app.get("/cart", (req, res) => {
    res.sendFile(
        path.join(__dirname, "views", "cart.html")
    );
});

app.get("/orders", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "orders.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});