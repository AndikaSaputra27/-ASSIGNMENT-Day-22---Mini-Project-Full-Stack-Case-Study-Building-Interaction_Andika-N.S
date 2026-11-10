function formatCurrency(amount, currency = "IDR") {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: currency,
        maximumFractionDigits: currency === "IDR" ? 0 : 2
    }).format(amount);
}

function calculateSubtotal(price, quantity) {
    return price * quantity;
}

function validateQuantity(quantity, stock) {
    if (!Number.isInteger(quantity) || quantity < 1) {
        return "Jumlah harus berupa bilangan bulat minimal 1.";
    }

    if (quantity > stock) {
        return `Jumlah melebihi stok. Stok tersedia: ${stock}.`;
    }

    return "";
}

function showFeedback(element, message, type) {
    element.textContent = message;
    element.className = `feedback ${type}`;
}