document.addEventListener("DOMContentLoaded", () => {

    const loadingElement =
        document.getElementById("loading");

    const errorContainer =
        document.getElementById("error-container");

    const errorMessage =
        document.getElementById("error-message");

    const productSection =
        document.getElementById("product-section");

    const retryButton =
        document.getElementById("retry-button");

    const quantityInput =
        document.getElementById("quantity");

    const subtotalElement =
        document.getElementById("subtotal");

    const feedbackElement =
        document.getElementById("feedback");

    const addButton =
        document.getElementById("add-to-cart");

    let product = null;

    // Menampilkan data produk dari API
    function renderProduct(data) {
        product = data;

        document.getElementById("product-title").textContent =
            data.title;

        document.getElementById("product-category").textContent =
            data.category;

        document.getElementById("product-brand").textContent =
            `Brand: ${data.brand}`;

        document.getElementById("product-price").textContent =
            formatCurrency(data.price, "USD");

        document.getElementById("product-description").textContent =
            data.description;

        document.getElementById("stock-info").textContent =
            `Stok tersedia: ${data.stock}`;

        document.getElementById("rating-info").textContent =
            `Rating: ${data.rating} / 5`;

        document.getElementById("product-image").src =
            data.thumbnail || "";

        document.getElementById("product-image").alt =
            data.title;

        quantityInput.max = String(data.stock);
        quantityInput.value = "1";

        updateSubtotal();

        loadingElement.hidden = true;
        errorContainer.hidden = true;
        productSection.hidden = false;
    }

    // Menghitung subtotal
    function updateSubtotal() {
        if (!product) {
            return;
        }

        const quantity = Number(quantityInput.value);

        subtotalElement.textContent = formatCurrency(
            calculateSubtotal(product.price, quantity),
            "USD"
        );
    }

    // Mengambil data produk dari backend
    async function loadProduct() {
        loadingElement.hidden = false;
        errorContainer.hidden = true;
        productSection.hidden = true;

        retryButton.disabled = true;

        try {
            const response = await fetch("/api/products/2");

            const result = await response.json();

            if (
                !response.ok ||
                !result.success ||
                !result.data
            ) {
                throw new Error(
                    result.message || "Gagal mengambil data produk."
                );
            }

            renderProduct(result.data);

        } catch (error) {

            loadingElement.hidden = true;
            errorContainer.hidden = false;

            errorMessage.textContent =
                error.message || "Terjadi kesalahan jaringan.";

        } finally {
            retryButton.disabled = false;
        }
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

            if (!product) {
                return;
            }

            const current = Number(quantityInput.value) || 0;

            quantityInput.value = String(
                Math.min(product.stock, current + 1)
            );

            updateSubtotal();
        });

    quantityInput.addEventListener("input", updateSubtotal);

    // Tombol retry
    retryButton.addEventListener("click", loadProduct);

    // Tombol pesan
    addButton.addEventListener("click", async () => {

        if (!product) {
            return;
        }

        const quantity = Number(quantityInput.value);

        const validationMessage = validateQuantity(
            quantity,
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

        addButton.disabled = true;
        addButton.textContent = "Menyimpan...";

        try {
            const response = await fetch("/api/orders", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    productId: product.id,
                    productTitle: product.title,
                    quantity: quantity,
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

    // Jalankan pengambilan API ketika halaman dibuka
    loadProduct();
});