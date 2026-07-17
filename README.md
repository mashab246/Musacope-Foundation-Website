# Musacope Foundation — Website

A complete, responsive, multi-page website with **real payment processing**, **working forms**, and a **blog section**. Built with plain HTML/CSS/JavaScript — no build step, no frameworks.

---

## 📁 File structure

```
musacope/
├── index.html              # Home page
├── about.html              # About Us
├── programs.html           # Programs
├── get-involved.html       # Donate (Stripe/PayPal/Mobile Money) + Volunteer
├── contact.html            # Contact form + map
├── blog.html               # Blog index (list of stories)
├── blog/
│   ├── impact-report-2026.html
│   ├── education-scholarships.html
│   └── health-outreach.html
├── styles.css              # Shared styling
├── script.js               # Shared JS (nav, forms, payments)
├── config.js               # 👉 YOU EDIT THIS with your API keys
├── images/
│   └── logo.png            # Foundation logo
└── README.md
```

---

## 🚀 Quick start (view locally)

```bash
cd musacope
python -m http.server 8000
```

Open **http://localhost:8000** in your browser.

> ⚠️ Payments and forms won't work when opening the HTML files directly (double-click). Use the local server.

---

## ⚙️ Configuration — 3 things to set up

Open **`config.js`** and replace the placeholder values.

### 1️⃣ Email (form submissions) — via FormSubmit *(free, no signup)*

```js
contactEmail: "info@musacope.org"
```

The contact, volunteer, and newsletter forms will send submissions to this email.

**First-time activation:**
1. Deploy the site (or just run it locally)
2. Submit any form once
3. Check the email inbox → click FormSubmit's confirmation link
4. Done! Future submissions arrive as neatly formatted emails

More info: https://formsubmit.co

---

### 2️⃣ Stripe (Cards, Apple Pay, Google Pay)

```js
stripePaymentLink: "https://buy.stripe.com/YOUR_LINK_HERE"
```

**Setup:**
1. Sign up at https://stripe.com
2. Dashboard → **Payment Links** → **New Payment Link**
3. Set product name: "Musacope Foundation Donation"
4. Choose "Customer chooses price" so donors can pick any amount
5. Copy the URL (starts with `https://buy.stripe.com/...`)
6. Paste into `config.js`

Donors get redirected to Stripe's hosted checkout — the most secure and simplest option. Test mode links (`buy.stripe.com/test_...`) work identically for testing.

---

### 3️⃣ PayPal (worldwide donations)

```js
paypalClientId: "YOUR_PAYPAL_CLIENT_ID_HERE",
paypalCurrency: "USD"
```

**Setup:**
1. Sign up at https://developer.paypal.com
2. Dashboard → **Apps & Credentials** → **Create App** (type: Merchant)
3. Copy the **Client ID** (a long alphanumeric string)
4. Paste into `config.js`
5. Toggle between "Sandbox" (testing) and "Live" credentials as needed

The PayPal Smart Buttons render right on your donate page — donors never leave your site.

---

### 4️⃣ Flutterwave (Mobile Money — MTN, Airtel, M-Pesa, plus cards)

```js
flutterwavePublicKey: "FLWPUBK_TEST-YOUR_KEY_HERE",
flutterwaveCurrency: "UGX",
usdToLocalRate: 3750
```

**Setup:**
1. Sign up at https://flutterwave.com  *(works across Uganda, Kenya, Nigeria, Ghana, Tanzania, Rwanda, and more)*
2. Complete KYC verification
3. Dashboard → **Settings → API Keys** → copy your **Public Key**
   - Testing: starts with `FLWPUBK_TEST-`
   - Live: starts with `FLWPUBK-`
4. Paste into `config.js`
5. Update `usdToLocalRate` to current exchange rate (currently ~3,750 UGX per USD)

Supports **MTN Mobile Money** and **Airtel Money** in Uganda out of the box, plus M-Pesa in Kenya, and mobile money in Ghana, Tanzania, Rwanda, etc.

---

## 📝 Adding a new blog post

1. Copy any file in `/blog/` (e.g. `health-outreach.html`) and rename it (use kebab-case, e.g. `new-project.html`)
2. Edit the article content
3. Add a preview card to `blog.html` and (optionally) `index.html`:

```html
<a href="blog/new-project.html" class="blog-card" style="color:inherit;">
  <div class="blog-card-image community">✨</div>
  <div class="blog-card-body">
    <div class="blog-meta">
      <span class="blog-tag">Category</span>
      <span>Date</span>
    </div>
    <h3>Your Post Title</h3>
    <p>Short preview text...</p>
    <span class="read-more">Read more →</span>
  </div>
</a>
```

Blog card image classes: `community`, `education`, `health` (or add your own gradient in `styles.css`).

---

## 🌐 Publishing online (free options)

Any static host works. Recommended:

| Host | How |
|---|---|
| **Netlify** | Drag & drop the `musacope/` folder onto https://app.netlify.com/drop |
| **Vercel** | Connect a GitHub repo at https://vercel.com |
| **Cloudflare Pages** | Connect a repo at https://pages.cloudflare.com |
| **GitHub Pages** | Push to a repo → Settings → Pages → deploy from main branch |

All are free for non-profit use and give you a custom domain option (e.g. `musacope.org`).

---

## 🔒 Security notes

- ✅ All keys in `config.js` are **public keys** (safe to expose in the browser)
- ✅ Actual card numbers, mobile money PINs, and payment processing **never touch your server** — they go directly to Stripe/PayPal/Flutterwave
- ❌ **Never commit secret keys** (`sk_live_...`, `FLWSECK_...`) to `config.js` or the front-end
- 💡 For webhooks or automated receipt emails, you'll need a small backend — happy to help set one up

---

## 🧪 Testing

### Test card numbers (Stripe & Flutterwave test mode)
- Stripe: `4242 4242 4242 4242` — any future date, any CVC
- Flutterwave: `5531 8866 5214 2950` — CVV `564`, expiry `09/32`, PIN `3310`, OTP `12345`

### Test PayPal
Use a sandbox account from https://developer.paypal.com → Sandbox → Accounts

### Test Mobile Money
Flutterwave test mode simulates the mobile money flow — no real money moves.

---

## 🎨 Customizing

| What | Where |
|---|---|
| Brand colors | `styles.css` → `:root` (top of file) |
| Logo | Replace `images/logo.png` |
| Text/copy | Edit each `.html` file directly |
| Suggested amounts | `get-involved.html` → `.donate-options` divs |
| Contact info | Search & replace `info@musacope.org`, `+256 700 000 000` |
| Stats numbers | `index.html` → `data-target` attributes |

---

Made with ❤️ for Musacope Foundation — *Empowering Communities, Changing Lives.*
