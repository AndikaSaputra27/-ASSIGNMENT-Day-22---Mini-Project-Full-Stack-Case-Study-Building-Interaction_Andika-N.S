// ========================================
// API CONFIGURATION
// ========================================

const API_URL = "https://dummyjson.com/products/1";


// ========================================
// LOAD PRODUCT FROM API
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // Mengambil elemen HTML
    const loading = document.getElementById("loading");

    const errorContainer =
        document.getElementById("error-container");

    const errorMessage =
        document.getElementById("error-message");

    const productSection =
        document.getElementById("product-section");

    const retryButton =
        document.getElementById("retry-button");


    // Mencegah event listener dipasang berulang
    let interactionInitialized = false;


    // ========================================
    // FUNCTION LOAD PRODUCT
    // ========================================

    async function loadProduct() {

        // Tampilkan loading
        loading.hidden = false;

        // Sembunyikan error
        errorContainer.hidden = true;

        // Sembunyikan produk selama loading
        productSection.hidden = true;

        // Nonaktifkan tombol retry
        retryButton.disabled = true;


        try {

            // ========================================
            // FETCH API
            // ========================================

            const response = await fetch(API_URL);


            // ========================================
            // CEK RESPONSE
            // ========================================

            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );

            }


            // ========================================
            // KONVERSI DATA KE JSON
            // ========================================

            const data = await response.json();


            // ========================================
            // MAPPING DATA API
            // ========================================

            const apiProduct = {

                id: data.id,

                name: data.title,

                price: data.price,

                description: data.description,

                image: data.thumbnail,

                stock: data.stock,

                // Pilihan ukuran lokal
                variations: [
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                    "3L"
                ],

                // Pilihan warna lokal
                colors: [
                    "Hitam",
                    "Putih",
                    "Khaky",
                    "Navy",
                    "Maroon",
                    "Pink",
                    "Sage Green"
                ]

            };


            // ========================================
            // VALIDASI DATA API
            // ========================================

            if (
                !apiProduct.name ||
                typeof apiProduct.price !== "number" ||
                typeof apiProduct.stock !== "number" ||
                !apiProduct.image
            ) {

                throw new Error(
                    "Format data API tidak sesuai."
                );

            }


            // ========================================
            // MENAMPILKAN NAMA PRODUK
            // ========================================

            document.getElementById("product-name").textContent =
                apiProduct.name;


            // ========================================
            // MENAMPILKAN DESKRIPSI
            // ========================================

            document.getElementById("product-description").textContent =
                apiProduct.description;


            // ========================================
            // MENAMPILKAN GAMBAR
            // ========================================

            const image =
                document.getElementById("product-image");

            image.src = apiProduct.image;

            image.alt = apiProduct.name;


            // ========================================
            // MENAMPILKAN INTERAKSI PRODUK
            // ========================================

            if (!interactionInitialized) {

                setupProductInteraction(apiProduct);

                interactionInitialized = true;

            }


            // ========================================
            // UPDATE CART
            // ========================================

            updateCartCount();


            // ========================================
            // TAMPILKAN PRODUK
            // ========================================

            productSection.hidden = false;


        } catch (error) {

            // ========================================
            // ERROR HANDLING
            // ========================================

            console.error("API Error:", error);

            errorMessage.textContent =
                "Gagal memuat produk: " + error.message;

            errorContainer.hidden = false;


        } finally {

            // ========================================
            // HILANGKAN LOADING
            // ========================================

            loading.hidden = true;

            // Aktifkan kembali tombol retry
            retryButton.disabled = false;

        }

    }


    // ========================================
    // EVENT LISTENER RETRY BUTTON
    // ========================================

    retryButton.addEventListener("click", function () {

        loadProduct();

    });


    // ========================================
    // REQUEST PERTAMA
    // ========================================

    loadProduct();

});