# Onboarding Buddy

> Halaman checklist interaktif untuk membantu karyawan baru menyelesaikan tugas di minggu pertama kerja.

---

## 🚀 Cara Menjalankan

Tidak perlu instalasi atau koneksi internet.

1. Pastikan ketiga file berada dalam satu folder:
   ```
   📁 project/
   ├── index.html
   ├── style.css
   └── script.js
   ```
2. **Buka `index.html`** langsung di browser (Chrome, Firefox, Edge, Safari).
3. Aplikasi langsung berjalan — selesai.

---

## 🧩 Cara Pakai

| Aksi | Cara |
|---|---|
| Centang tugas | Klik checkbox di samping nama tugas |
| Hapus tugas | Hover item → klik tombol **✕** |
| Tambah tugas | Ketik di kolom input → klik **+ Tambah** atau tekan **Enter** |

Progress bar di bagian atas otomatis memperbarui persentase setiap kali ada perubahan.

---

## ⚙️ Cara Kerja Logika

### State

Semua tugas disimpan dalam array `tasks` di memori:

```js
tasks = [
  { id: 1, text: 'Perkenalkan diri ke seluruh anggota tim', done: false },
  ...
]
```

Tidak ada database atau localStorage — data kembali ke default saat halaman di-refresh.

### Alur Utama

```
render()
  └─ buildItem(task)  →  <li> dengan checkbox, label, tombol hapus
  └─ updateProgress() →  hitung done/total → update progress bar & teks

toggleTask(id)   →  ubah task.done → update elemen DOM langsung → updateProgress()
deleteTask(id)   →  filter tasks → hapus <li> dari DOM → updateProgress()
addTask()        →  validasi input → push ke tasks → buildItem → append → updateProgress()
```

### `updateProgress()` — Satu Sumber Kebenaran

```js
const done = tasks.filter(t => t.done).length;
const pct  = total === 0 ? 0 : Math.round((done / total) * 100);
```

Fungsi ini dipanggil setiap kali ada perubahan dan memperbarui tiga hal sekaligus: lebar progress bar, teks deskriptif, dan angka persentase. Tidak ada perhitungan ganda di tempat lain.

### Optimasi Render

`toggleTask` **tidak** merender ulang seluruh list. Ia hanya menyentuh elemen `<li>` yang berubah via `querySelector`, sehingga performa tetap baik meski daftar tugas panjang.

---

## 🛠️ Teknologi

- **HTML5** semantik (ARIA roles, `aria-live`, `aria-label`)
- **CSS3** dengan Custom Properties (design tokens teal + amber)
- **JavaScript ES6+** vanilla — tanpa framework, tanpa library

---

## 📄 Lisensi

MIT — bebas digunakan dan dimodifikasi.
