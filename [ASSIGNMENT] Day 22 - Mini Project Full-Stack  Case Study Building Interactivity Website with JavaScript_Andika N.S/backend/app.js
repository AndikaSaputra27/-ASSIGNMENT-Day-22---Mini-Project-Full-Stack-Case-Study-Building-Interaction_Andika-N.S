document.addEventListener("DOMContentLoaded", () => {

    const quantityInput =
        document.getElementById("quantity");

    const subtotalElement =
        document.getElementById("subtotal");

    const feedbackElement =
        document.getElementById("feedback");

    const sizeSelect =
        document.getElementById("size");

    const addButton =
        document.getElementById("add-to-cart");

    const product = hardcodedProduct;

    // Menampilkan data produk hardcode
    document.getElementById("product-title").textContent =
        product.title;

    document.getElementById("product-category").textContent =
        product.category;

    document.getElementById("product-description").textContent =
        product.description;

    document.getElementById("product-price").textContent =
        formatCurrency(product.price);

    document.getElementById("stock-info").textContent =
        `Stok tersedia: ${product.stock}`;

    document.getElementById("product-image").src =
        product.image;

    quantityInput.max = String(product.stock);

    // Menghitung subtotal
    function updateSubtotal() {
        const quantity = Number(quantityInput.value);

        subtotalElement.textContent = formatCurrency(
            calculateSubtotal(product.price, quantity)
        );
    }

    // Tombol kurangi jumlah
    document
        .getElementById("decrease")
        .addEventListener("click", () => {

            const current = Number(quantityInput.value) || 1;

            quantityInput.value = String(
                Math.max(1, current - 1)
            );

            updateSubtotal();
        });

    // Tombol tambah jumlah
    document
        .getElementById("increase")
        .addEventListener("click", () => {

            const current = Number(quantityInput.value) || 0;

            quantityInput.value = String(
                Math.min(product.stock, current + 1)
            );

            updateSubtotal();
        });

    // Jika input jumlah berubah
    quantityInput.addEventListener("input", updateSubtotal);

    // Tombol pesan
    addButton.addEventListener("click", async () => {

        const selectedSize = sizeSelect.value;

        const currentQuantity = Number(quantityInput.value);

        const validationMessage = validateQuantity(
            currentQuantity,
            product.stock
        );

        if (validationMessage) {
            showFeedback(
                feedbackElement,
                validationMessage,
                "error"
            );

            return;
        }

        if (!selectedSize) {
            showFeedback(
                feedbackElement,
                "Silakan pilih ukuran terlebih dahulu.",
                "error"
            );

            return;
        }

        addButton.disabled = true;
        addButton.textContent = "Menyimpan...";

        try {
            const response = await fetch("/api/orders", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    productId: `${product.id}-${selectedSize}`,

                    productTitle:
                        `${product.title} (Ukuran ${selectedSize})`,

                    quantity: currentQuantity,

                    unitPrice: product.price
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Pesanan gagal disimpan."
                );
            }

            showFeedback(
                feedbackElement,
                `Pesanan berhasil disimpan! Nomor pesanan: #${result.data.orderId}`,
                "success"
            );

        } catch (error) {
            showFeedback(
                feedbackElement,
                error.message || "Tidak dapat terhubung ke server.",
                "error"
            );

        } finally {
            addButton.disabled = false;
            addButton.textContent = "Pesan Sekarang";
        }
    });

    updateSubtotal();
});