document.addEventListener("DOMContentLoaded", () => {
    const image = document.getElementById("product-image");
    const name = document.getElementById("product-name");
    const description = document.getElementById("product-description");

    if (image) {
        image.src = product.image;
        image.alt = product.name;
    }

    if (name) {
        name.textContent = product.name;
    }

    if (description) {
        description.textContent = product.description;
    }

    setupProductInteraction(product);
    setupColorPreview();
    setupImageZoom();
    updateCartCount();

    setupComplaintForm();
});

function setupComplaintForm() {
    const form = document.getElementById("complaint-form");
    const status = document.getElementById("complaint-status");

    if (!form || !status) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const complaint = {
            name: document.getElementById("complaint-name").value.trim(),
            orderNumber: document.getElementById("order-number").value.trim(),
            type: document.getElementById("complaint-type").value,
            receivedColor: document.getElementById("received-color").value,
            expectedColor: document.getElementById("expected-color").value,
            receivedSize: document.getElementById("received-size").value,
            expectedSize: document.getElementById("expected-size").value,
            detail: document.getElementById("complaint-detail").value.trim(),
            submittedAt: new Date().toISOString()
        };

        const values = Object.values(complaint);

        if (values.some(value => value === "")) {
            status.textContent = "Semua kolom wajib diisi.";
            status.className = "status error";
            return;
        }

        try {
            const savedComplaints = JSON.parse(
                localStorage.getItem("mystore-complaints") || "[]"
            );

            if (!Array.isArray(savedComplaints)) {
                throw new Error("Data komplain tidak valid.");
            }

            savedComplaints.push(complaint);

            localStorage.setItem(
                "mystore-complaints",
                JSON.stringify(savedComplaints)
            );

            status.textContent =
                "Komplain berhasil disimpan di browser.";

            status.className = "status success";

            form.reset();

        } catch (error) {
            status.textContent =
                "Komplain gagal disimpan. Periksa penyimpanan browser.";

            status.className = "status error";

            console.error(error);
        }
    });
}