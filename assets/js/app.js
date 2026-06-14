const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

let cart = JSON.parse(localStorage.getItem("p918_cart") || "[]");
let activeProduct = null;
let activeImageSide = "front";
let currentFilter = "all";

const grid = $("#productGrid");
const cartCount = $("#cartCount");
const cartDrawer = $("#cartDrawer");
const cartItems = $("#cartItems");
const cartTotal = $("#cartTotal");
const checkoutButton = $("#checkoutButton");

function money(value) {
  return `$${Number(value).toFixed(2).replace(".00", "")}`;
}

function saveCart() {
  localStorage.setItem("p918_cart", JSON.stringify(cart));
  renderCart();
}

function setupConfig() {
  $("#announcement").textContent = SITE_CONFIG.shippingLine;

  const logo = $("#brandLogo");
  logo.src = SITE_CONFIG.logoUrl;
  logo.onerror = () => {
    logo.style.display = "none";
    document.querySelector(".brand-fallback").style.display = "inline";
  };

  $("#heroEyebrow").textContent = SITE_CONFIG.hero.eyebrow;
  $("#heroTitle").textContent = SITE_CONFIG.hero.title;
  $("#heroSubtitle").textContent = SITE_CONFIG.hero.subtitle;
  $("#heroImageLeft").src = SITE_CONFIG.hero.imageLeft;
  $("#heroImageRight").src = SITE_CONFIG.hero.imageRight;
}

function renderProducts() {
  const visibleProducts = PRODUCTS.filter((p) => p.active && (currentFilter === "all" || p.category === currentFilter));

  grid.innerHTML = visibleProducts.map((product) => `
    <button class="product-card" type="button" data-product-id="${product.id}">
      <div class="product-media">
        <img class="front" src="${product.frontImage}" alt="${product.name} front" loading="lazy" />
        <img class="back" src="${product.backImage}" alt="${product.name} back" loading="lazy" />
      </div>
      <div class="product-info">
        <h2>${product.name}</h2>
        <p>${money(product.price)} · ${product.colorOptions.join(", ")}</p>
      </div>
    </button>
  `).join("");

  $$(".product-card").forEach((card) => {
    card.addEventListener("click", () => openProduct(card.dataset.productId));
  });
}

function openProduct(productId) {
  activeProduct = PRODUCTS.find((p) => p.id === productId);
  activeImageSide = "front";

  if (!activeProduct) return;

  $("#modalTitle").textContent = activeProduct.name;
  $("#modalPrice").textContent = money(activeProduct.price);
  $("#modalDescription").textContent = activeProduct.description;
  $("#modalMainImage").src = activeProduct.frontImage;
  $("#modalMainImage").alt = `${activeProduct.name} front`;

  $("#modalSize").innerHTML = activeProduct.sizeOptions.map((s) => `<option>${s}</option>`).join("");
  $("#modalColor").innerHTML = activeProduct.colorOptions.map((c) => `<option>${c}</option>`).join("");
  $("#modalQuantity").value = "1";

  $("#frontThumb").classList.add("active");
  $("#backThumb").classList.remove("active");

  $("#productModal").classList.add("active");
  $("#productModal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProduct() {
  $("#productModal").classList.remove("active");
  $("#productModal").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function switchImage(side) {
  if (!activeProduct) return;

  activeImageSide = side;
  $("#modalMainImage").src = side === "front" ? activeProduct.frontImage : activeProduct.backImage;
  $("#modalMainImage").alt = `${activeProduct.name} ${side}`;

  $("#frontThumb").classList.toggle("active", side === "front");
  $("#backThumb").classList.toggle("active", side === "back");
}

function addToBag() {
  if (!activeProduct) return;

  const size = $("#modalSize").value;
  const color = $("#modalColor").value;
  const qty = Number($("#modalQuantity").value);

  const lineId = `${activeProduct.id}-${size}-${color}`;
  const existing = cart.find((item) => item.lineId === lineId);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      lineId,
      productId: activeProduct.id,
      name: activeProduct.name,
      price: activeProduct.price,
      image: activeProduct.frontImage,
      size,
      color,
      qty
    });
  }

  saveCart();
  closeProduct();
  openCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  cartCount.textContent = count;
  cartTotal.textContent = money(total);

  if (!cart.length) {
    cartItems.innerHTML = `<p class="empty-cart">Your bag is empty.</p>`;
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <h3>${item.name}</h3>
        <p>${money(item.price)} · ${item.color} · ${item.size}</p>
        <p>Qty ${item.qty}</p>
      </div>
      <button class="remove-item" type="button" data-line-id="${item.lineId}" aria-label="Remove ${item.name}">×</button>
    </div>
  `).join("");

  $$(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      cart = cart.filter((item) => item.lineId !== button.dataset.lineId);
      saveCart();
    });
  });
}

function openCart() {
  cartDrawer.classList.add("active");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("active");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function getCheckoutData() {
  return {
    name: $("#customerName").value.trim(),
    email: $("#customerEmail").value.trim(),
    contact: $("#customerContact").value.trim(),
    country: $("#customerCountry").value.trim(),
    address: $("#customerAddress").value.trim()
  };
}

function validateCheckout() {
  if (!cart.length) {
    alert("Your bag is empty.");
    return false;
  }

  const data = getCheckoutData();
  if (!data.name || !data.email || !data.country || !data.address) {
    alert("Fill your name, email, country, and shipping address first.");
    return false;
  }

  return true;
}

function buildOrderDetails() {
  const data = getCheckoutData();
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const orderId = `P918-${Date.now().toString().slice(-7)}${Math.floor(Math.random() * 90 + 10)}`;

  const itemsText = cart.map((item, index) => {
    return `${index + 1}) ${item.name}
   Size: ${item.size}
   Color: ${item.color}
   Qty: ${item.qty}
   Line total: ${money(item.qty * item.price)}`;
  }).join("\n\n");

  return `PROJECT.918 ORDER
