
const API_URL = "https://dummyjson.com/products/1";

document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading");
    const errorContainer = document.getElementById("error-container");
    const errorMessage = document.getElementById("error-message");
    const productSection = document.getElementById("product-section");
    const retryButton = document.getElementById("retry-button");

    let interactionInitialized = false;

    async function loadProduct() {
        loading.hidden = false;
        errorContainer.hidden = true;
        productSection.hidden = true;
        retryButton.disabled = true;

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            const apiProduct = {
                id: data.id,
                name: data.title,
                price: data.price,
                description: data.description,
                image: data.thumbnail,
                stock: data.stock,
                variations: ["Default"]
            };

            if (
                !apiProduct.name ||
                typeof apiProduct.price !== "number" ||
                typeof apiProduct.stock !== "number"
            ) {
                throw new Error("Format data API tidak sesuai.");
            }

            document.getElementById("product-name").textContent =
                apiProduct.name;

            document.getElementById("product-description").textContent =
                apiProduct.description;

            const image = document.getElementById("product-image");
            image.src = apiProduct.image;
            image.alt = apiProduct.name;

            if (!interactionInitialized) {
                setupProductInteraction(apiProduct);
                interactionInitialized = true;
            }

            updateCartCount();
            productSection.hidden = false;

        } catch (error) {
            console.error("API Error:", error);

            errorMessage.textContent =
                "Gagal memuat produk: " + error.message;

            errorContainer.hidden = false;

        } finally {
            loading.hidden = true;
            retryButton.disabled = false;
        }
    }

    retryButton.addEventListener("click", loadProduct);

    loadProduct();
});
