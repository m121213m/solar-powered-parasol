const products = [
  {
    id: 'parasol',
    name: 'Portable Solar Parasol',
    category: 'Parasol',
    price: 2499,
    description: 'Modular solar parasol with integrated battery and accessory ports.',
    specs: '180 W canopy solar • 520 Wh battery • USB-A/C outputs',
    image: 'assets/images/parasol-card.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fan',
    name: 'Clip-On Fan',
    category: 'Accessories',
    price: 349,
    description: '12 V brushless fan clips to the parasol frame for targeted airflow.',
    specs: '3 speed modes • 12 V plug • 30 dBA whisper mode',
    image: 'assets/images/fan-card.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'led',
    name: 'LED Light Bar',
    category: 'Accessories',
    price: 249,
    description: 'Warm-white LED bar illuminates the canopy for after-dark gatherings.',
    specs: '1,000 lm • dimmable • magnetic clips',
    image: 'assets/images/led-card.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'battery',
    name: 'Extra Battery Tube',
    category: 'Accessories',
    price: 599,
    description: 'Swap-in LiFePO₄ battery tube extends runtime for multi-day trips.',
    specs: '520 Wh • IP54 rated • quick-swap',
    image: 'assets/images/battery-card.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=700&q=80'
  }
];

const dataLayer = window.dataLayer || (window.dataLayer = []);

const state = {
  cart: [],
  filter: 'all'
};

const selectors = {
  navToggle: document.querySelector('.nav-toggle'),
  nav: document.querySelector('.site-nav'),
  cartToggle: document.querySelector('.cart-toggle'),
  cartSection: document.querySelector('.cart'),
  cartClose: document.querySelector('.cart-close'),
  cartItems: document.querySelector('.cart-items'),
  cartCount: document.querySelector('.cart-count'),
  subtotal: document.getElementById('subtotal'),
  vat: document.getElementById('vat'),
  shipping: document.getElementById('shipping'),
  total: document.getElementById('total'),
  productGrid: document.getElementById('product-grid'),
  filterButtons: document.querySelectorAll('.filter-btn'),
  bundleSavings: document.getElementById('bundle-savings'),
  year: document.getElementById('year'),
  cartCheckoutBtn: document.querySelector('[data-action="checkout"]'),
  bundleBtn: document.querySelector('[data-action="add-bundle"]'),
  detailAddBtn: document.querySelector('[data-product="parasol"][data-action="add"]'),
  detailBuyBtn: document.querySelector('[data-product="parasol"][data-action="buy"]'),
  addonForm: document.querySelector('.addons')
};

function applyImageFallbacks(root = document) {
  const images = root.querySelectorAll('img[data-fallback]');
  images.forEach((image) => {
    if (image.dataset.fallbackBound === 'true') return;
    image.dataset.fallbackBound = 'true';
    image.addEventListener('error', () => {
      if (image.dataset.fallbackApplied === 'true') return;
      image.dataset.fallbackApplied = 'true';
      if (image.dataset.fallback) {
        image.src = image.dataset.fallback;
      }
    });
  });
}

applyImageFallbacks();

selectors.year.textContent = new Date().getFullYear();

selectors.navToggle.addEventListener('click', () => {
  selectors.nav.classList.toggle('open');
});

selectors.filterButtons.forEach((btn) =>
  btn.addEventListener('click', () => {
    selectors.filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.filter = btn.dataset.filter;
    renderProducts();
  })
);

