
document.addEventListener("DOMContentLoaded", function () {

    const productName = document.getElementById("product-name");
    const productDescription = document.getElementById("product-description");
    const productImage = document.getElementById("product-image");

    productName.textContent = product.name;
    productDescription.textContent = product.description;

    productImage.src = product.image;
    productImage.alt = product.name;

    setupProductInteraction(product);

    updateCartCount();

});
