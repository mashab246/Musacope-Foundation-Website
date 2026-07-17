/* =========================================================================
   Musacope Foundation - Main JS
   Handles: mobile nav, form submissions, animated counters,
            donation flow (Stripe, PayPal, Flutterwave Mobile Money)
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Mobile nav ----------
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    navLinks.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => navLinks.classList.remove('active'))
    );
  }

  // ---------- Active nav highlight ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });

  // ---------- Set contact email in forms (from config) ----------
  const cfg = window.MUSACOPE_CONFIG || {};
  document.querySelectorAll('form.js-formsubmit').forEach(form => {
    if (cfg.contactEmail) {
      form.action = `https://formsubmit.co/${cfg.contactEmail}`;
    }
  });

  // ---------- Animated stat counters ----------
  const stats = document.querySelectorAll('.stat-num');
  const animateStat = (el) => {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    if (isNaN(target)) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const suffix = el.dataset.suffix || '';
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current.toLocaleString() + suffix;
    }, 30);
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateStat(entry.target); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });
  stats.forEach(s => observer.observe(s));

  // ---------- Donate amount selector ----------
  const donateOptions = document.querySelectorAll('.donate-option');
  const customAmount = document.getElementById('customAmount');
  donateOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      donateOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      if (customAmount) customAmount.value = opt.dataset.amount || '';
    });
  });

  // ---------- Payment method selector ----------
  const paymentMethods = document.querySelectorAll('.payment-method');
  const paymentPanels = document.querySelectorAll('.payment-panel');
  paymentMethods.forEach(m => {
    m.addEventListener('click', () => {
      paymentMethods.forEach(x => x.classList.remove('selected'));
      paymentPanels.forEach(p => p.classList.remove('active'));
      m.classList.add('selected');
      const target = document.getElementById('panel-' + m.dataset.method);
      if (target) target.classList.add('active');
    });
  });

  // ---------- Get current donation info ----------
  const getDonation = () => {
    const amount = parseFloat(document.getElementById('customAmount')?.value || '0');
    const name = document.getElementById('donorName')?.value.trim() || 'Anonymous Donor';
    const email = document.getElementById('donorEmail')?.value.trim() || '';
    const phone = document.getElementById('donorPhone')?.value.trim() || '';
    const cause = document.getElementById('cause')?.value || 'general';
    return { amount, name, email, phone, cause };
  };

  const validateDonation = (d, requireEmail = true, requirePhone = false) => {
    if (!d.amount || d.amount < 1) { alert('Please enter a valid donation amount.'); return false; }
    if (requireEmail && !d.email) { alert('Please enter your email address.'); return false; }
    if (requirePhone && !d.phone) { alert('Please enter your mobile phone number.'); return false; }
    return true;
  };

  // ---------- Stripe: redirect to hosted Payment Link ----------
  const stripeBtn = document.getElementById('payStripe');
  if (stripeBtn) {
    stripeBtn.addEventListener('click', () => {
      const d = getDonation();
      if (!validateDonation(d)) return;
      const link = cfg.stripePaymentLink;
      if (!link || link.includes('YOUR_STRIPE_LINK_HERE')) {
        alert('⚠️ Stripe is not configured yet. Please set stripePaymentLink in config.js\n\nSee README.md for setup instructions.');
        return;
      }
      // Pass metadata to Stripe via URL params
      const url = new URL(link);
      url.searchParams.set('prefilled_email', d.email);
      url.searchParams.set('client_reference_id', `${d.cause}-${Date.now()}`);
      window.location.href = url.toString();
    });
  }

  // ---------- PayPal: render smart buttons ----------
  const paypalContainer = document.getElementById('paypal-buttons');
  if (paypalContainer && window.paypal && cfg.paypalClientId && !cfg.paypalClientId.includes('YOUR_PAYPAL')) {
    window.paypal.Buttons({
      style: { color: 'gold', shape: 'pill', label: 'donate', height: 48 },
      createOrder: (data, actions) => {
        const d = getDonation();
        if (!validateDonation(d)) return Promise.reject();
        return actions.order.create({
          purchase_units: [{
            description: `Musacope Foundation Donation - ${d.cause}`,
            amount: { value: d.amount.toFixed(2), currency_code: cfg.paypalCurrency || 'USD' }
          }]
        });
      },
      onApprove: (data, actions) => actions.order.capture().then(details => {
        showDonationSuccess(details.payer.name.given_name, 'PayPal');
      }),
      onError: (err) => alert('PayPal error: ' + err)
    }).render('#paypal-buttons');
  } else if (paypalContainer) {
    paypalContainer.innerHTML = '<div class="alert alert-warning">⚠️ PayPal is not configured yet. Please set paypalClientId in <code>config.js</code>. See README.md for setup.</div>';
  }

  // ---------- Flutterwave: Mobile Money (MTN / Airtel) + cards ----------
  const flwBtn = document.getElementById('payFlutterwave');
  if (flwBtn) {
    flwBtn.addEventListener('click', () => {
      const d = getDonation();
      if (!validateDonation(d, true, true)) return;
      const key = cfg.flutterwavePublicKey;
      if (!key || key.includes('YOUR_KEY_HERE')) {
        alert('⚠️ Flutterwave is not configured yet. Please set flutterwavePublicKey in config.js\n\nSee README.md for setup instructions.');
        return;
      }
      if (typeof FlutterwaveCheckout === 'undefined') {
        alert('Flutterwave library did not load. Please check your internet connection.');
        return;
      }
      // Convert USD → local currency (UGX by default)
      const currency = cfg.flutterwaveCurrency || 'UGX';
      const amountLocal = currency === 'USD' ? d.amount
        : Math.round(d.amount * (cfg.usdToLocalRate || 3750));

      FlutterwaveCheckout({
        public_key: key,
        tx_ref: 'musacope-' + Date.now(),
        amount: amountLocal,
        currency: currency,
        payment_options: 'mobilemoneyuganda,card,mobilemoneyghana,mobilemoneytanzania,mpesa,ussd',
        customer: {
          email: d.email,
          phone_number: d.phone,
          name: d.name,
        },
        customizations: {
          title: 'Musacope Foundation',
          description: `Donation for: ${d.cause}`,
          logo: window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + 'images/logo.png',
        },
        meta: { cause: d.cause },
        callback: (data) => {
          if (data.status === 'successful' || data.status === 'completed') {
            showDonationSuccess(d.name, 'Mobile Money');
          }
        },
        onclose: () => { /* user cancelled */ }
      });
    });
  }

  // ---------- Donation success message ----------
  const showDonationSuccess = (name, method) => {
    const box = document.getElementById('donationResult');
    if (!box) { alert(`✅ Thank you ${name}! Your donation via ${method} was received.`); return; }
    box.innerHTML = `
      <div class="alert alert-success">
        <strong>🎉 Thank you, ${name}!</strong><br>
        Your donation via ${method} was received successfully. A receipt has been emailed to you.
        You're changing lives — from all of us at Musacope Foundation, thank you. 💛
      </div>`;
    box.scrollIntoView({ behavior: 'smooth' });
  };

  // ---------- FormSubmit forms: intercept for AJAX submission ----------
  document.querySelectorAll('form.js-formsubmit').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-message');
      const btn = form.querySelector('button[type="submit"]');
      const originalBtnText = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

      try {
        const formData = new FormData(form);
        // FormSubmit AJAX endpoint (JSON)
        const email = cfg.contactEmail || 'info@musacope.org';
        const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        const data = await response.json();
        if (data.success === 'true' || data.success === true) {
          if (msg) msg.innerHTML = '<div class="alert alert-success">✓ Thank you! Your message has been sent. We\'ll get back to you within 24-48 hours.</div>';
          form.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        if (msg) msg.innerHTML = `<div class="alert alert-warning">⚠️ Something went wrong. Please email us directly at <a href="mailto:${cfg.contactEmail}">${cfg.contactEmail}</a></div>`;
      } finally {
        if (btn) { btn.textContent = originalBtnText; btn.disabled = false; }
      }
    });
  });

});
