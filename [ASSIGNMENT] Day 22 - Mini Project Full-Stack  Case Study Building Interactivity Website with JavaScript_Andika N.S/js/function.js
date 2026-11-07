// Jumlah produk dalam cart
let cartTotal = 0;


// FORMAT HARGA RUPIAH
function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}


// VALIDASI JUMLAH PRODUK
function validateQuantity(quantity, stock) {
    const value = String(quantity).trim();

    if (value === "") {
        return {
            valid: false,
            message: "Jumlah pembelian tidak boleh kosong."
        };
    }

    const number = Number(value);

    if (!Number.isInteger(number) || number <= 0) {
        return {
            valid: false,
            message: "Jumlah harus berupa bilangan bulat positif."
        };
    }

    if (number > stock) {
        return {
            valid: false,
            message: `Stok tidak mencukupi. Maksimal pembelian ${stock}.`
        };
    }

    return {
        valid: true,
        message: ""
    };
}


// MENGHITUNG SUBTOTAL
function calculateSubtotal(price, quantity) {
    return price * quantity;
}


// UPDATE JUMLAH CART
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = cartTotal;
    }
}


// MENAMPILKAN PESAN
function showStatus(message, type = "") {
    const status = document.getElementById("status-message");

    if (!status) return;

    status.textContent = message;
    status.className = type
        ? `status ${type}`
        : "status";
}


// MEMBUAT PILIHAN UKURAN DAN WARNA
function renderProductOptions(productData) {
    const variation = document.getElementById("variation");
    const color = document.getElementById("color");

    variation.replaceChildren();
    color.replaceChildren();

    productData.variations.forEach((size) => {
        const option = document.createElement("option");

        option.value = size;
        option.textContent = size;

        variation.appendChild(option);
    });

    productData.colors.forEach((colorName) => {
        const option = document.createElement("option");

        option.value = colorName;
        option.textContent = colorName;

        color.appendChild(option);
    });
}


// FITUR ZOOM GAMBAR
function setupImageZoom() {
    const image = document.getElementById("product-image");

    const zoomIn = document.getElementById("zoom-in");
    const zoomOut = document.getElementById("zoom-out");
    const zoomReset = document.getElementById("zoom-reset");

    const zoomLevel = document.getElementById("zoom-level");

    let scale = 1;

    const minScale = 0.5;
    const maxScale = 2.5;
    const step = 0.25;

    function applyZoom() {
        image.style.transform = `scale(${scale})`;

        zoomLevel.textContent =
            `Zoom: ${Math.round(scale * 100)}%`;
    }

    zoomIn.addEventListener("click", function () {
        scale = Math.min(maxScale, scale + step);

        applyZoom();
    });

    zoomOut.addEventListener("click", function () {
        scale = Math.max(minScale, scale - step);

        applyZoom();
    });

    zoomReset.addEventListener("click", function () {
        scale = 1;

        applyZoom();
    });

    applyZoom();
}


// INTERAKSI PRODUK
function setupProductInteraction(productData) {
    const variation = document.getElementById("variation");
    const color = document.getElementById("color");

    const quantity = document.getElementById("quantity");

    const subtotal = document.getElementById("subtotal");
    const stock = document.getElementById("stock");

    const price = document.getElementById("product-price");

    const addButton = document.getElementById("add-to-cart");


    // Tampilkan harga dan stok
    price.textContent = formatRupiah(productData.price);

    stock.textContent = productData.stock;


    // Tampilkan pilihan ukuran dan warna
    renderProductOptions(productData);


    // Jumlah awal
    quantity.value = 1;


    // Update subtotal
    function updateSummary() {
        const validation = validateQuantity(
            quantity.value,
            productData.stock
        );

        if (!validation.valid) {
            subtotal.textContent = "-";

            showStatus(validation.message, "error");

            addButton.disabled = true;

            return false;
        }

        const total = calculateSubtotal(
            productData.price,
            Number(quantity.value)
        );

        subtotal.textContent = formatRupiah(total);

        showStatus("");

        addButton.disabled = false;

        return true;
    }


    // Event jumlah pembelian
    quantity.addEventListener("input", updateSummary);


    // Event pilihan ukuran
    variation.addEventListener("change", function () {
        updateSummary();

        showStatus(
            `Ukuran ${variation.value} berhasil dipilih.`,
            "success"
        );
    });


    // Event pilihan warna
    color.addEventListener("change", function () {
        updateSummary();

        showStatus(
            `Warna ${color.value} berhasil dipilih.`,
            "success"
        );
    });


    // Event tombol Add to Cart
    addButton.addEventListener("click", function () {
        if (!updateSummary()) return;

        const selectedQuantity = Number(quantity.value);

        cartTotal += selectedQuantity;

        updateCartCount();

        showStatus(
            `${selectedQuantity} kaos ukuran ${variation.value} warna ${color.value} berhasil ditambahkan ke cart.`,
            "success"
        );
    });


    updateSummary();
}