/* =========================================================================
   Musacope Foundation - Configuration
   
   👉 EDIT THIS FILE with your real API keys and email address.
   All keys are PUBLIC/CLIENT keys — safe to use in the browser.
   NEVER put secret keys here.
   ========================================================================= */

window.MUSACOPE_CONFIG = {

  // ---- Contact email that FormSubmit will forward messages to ----
  // How it works: FormSubmit.co is a free service that emails you form submissions.
  // First-time setup: submit any form once → check your inbox → click the
  // confirmation link they email you → done. No account needed.
  contactEmail: "info@musacope.org",

  // ---- Stripe (accepts cards, Apple Pay, Google Pay) ----
  // 1. Create account at https://stripe.com
  // 2. Dashboard → Payment Links → create a "Musacope Donation" link
  // 3. Paste the full URL below (starts with https://buy.stripe.com/...)
  //    Users will be redirected to Stripe's secure hosted page.
  stripePaymentLink: "https://buy.stripe.com/test_YOUR_STRIPE_LINK_HERE",

  // ---- PayPal (accepts PayPal + cards worldwide) ----
  // 1. Create account at https://developer.paypal.com
  // 2. Dashboard → Apps & Credentials → create app → copy Client ID
  // 3. Paste it below (long alphanumeric string)
  paypalClientId: "YOUR_PAYPAL_CLIENT_ID_HERE",
  paypalCurrency: "USD",

  // ---- Flutterwave (Mobile Money for Uganda: MTN & Airtel, plus cards) ----
  // 1. Create account at https://flutterwave.com  (works across Africa)
  // 2. Dashboard → Settings → API → copy your PUBLIC Key
  //    (starts with FLWPUBK-... or FLWPUBK_TEST-... for testing)
  // 3. Paste it below
  flutterwavePublicKey: "FLWPUBK_TEST-YOUR_KEY_HERE",
  flutterwaveCurrency: "UGX",     // Uganda Shillings. Use "USD"/"KES"/"NGN"/"GHS" etc. if needed
  // Approx conversion for the default USD amounts on the donate form to UGX
  usdToLocalRate: 3750,           // 1 USD ≈ 3,750 UGX. Update to today's rate.
};
