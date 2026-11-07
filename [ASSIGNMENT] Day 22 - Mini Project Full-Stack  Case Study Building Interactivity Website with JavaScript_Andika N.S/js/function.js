
let cartTotal = 0;

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}

function validateQuantity(quantity, stock) {
    const value = String(quantity).trim();

    if (value === "") {
        return {
            valid: false,
            message: "Quantity tidak boleh kosong."
        };
    }

    const number = Number(value);

    if (!Number.isInteger(number) || number <= 0) {
        return {
            valid: false,
            message: "Quantity harus bilangan bulat positif."
        };
    }

    if (number > stock) {
        return {
            valid: false,
            message: `Quantity melebihi stok. Maksimal ${stock}.`
        };
    }

    return {
        valid: true,
        message: ""
    };
}

function calculateSubtotal(price, quantity) {
    return price * quantity;
}

function updateCartCount() {
    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = cartTotal;
    }
}

function showStatus(message, type) {
    const status = document.getElementById("status-message");

    if (!status) return;

    status.textContent = message;
    status.className = "status " + type;
}

function setupProductInteraction(productData) {
    const variation = document.getElementById("variation");
    const quantity = document.getElementById("quantity");
    const subtotal = document.getElementById("subtotal");
    const stock = document.getElementById("stock");
    const price = document.getElementById("product-price");
    const addButton = document.getElementById("add-to-cart");

    price.textContent = formatRupiah(productData.price);
    stock.textContent = productData.stock;

    // Isi pilihan variasi
    variation.replaceChildren();

    productData.variations.forEach(function (item) {
        const option = document.createElement("option");

        option.value = item;
        option.textContent = item;

        variation.appendChild(option);
    });

    quantity.value = "1";

    function updateSummary() {
        const result = validateQuantity(
            quantity.value,
            productData.stock
        );

        if (!result.valid) {
            subtotal.textContent = "-";
            showStatus(result.message, "error");
            addButton.disabled = true;
            return false;
        }

        const total = calculateSubtotal(
            productData.price,
            Number(quantity.value)
        );

        subtotal.textContent = formatRupiah(total);

        showStatus("", "");
        addButton.disabled = false;

        return true;
    }

    // Event quantity
    quantity.addEventListener("input", updateSummary);

    // Event variasi
    variation.addEventListener("change", function () {
        showStatus(
            "Variasi dipilih: " + variation.value,
            "success"
        );

        updateSummary();
    });

    // Event Add to Cart
    addButton.addEventListener("click", function () {
        if (!updateSummary()) {
            return;
        }

        const selectedQuantity = Number(quantity.value);

        cartTotal += selectedQuantity;

        updateCartCount();

        showStatus(
            selectedQuantity + " produk berhasil ditambahkan ke cart!",
            "success"
        );
    });

    updateSummary();
}