function renderProducts() {
  const filtered = products.filter((product) =>
    state.filter === 'all' ? true : product.category === state.filter
  );

  selectors.productGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card" role="listitem">
          <img src="${product.image}" data-fallback="${product.fallbackImage}" alt="${product.name}" loading="lazy" />
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p class="muted">${product.specs}</p>
          <p class="price-tag">AED ${product.price.toLocaleString('en-US')}</p>
          <button class="btn primary" data-product-id="${product.id}">Add to Cart</button>
        </article>
      `
    )
    .join('');

  selectors.productGrid.querySelectorAll('button').forEach((button) =>
    button.addEventListener('click', (event) => {
      const id = event.currentTarget.dataset.productId;
      addToCart(id);
      openCart();
    })
  );

  applyImageFallbacks(selectors.productGrid);
}

renderProducts();

function addToCart(id, quantity = 1, priceOverride) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  const existing = state.cart.find((item) => item.id === id && item.price === (priceOverride ?? product.price));

  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({
      id,
      name: product.name,
      price: priceOverride ?? product.price,
      quantity
    });
  }

  dataLayer.push({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'AED',
      value: (priceOverride ?? product.price) * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: priceOverride ?? product.price,
          quantity
        }
      ]
    }
  });

  updateCartUI();
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  selectors.cartCount.textContent = state.cart.reduce((total, item) => total + item.quantity, 0);

  selectors.cartItems.innerHTML = state.cart
    .map(
      (item, index) => `
        <li class="cart-item">
          <span>${item.name} × ${item.quantity}</span>
          <span>
            AED ${(item.price * item.quantity).toLocaleString('en-US')}
            <button type="button" aria-label="Remove ${item.name} from cart" data-index="${index}">Remove</button>
          </span>
        </li>
      `
    )
    .join('');

  selectors.cartItems.querySelectorAll('button').forEach((btn) =>
    btn.addEventListener('click', (event) => {
      const index = Number(event.currentTarget.dataset.index);
      removeFromCart(index);
    })
  );

  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subtotal * 0.05;
  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 50;
  const total = subtotal + vat + shipping;

  selectors.subtotal.textContent = subtotal.toLocaleString('en-US', { maximumFractionDigits: 0 });
  selectors.vat.textContent = vat.toFixed(2);
  selectors.shipping.textContent = shipping.toLocaleString('en-US', { maximumFractionDigits: 0 });
  selectors.total.textContent = total.toFixed(2);
}

function openCart() {
  selectors.cartSection.hidden = false;
  requestAnimationFrame(() => selectors.cartSection.classList.add('open'));
}

function closeCart() {
  selectors.cartSection.classList.remove('open');
  setTimeout(() => {
    selectors.cartSection.hidden = true;
  }, 250);
}

selectors.cartToggle.addEventListener('click', () => {
  if (selectors.cartSection.hidden) {
    openCart();
  } else {
    closeCart();
  }
});

selectors.cartClose.addEventListener('click', closeCart);

selectors.cartCheckoutBtn.addEventListener('click', () => {
  dataLayer.push({ event: 'begin_checkout', ecommerce: { currency: 'AED', value: selectors.total.textContent } });
  document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
  closeCart();
});

selectors.bundleBtn.addEventListener('click', () => {
  addToCart('parasol');
  addToCart('fan');
  addToCart('led');
  applyBundleDiscount(300);
  openCart();
});

function applyBundleDiscount(amount) {
  state.cart.push({
    id: 'bundle-savings',
    name: 'Bundle Savings',
    price: -amount,
    quantity: 1
  });
  updateCartUI();
}

const addonInputs = selectors.addonForm.querySelectorAll('input[type="checkbox"]');
addonInputs.forEach((input) => input.addEventListener('change', updateAddonSavings));

function updateAddonSavings() {
  const selected = Array.from(addonInputs).filter((input) => input.checked).map((input) => input.value);
  let savings = 0;
  if (selected.length === 2) savings = 150;
  if (selected.length === 3) savings = 250;
  selectors.bundleSavings.textContent = savings;
  return { selected, savings };
}

function handleDetailAction(event, immediateCheckout = false) {
  const { selected, savings } = updateAddonSavings();
  addToCart('parasol');
  selected.forEach((id) => addToCart(id));
  if (savings > 0) {
    applyBundleDiscount(savings);
  }
  if (immediateCheckout) {
    openCart();
    selectors.cartCheckoutBtn.click();
  } else {
    openCart();
  }
}

selectors.detailAddBtn.addEventListener('click', (event) => {
  event.preventDefault();
  handleDetailAction(event, false);
});

selectors.detailBuyBtn.addEventListener('click', (event) => {
  event.preventDefault();
  handleDetailAction(event, true);
});

const checkoutForm = document.querySelector('.checkout-form');
checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(checkoutForm);
  const orderSummary = {
    name: formData.get('name'),
    email: formData.get('email'),
    city: formData.get('city'),
    payment: formData.get('payment'),
    total: selectors.total.textContent
  };

  dataLayer.push({ event: 'purchase_intent', orderSummary });
  alert('Thank you! Our team will confirm your Portable Solar Parasol order shortly.');
  checkoutForm.reset();
});

window.addEventListener('scroll', () => {
  if (selectors.nav.classList.contains('open')) {
    selectors.nav.classList.remove('open');
  }
});
