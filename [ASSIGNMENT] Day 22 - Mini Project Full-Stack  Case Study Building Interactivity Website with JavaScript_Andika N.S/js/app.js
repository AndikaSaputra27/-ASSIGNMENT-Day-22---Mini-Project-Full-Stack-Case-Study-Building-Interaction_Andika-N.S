document.addEventListener("DOMContentLoaded", function () {

    // ELEMENT PRODUK
    const productName = document.getElementById("product-name");

    const productDescription =
        document.getElementById("product-description");

    const productImage = document.getElementById("product-image");


    // TAMPILKAN DATA PRODUK
    productName.textContent = product.name;

    productDescription.textContent = product.description;

    productImage.src = product.image;

    productImage.alt = product.name;


    // JALANKAN FITUR PRODUK
    setupProductInteraction(product);

    setupImageZoom();

    updateCartCount();


    // FORM KOMPLAIN
    setupComplaintForm();

});


// FUNGSI FORM KOMPLAIN
function setupComplaintForm() {

    const complaintForm =
        document.getElementById("complaint-form");

    const complaintStatus =
        document.getElementById("complaint-status");


    complaintForm.addEventListener("submit", function (event) {

        // Mencegah halaman refresh
        event.preventDefault();


        // AMBIL DATA FORM
        const complaint = {

            name: document
                .getElementById("complaint-name")
                .value
                .trim(),

            orderNumber: document
                .getElementById("order-number")
                .value
                .trim(),

            type: document
                .getElementById("complaint-type")
                .value,

            receivedColor: document
                .getElementById("received-color")
                .value,

            expectedColor: document
                .getElementById("expected-color")
                .value,

            receivedSize: document
                .getElementById("received-size")
                .value,

            expectedSize: document
                .getElementById("expected-size")
                .value,

            detail: document
                .getElementById("complaint-detail")
                .value
                .trim(),

            submittedAt: new Date().toLocaleString("id-ID")
        };


        // VALIDASI FORM
        if (
            !complaint.name ||
            !complaint.orderNumber ||
            !complaint.type ||
            !complaint.receivedColor ||
            !complaint.expectedColor ||
            !complaint.receivedSize ||
            !complaint.expectedSize ||
            !complaint.detail
        ) {

            complaintStatus.textContent =
                "Mohon lengkapi semua data komplain.";

            complaintStatus.className = "status error";

            return;
        }


        // AMBIL DATA KOMPLAIN SEBELUMNYA
        let complaints = [];

        try {

            complaints = JSON.parse(
                localStorage.getItem("mystore-complaints")
            ) || [];

        } catch (error) {

            complaints = [];

        }


        // SIMPAN KOMPLAIN BARU
        complaints.push(complaint);


        try {

            localStorage.setItem(
                "mystore-complaints",
                JSON.stringify(complaints)
            );

        } catch (error) {

            complaintStatus.textContent =
                "Komplain gagal disimpan di browser.";

            complaintStatus.className = "status error";

            return;
        }


        // PESAN BERHASIL
        complaintStatus.textContent =
            "Komplain berhasil dicatat! Nomor pesanan: " +
            complaint.orderNumber +
            ". Terima kasih atas laporan Anda.";

        complaintStatus.className = "status success";


        // KOSONGKAN FORM
        complaintForm.reset();

    });

}