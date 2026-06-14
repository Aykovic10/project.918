(function () {
  const products = (window.PROJECT918_PRODUCTS || []).filter(p => p.active !== false);
  const config = window.PROJECT918_CONFIG || {};

  function money(value) {
    const n = Number(value || 0);
    return `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
  }

  function safeText(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[ch]));
  }

  function productUrl(id) {
    return `product/?id=${encodeURIComponent(id)}`;
  }

  function getProduct(id) {
    return products.find(p => p.id === id) || products[0];
  }

  function getBag() {
    try { return JSON.parse(localStorage.getItem('p918_bag') || 'null'); }
    catch { return null; }
  }

  function setBag(item) {
    localStorage.setItem('p918_bag', JSON.stringify(item));
    updateBagCount();
  }

  function clearBag() {
    localStorage.removeItem('p918_bag');
    updateBagCount();
  }

  function updateBagCount() {
    const bag = getBag();
    const count = bag ? Number(bag.quantity || 1) : 0;
    document.querySelectorAll('[data-bag-count]').forEach(el => el.textContent = String(count));
  }

  function injectHeader() {
    const header = document.querySelector('[data-header]');
    if (!header) return;
    const logo = config.logoUrl
      ? `<img src="${config.logoUrl}" alt="project.918" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"/><span class="logo-fallback" style="display:none">PROJECT.918</span>`
      : `<span class="logo-fallback">PROJECT.918</span>`;
    header.innerHTML = `
      <div class="header-left">
        <a class="nav-link" href="./">Home</a>
        <a class="nav-link" href="faq/">FAQ</a>
      </div>
      <a class="logo" href="./" aria-label="project.918 home">${logo}</a>
      <div class="header-right">
        <a class="small-link" href="${config.instagramUrl || '#'}" target="_blank" rel="noopener">Instagram</a>
        <a class="bag-link" href="checkout/">Bag <span data-bag-count>0</span></a>
      </div>
    `;
    updateBagCount();
  }

  function injectSubHeader() {
    const header = document.querySelector('[data-sub-header]');
    if (!header) return;
    const logo = config.logoUrl
      ? `<img src="${config.logoUrl}" alt="project.918" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"/><span class="logo-fallback" style="display:none">PROJECT.918</span>`
      : `<span class="logo-fallback">PROJECT.918</span>`;
    header.innerHTML = `
      <div class="header-left">
        <a class="nav-link" href="../">Home</a>
        <a class="nav-link" href="../faq/">FAQ</a>
      </div>
      <a class="logo" href="../" aria-label="project.918 home">${logo}</a>
      <div class="header-right">
        <a class="small-link" href="${config.instagramUrl || '#'}" target="_blank" rel="noopener">Instagram</a>
        <a class="bag-link" href="../checkout/">Bag <span data-bag-count>0</span></a>
      </div>
    `;
    updateBagCount();
  }

  function renderHome() {
    const grid = document.querySelector('[data-products-grid]');
    if (!grid) return;

    const heroImg = document.querySelector('[data-hero-image]');
    if (heroImg && products[0]) heroImg.src = products[0].frontImage;

    grid.innerHTML = products.map(product => `
      <a class="product-card" href="${productUrl(product.id)}" aria-label="View ${safeText(product.name)}">
        <div class="product-media">
          <img class="front-img" src="${product.frontImage}" alt="${safeText(product.name)} front" loading="lazy" />
          <img class="back-img" src="${product.backImage}" alt="${safeText(product.name)} back" loading="lazy" />
        </div>
        <div class="product-info">
          <div>
            <h3 class="product-name">${safeText(product.name)}</h3>
            <div class="product-meta">${money(product.price)} · ${safeText(product.color)}</div>
          </div>
          <div class="product-price">View</div>
        </div>
      </a>
    `).join('');
  }

  function renderProductPage() {
    const root = document.querySelector('[data-product-page]');
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const product = getProduct(params.get('id'));
    if (!product) return;

    document.title = `${product.name} — Project.918`;
    root.innerHTML = `
      <section class="gallery">
        <div class="gallery-main">
          <img id="mainProductImage" src="${product.frontImage}" alt="${safeText(product.name)}" />
        </div>
        <div class="thumb-row">
          <button class="thumb-btn active" data-image="front" type="button">Front</button>
          <button class="thumb-btn" data-image="back" type="button">Back</button>
        </div>
      </section>
      <section class="product-detail">
        <p class="product-kicker">Project.918</p>
        <h1>${safeText(product.name)}</h1>
        <div class="detail-price">${money(product.price)}</div>
        <p class="detail-desc">${safeText(product.description)}</p>

        <div class="option-group">
          <label class="option-label" for="sizeSelect">Size</label>
          <select class="select" id="sizeSelect">
            ${product.sizes.map(s => `<option value="${safeText(s)}">${safeText(s)}</option>`).join('')}
          </select>
        </div>

        <div class="option-group">
          <label class="option-label" for="colorSelect">Color</label>
          <select class="select" id="colorSelect">
            ${product.colors.map(c => `<option value="${safeText(c)}">${safeText(c)}</option>`).join('')}
          </select>
        </div>

        <div class="option-group">
          <label class="option-label" for="quantitySelect">Quantity</label>
          <select class="select" id="quantitySelect">
            ${[1,2,3,4,5].map(q => `<option value="${q}">${q}</option>`).join('')}
          </select>
        </div>

        <button class="full-btn" id="continueCheckout" type="button">Continue to checkout</button>
        <div class="inline-message" id="productMessage">Added. Taking you to checkout…</div>
        <p class="info-line">${safeText(config.shippingText || 'Free worldwide shipping.')}</p>
      </section>
    `;

    const img = document.getElementById('mainProductImage');
    document.querySelectorAll('[data-image]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-image]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        img.src = btn.dataset.image === 'back' ? product.backImage : product.frontImage;
      });
    });

    document.getElementById('continueCheckout').addEventListener('click', () => {
      const item = {
        productId: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency || '$',
        size: document.getElementById('sizeSelect').value,
        color: document.getElementById('colorSelect').value,
        quantity: Number(document.getElementById('quantitySelect').value),
        frontImage: product.frontImage,
        backImage: product.backImage,
        createdAt: new Date().toISOString()
      };
      setBag(item);
      document.getElementById('productMessage').classList.add('show');
      window.setTimeout(() => { window.location.href = '../checkout/'; }, 350);
    });
  }

  function renderCheckout() {
    const root = document.querySelector('[data-checkout-page]');
    if (!root) return;
    const bag = getBag();
    if (!bag) {
      root.innerHTML = `
        <div class="empty-state">
          <h1>Your bag is empty</h1>
          <p class="detail-desc" style="margin-left:auto;margin-right:auto">Pick a product first, then come back to checkout.</p>
          <a class="primary-btn" href="../">Shop products</a>
        </div>`;
      return;
    }

    const total = Number(bag.price) * Number(bag.quantity || 1);
    root.innerHTML = `
      <section>
        <p class="checkout-kicker">Project.918</p>
        <h1 class="checkout-title">Checkout</h1>
        <div class="checkout-panel">
          <h2 class="checkout-heading">Contact & shipping</h2>
          <div class="checkout-grid">
            <div>
              <label class="option-label" for="customerName">Full name</label>
              <input class="field" id="customerName" autocomplete="name" placeholder="Your name" />
            </div>
            <div>
              <label class="option-label" for="customerEmail">Email</label>
              <input class="field" id="customerEmail" autocomplete="email" placeholder="you@email.com" />
            </div>
            <div>
              <label class="option-label" for="customerPhone">Phone</label>
              <input class="field" id="customerPhone" autocomplete="tel" placeholder="Optional" />
            </div>
            <div>
              <label class="option-label" for="customerCountry">Country</label>
              <input class="field" id="customerCountry" autocomplete="country-name" placeholder="Country" />
            </div>
            <div class="wide">
              <label class="option-label" for="customerAddress">Full shipping address</label>
              <textarea class="textarea" id="customerAddress" autocomplete="street-address" placeholder="Street, apartment, city, postal code"></textarea>
            </div>
            <div class="wide">
              <label class="option-label" for="customerNotes">Notes</label>
              <textarea class="textarea" id="customerNotes" placeholder="Optional sizing, delivery, or Instagram note"></textarea>
            </div>
          </div>
        </div>
      </section>

      <aside class="summary-panel">
        <h2 class="checkout-heading">Order summary</h2>
        <div class="order-row">
          <div class="order-thumb"><img src="${bag.frontImage}" alt="${safeText(bag.name)}" /></div>
          <div>
            <p class="order-title">${safeText(bag.name)}</p>
            <div class="order-meta">${safeText(bag.color)} · ${safeText(bag.size)} · Qty ${bag.quantity}</div>
            <div class="order-meta">Free worldwide shipping</div>
          </div>
        </div>
        <div class="total-row"><span>Subtotal</span><span>${money(total)}</span></div>
        <div class="total-row"><span>Shipping</span><span>Free</span></div>
        <div class="total-row"><span>Total due</span><span>${money(total)}</span></div>
        <div class="checkout-actions">
          <button class="full-btn" id="payButton" type="button">Pay with Buy Me a Coffee</button>
          <button class="secondary-btn" id="clearBagButton" type="button">Clear bag</button>
          <p class="copy-note" id="copyNote">Order details copied. In BMC, enter <strong>${money(total)}</strong> and paste the copied order details in the message box.</p>
        </div>
      </aside>
    `;

    document.getElementById('clearBagButton').addEventListener('click', () => {
      clearBag();
      window.location.href = '../';
    });
    document.getElementById('payButton').addEventListener('click', openBmcPayment);
  }

  function buildCheckoutOrderText() {
    const bag = getBag();
    if (!bag) return '';
    const total = Number(bag.price) * Number(bag.quantity || 1);
    const id = `P918-${Date.now().toString().slice(-7)}`;
    const get = id => document.getElementById(id)?.value?.trim() || '-';
    return `Order ID: ${id}\nProduct: ${bag.name}\nColor: ${bag.color}\nSize: ${bag.size}\nQuantity: ${bag.quantity}\nTotal due: ${money(total)}\nName: ${get('customerName')}\nEmail: ${get('customerEmail')}\nPhone: ${get('customerPhone')}\nCountry: ${get('customerCountry')}\nAddress: ${get('customerAddress')}\nNotes: ${get('customerNotes')}`;
  }

  async function copyCheckoutDetails() {
    const text = buildCheckoutOrderText();
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      window.prompt('Copy your order details:', text);
    }
  }

  function centerBmc() {
    const frames = [
      document.getElementById('bmc-iframe'),
      ...document.querySelectorAll('iframe[src*="buymeacoffee.com"]'),
      ...document.querySelectorAll('iframe[id*="bmc"]'),
      ...document.querySelectorAll('iframe[name*="bmc"]')
    ].filter(Boolean);
    frames.forEach(frame => {
      frame.style.setProperty('position', 'fixed', 'important');
      frame.style.setProperty('top', '50%', 'important');
      frame.style.setProperty('left', '50%', 'important');
      frame.style.setProperty('right', 'auto', 'important');
      frame.style.setProperty('bottom', 'auto', 'important');
      frame.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
      frame.style.setProperty('z-index', '9999', 'important');
      frame.style.setProperty('border-radius', '24px', 'important');
      frame.style.setProperty('box-shadow', '0 44px 130px rgba(0,0,0,.68)', 'important');
    });
  }

  async function openBmcPayment() {
    await copyCheckoutDetails();
    const note = document.getElementById('copyNote');
    if (note) note.classList.add('show');
    const btn = document.querySelector('#bmc-wbtn');
    if (!btn) {
      alert('Payment is still loading. Try again in a second.');
      return;
    }
    document.body.classList.add('payment-open');
    const backdrop = document.querySelector('[data-payment-backdrop]');
    if (backdrop) backdrop.classList.add('active');
    btn.click();
    [120, 320, 700, 1200, 1800].forEach(ms => setTimeout(centerBmc, ms));
  }

  function setupPaymentBackdrop() {
    const backdrop = document.querySelector('[data-payment-backdrop]');
    if (!backdrop) return;
    backdrop.addEventListener('click', () => {
      backdrop.classList.remove('active');
      document.body.classList.remove('payment-open');
    });
    setInterval(() => {
      if (document.body.classList.contains('payment-open')) centerBmc();
    }, 500);
  }

  injectHeader();
  injectSubHeader();
  renderHome();
  renderProductPage();
  renderCheckout();
  setupPaymentBackdrop();
  updateBagCount();
})();
