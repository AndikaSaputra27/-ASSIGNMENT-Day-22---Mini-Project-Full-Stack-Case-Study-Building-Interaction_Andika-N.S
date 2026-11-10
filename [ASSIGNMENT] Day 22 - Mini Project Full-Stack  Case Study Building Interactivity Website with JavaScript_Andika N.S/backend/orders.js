const express = require("express");
const router = express.Router();

const { db } = require("../db");

router.post("/", (req, res) => {
    const {
        productId,
        productTitle,
        quantity,
        unitPrice
    } = req.body;

    if (
        !productId ||
        typeof productTitle !== "string" ||
        !productTitle.trim() ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        typeof unitPrice !== "number" ||
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Data pesanan tidak valid."
        });
    }

    const totalPrice = quantity * unitPrice;

    db.run(
        `INSERT INTO orders
        (product_id, product_title, quantity, unit_price, total_price)
        VALUES (?, ?, ?, ?, ?)`,
        [
            String(productId),
            productTitle.trim(),
            quantity,
            unitPrice,
            totalPrice
        ],
        function (error) {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Pesanan gagal disimpan ke database."
                });
            }

            res.status(201).json({
                success: true,
                message: "Pesanan berhasil disimpan.",
                data: {
                    orderId: this.lastID,
                    productId: String(productId),
                    productTitle: productTitle.trim(),
                    quantity,
                    unitPrice,
                    totalPrice
                }
            });
        }
    );
});

router.get("/", (req, res) => {
    db.all(
        "SELECT * FROM orders ORDER BY id DESC",
        [],
        (error, rows) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Gagal mengambil data pesanan."
                });
            }

            res.json({
                success: true,
                data: rows
            });
        }
    );
});

module.exports = router;