Order ID: ${orderId}
Total to pay: ${money(total)}

ITEMS:
${itemsText}

CUSTOMER:
Name: ${data.name}
Email: ${data.email}
Instagram/Phone: ${data.contact || "-"}
Country: ${data.country}
Shipping Address: ${data.address}

NOTE:
Paid through Buy Me a Coffee.`;
}

async function copyOrderDetails() {
  const orderDetails = buildOrderDetails();

  try {
    await navigator.clipboard.writeText(orderDetails);
    return true;
  } catch (error) {
    prompt("Copy these order details and paste them in the BMC message box:", orderDetails);
    return false;
  }
}

function openBMCWidget() {
  let backdrop = document.querySelector(".bmc-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "bmc-backdrop";
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", () => {
      document.body.classList.remove("bmc-open");
      backdrop.classList.remove("active");
    });
  }

  const bmcButton = document.querySelector("#bmc-wbtn");

  if (!bmcButton) {
    alert("Checkout is still loading. Try again in one second.");
    return;
  }

  document.body.classList.add("bmc-open");
  backdrop.classList.add("active");
  bmcButton.click();

  setTimeout(centerBMCWidget, 160);
  setTimeout(centerBMCWidget, 420);
  setTimeout(centerBMCWidget, 900);
}

function centerBMCWidget() {
  const frames = [
    document.getElementById("bmc-iframe"),
    ...document.querySelectorAll('iframe[src*="buymeacoffee.com"]'),
    ...document.querySelectorAll('iframe[id*="bmc"]'),
    ...document.querySelectorAll('iframe[name*="bmc"]')
  ].filter(Boolean);

  frames.forEach((frame) => {
    frame.style.setProperty("position", "fixed", "important");
    frame.style.setProperty("top", "50%", "important");
    frame.style.setProperty("left", "50%", "important");
    frame.style.setProperty("right", "auto", "important");
    frame.style.setProperty("bottom", "auto", "important");
    frame.style.setProperty("transform", "translate(-50%, -50%)", "important");
    frame.style.setProperty("z-index", "9999", "important");
    frame.style.setProperty("border-radius", "24px", "important");
    frame.style.setProperty("box-shadow", "0 36px 120px rgba(0,0,0,0.48)", "important");
  });
}

async function checkout() {
  if (!validateCheckout()) return;

  await copyOrderDetails();

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  alert(`Order details copied.\n\nIn Buy Me a Coffee, enter the exact total: ${money(total)}\nThen paste the copied order details into the message box.`);

  openBMCWidget();
}

function bindEvents() {
  $("#openCartButton").addEventListener("click", openCart);
  $("#closeCartButton").addEventListener("click", closeCart);

  cartDrawer.addEventListener("click", (event) => {
    if (event.target === cartDrawer) closeCart();
  });

  $("#closeProductModal").addEventListener("click", closeProduct);
  $("#modalBackdrop").addEventListener("click", closeProduct);
  $("#frontThumb").addEventListener("click", () => switchImage("front"));
  $("#backThumb").addEventListener("click", () => switchImage("back"));
  $("#addToBagButton").addEventListener("click", addToBag);
  checkoutButton.addEventListener("click", checkout);

  $$(".category-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".category-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.dataset.filter;
      renderProducts();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProduct();
      closeCart();
    }
  });

  setInterval(() => {
    if (document.body.classList.contains("bmc-open")) {
      centerBMCWidget();
    }
  }, 700);
}

setupConfig();
renderProducts();
renderCart();
bindEvents();
