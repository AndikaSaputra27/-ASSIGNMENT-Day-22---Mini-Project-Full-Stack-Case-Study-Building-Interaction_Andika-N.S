const express = require("express");
const cors = require("cors");
const path = require("path");

const {
    initializeDatabase
} = require("./db");

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const app = express();

const PORT = process.env.PORT || 3000;

const frontendPath = path.join(
    __dirname,
    "..",
    "frontend"
);

app.use(cors());
app.use(express.json());

app.use(express.static(frontendPath));

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server berjalan dengan baik."
    });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
    res.sendFile(
        path.join(frontendPath, "index.html")
    );
});

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `Server berjalan: http://localhost:${PORT}`
            );

            console.log(
                `Product 1: http://localhost:${PORT}/index.html`
            );

            console.log(
                `Product 2: http://localhost:${PORT}/api.html`
            );
        });
    })
    .catch((error) => {
        console.error(
            "Database gagal diinisialisasi:",
            error
        );

        process.exit(1);
    });