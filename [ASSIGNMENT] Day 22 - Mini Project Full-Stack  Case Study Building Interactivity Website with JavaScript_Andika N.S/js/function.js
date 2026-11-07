let cartTotal = 0;

const colorFilters = {
    "Hitam": "grayscale(1) brightness(0.45)",
    "Putih": "grayscale(1) brightness(2.2) contrast(0.5)",
    "Khaky": "sepia(0.65) saturate(0.8) hue-rotate(350deg)",
    "Navy": "none",
    "Maroon": "hue-rotate(125deg) saturate(1.5)",
    "Pink": "hue-rotate(285deg) saturate(1.5)",
    "Sage Green": "hue-rotate(65deg) saturate(0.7)"
};

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

function validateQuantity(quantity, stock) {
    if (quantity === "" || quantity === null) {
        return {
            valid: false,
            message: "Jumlah pembelian wajib diisi."
        };
    }

    const number = Number(quantity);

    if (!Number.isInteger(number) || number <= 0) {
        return {
            valid: false,
            message: "Jumlah harus berupa bilangan bulat lebih dari 0."
        };
    }

    if (number > stock) {
        return {
            valid: false,
            message: `Stok hanya tersedia ${stock} produk.`
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

function showStatus(message, type = "success") {
    const status = document.getElementById("status-message");

    if (!status) return;

    status.textContent = message;
    status.className = `status ${type}`;
}

function renderProductOptions(productData) {
    const sizeSelect = document.getElementById("variation");
    const colorSelect = document.getElementById("color");

    if (!sizeSelect || !colorSelect) return;

    sizeSelect.innerHTML = "";
    colorSelect.innerHTML = "";

    productData.variations.forEach(size => {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });

    productData.colors.forEach(color => {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        colorSelect.appendChild(option);
    });

    sizeSelect.value = productData.variations.includes("M")
        ? "M"
        : productData.variations[0];

    colorSelect.value = productData.colors.includes("Navy")
        ? "Navy"
        : productData.colors[0];
}

function setupColorPreview() {
    const colorSelect = document.getElementById("color");
    const productImage = document.getElementById("product-image");
    const colorPreview = document.getElementById("color-preview");

    if (!colorSelect || !productImage || !colorPreview) return;

    function updateColor() {
        const selectedColor = colorSelect.value;

        productImage.style.filter =
            colorFilters[selectedColor] || "none";

        colorPreview.textContent =
            `Warna dipilih: ${selectedColor}`;
    }

    colorSelect.addEventListener("change", updateColor);

    updateColor();
}

function setupImageZoom() {
    const image = document.getElementById("product-image");
    const zoomIn = document.getElementById("zoom-in");
    const zoomOut = document.getElementById("zoom-out");
    const zoomReset = document.getElementById("zoom-reset");
    const zoomLevel = document.getElementById("zoom-level");

    if (!image || !zoomIn || !zoomOut || !zoomReset || !zoomLevel) {
        return;
    }

    let scale = 1;

    function updateZoom() {
        image.style.transform = `scale(${scale})`;
        zoomLevel.textContent = `${Math.round(scale * 100)}%`;
    }

    zoomIn.addEventListener("click", () => {
        if (scale < 2.5) {
            scale = Math.min(2.5, scale + 0.25);
            updateZoom();
        }
    });

    zoomOut.addEventListener("click", () => {
        if (scale > 0.5) {
            scale = Math.max(0.5, scale - 0.25);
            updateZoom();
        }
    });

    zoomReset.addEventListener("click", () => {
        scale = 1;
        updateZoom();
    });
}

function setupProductInteraction(productData) {
    const quantityInput = document.getElementById("quantity");
    const subtotalElement = document.getElementById("subtotal");
    const addButton = document.getElementById("add-to-cart");
    const priceElement = document.getElementById("product-price");
    const stockElement = document.getElementById("stock");

    if (
        !quantityInput ||
        !subtotalElement ||
        !addButton ||
        !priceElement ||
        !stockElement
    ) {
        return;
    }

    priceElement.textContent = formatRupiah(productData.price);
    stockElement.textContent = productData.stock;

    renderProductOptions(productData);

    quantityInput.value = 1;

    function updateSubtotal() {
        const validation = validateQuantity(
            quantityInput.value,
            productData.stock
        );

        if (!validation.valid) {
            subtotalElement.textContent = formatRupiah(0);
            showStatus(validation.message, "error");
            addButton.disabled = true;
            return;
        }

        const subtotal = calculateSubtotal(
            productData.price,
            Number(quantityInput.value)
        );

        subtotalElement.textContent = formatRupiah(subtotal);
        showStatus("", "success");
        addButton.disabled = false;
    }

    quantityInput.addEventListener("input", updateSubtotal);

    addButton.addEventListener("click", () => {
        const validation = validateQuantity(
            quantityInput.value,
            productData.stock
        );

        if (!validation.valid) {
            showStatus(validation.message, "error");
            return;
        }

        const selectedColor =
            document.getElementById("color").value;

        const selectedSize =
            document.getElementById("variation").value;

        const quantity = Number(quantityInput.value);

        cartTotal += quantity;

        updateCartCount();

        showStatus(
            `${quantity} kaos warna ${selectedColor}, ukuran ${selectedSize} berhasil ditambahkan ke keranjang.`,
            "success"
        );
    });

    updateSubtotal();
}