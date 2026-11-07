
# Day 22 - Adding Interactivity to Websites with JavaScript

## Deskripsi
Mini Project Day 22 merupakan project untuk
menambahkan interaktivitas website menggunakan
JavaScript Vanilla.

Project memiliki dua halaman:

1. Hardcoded Product (index.html)
2. API Product (api.html)

## Teknologi
- HTML5
- CSS3
- JavaScript Vanilla
- DOM Manipulation
- Event Handling
- Fetch API
- Promise
- Async/Await
- Error Handling

## Fitur
- Menampilkan detail produk.
- Memilih variasi produk.
- Mengubah quantity.
- Menghitung subtotal otomatis.
- Validasi quantity.
- Add to Cart.
- Update cart count.
- Loading state.
- Error state.
- Retry request API.

## Endpoint API
Contoh endpoint:
https://dummyjson.com/products/1

Catatan:
Endpoint tersebut adalah contoh mandiri.
Untuk pengumpulan, gunakan endpoint baseline
Study Case Phase 1.

## Cara Menjalankan
1. Buka folder project di VS Code.
2. Install Live Server.
3. Klik kanan index.html.
4. Pilih Open with Live Server.
5. Buka halaman API Product.

## Pengujian

| No | Kondisi | Expected Result | Actual Result |
|---|---|---|---|
| 1 | Buka index.html | Produk tampil | Belum diuji |
| 2 | Quantity 2 | Subtotal Rp300.000 | Belum diuji |
| 3 | Quantity 0 | Error validasi | Belum diuji |
| 4 | Quantity -1 | Error validasi | Belum diuji |
| 5 | Quantity 1.5 | Error validasi | Belum diuji |
| 6 | Quantity 11 | Melebihi stok | Belum diuji |
| 7 | Add to Cart | Cart bertambah | Belum diuji |
| 8 | Buka api.html | Loading lalu produk tampil | Belum diuji |
| 9 | Request gagal | Error ditampilkan | Belum diuji |
| 10 | Retry | Request diulang | Belum diuji |

## Penggunaan AI

AI digunakan sebagai alat bantu pembelajaran untuk:

1. Memahami DOM Manipulation.
2. Memahami Event Handling.
3. Memahami Fetch API dan Async/Await.
4. Membantu mencari penyebab error.
5. Membantu menyusun struktur project.
6. Membantu membuat dokumentasi dan pengujian.

Student bertanggung jawab memahami,
memeriksa, dan menguji seluruh kode.

Pengujian dilakukan menggunakan VS Code
dan browser.

AI digunakan sebagai pendamping belajar,
bukan pengganti pemahaman student.

Tidak membagikan API key, password,
atau credential rahasia.
