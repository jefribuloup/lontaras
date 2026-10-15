# Lontaras

Website resmi **[Nama PT]** — dibangun dengan **Flask (HTML + Jinja2)** dan dideploy di **Vercel**.

- Domain: https://lontaras.com
- Status: v1 (Flask) — direncanakan migrasi ke **Next.js**

---

## Tech Stack (saat ini)

| Bagian | Teknologi |
|---|---|
| Backend / routing | Python 3, Flask |
| Template | Jinja2 (HTML) |
| Styling | CSS di `static/` (atau `public/`) |
| Hosting | Vercel |
| Domain & DNS | Dewaweb |

---

## Struktur Folder

```
.
├── app.py              # Entry point Flask (wajib ada variabel `app`)
├── requirements.txt    # Dependensi Python
├── templates/          # File HTML (Jinja2)
│   ├── base.html
│   └── index.html
├── static/             # CSS, JS, gambar
│   ├── css/
│   ├── js/
│   └── img/
├── .gitignore
├── .env.example        # Contoh variabel lingkungan (tanpa nilai rahasia)
└── README.md
```

---

## Menjalankan Secara Lokal

```bash
# 1. Clone repo
git clone https://github.com/<username>/<nama-repo>.git
cd <nama-repo>

# 2. Buat virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependensi
pip install -r requirements.txt

# 4. Jalankan
flask --app app run --debug
```

Buka http://127.0.0.1:5000

---

## Contoh Minimal `app.py`

```python
from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
```

## Contoh `requirements.txt`

```
Flask>=3.0
```

---

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di Vercel: **Add New → Project → Import** repo ini.
3. Framework akan terdeteksi otomatis (Flask). Biarkan pengaturan default.
4. Tambahkan **Environment Variables** (jika ada) di **Settings → Environment Variables**.
5. Klik **Deploy**.

> Pastikan `app.py` berada di root repo dan memiliki variabel `app = Flask(__name__)`.
> Jika deteksi otomatis gagal, gunakan struktur alternatif: pindahkan entry point ke `api/index.py` dan tambahkan `vercel.json` dengan rewrite ke `/api/index`. Cek dokumentasi Vercel terbaru untuk Flask.

---

## Menghubungkan Domain (lontaras.com)

1. Di Vercel: **Project → Settings → Domains → Add** → masukkan `lontaras.com`.
2. Salin record DNS yang ditampilkan Vercel (jangan dari sumber lain).
3. Tambahkan record tersebut di **DNS Management Dewaweb**:
   - `A` untuk `@`
   - `CNAME` untuk `www`
4. Jangan ubah atau hapus record **MX, SPF, DKIM** milik email.
5. Tunggu propagasi, lalu pastikan status di Vercel valid dan HTTPS aktif.

---

## Variabel Lingkungan

Salin `.env.example` menjadi `.env` untuk pengembangan lokal. **Jangan commit file `.env`.**

```
# contoh
SECRET_KEY=
CONTACT_EMAIL=
```

---

## Rencana Migrasi ke Next.js

Website ini akan dimigrasikan ke **Next.js**. Rencana singkat:

- [ ] Petakan halaman `templates/*.html` menjadi route di `app/` (App Router)
- [ ] Pindahkan komponen berulang (header, footer) menjadi komponen React
- [ ] Pindahkan aset dari `static/` ke `public/`
- [ ] Ganti route Flask yang menangani form dengan Route Handler (`app/api/.../route.ts`)
- [ ] Pindahkan variabel lingkungan ke Vercel (`NEXT_PUBLIC_*` hanya untuk nilai yang aman dipublikasikan)
- [ ] Pertahankan URL lama atau tambahkan redirect agar SEO tidak hilang
- [ ] Uji di Preview Deployment Vercel sebelum mengganti domain produksi

Disarankan melakukan migrasi di branch terpisah (misalnya `nextjs-migration`) dan menggabungkannya setelah lolos uji.

---

## Catatan Keamanan

- Jangan simpan API key, password, atau token di repo.
- Gunakan Environment Variables di Vercel untuk data rahasia.
- Aktifkan 2FA di akun GitHub, Vercel, dan Dewaweb.

---

## Lisensi

© 2026 [Nama PT]. Seluruh hak dilindungi.
