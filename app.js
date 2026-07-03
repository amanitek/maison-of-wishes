// Products Data
const products = [
  {
    id: 1,
    name: "Plateau Banane & Porte-Bougie",
    price: 10,
    image: "assets/banana-holder.png",
    desc: "Un charmant vide-poche en argile modelé à la main, décoré de délicates fleurs peintes, avec une sculpture de banane et un porte-bougie.",
    dimensions: "Base ø 13cm, Hauteur 5cm"
  },
  {
    id: 2,
    name: 'Porte-Carte Enveloppe "Maison of Wishes"',
    price: 10,
    image: "assets/wishes-envelope.jpg",
    desc: "Notre enveloppe signature en argile blanche avec un cœur rouge sculpté façon sceau de cire. Parfait pour vos cartes, photos ou vœux.",
    dimensions: "10.5cm x 7.5cm x 3cm"
  },
  {
    id: 3,
    name: 'Coupe Ondulée "Starry Midnight"',
    price: 10,
    image: "assets/black-wavy-tray.jpg",
    desc: "Un élégant plateau ondulé au fini noir brillant, orné de mini-fleurs peintes à la main, de cœurs et de nœuds rappelant une nuit étoilée.",
    dimensions: "18cm x 11cm"
  },
  {
    id: 4,
    name: "Plateau Citron d'Amalfi",
    price: 10,
    image: "assets/lemon-wavy-tray.jpg",
    desc: "Apportez une touche de soleil méditerranéen à votre intérieur avec ce plateau ondulé blanc et bleu cobalt orné d'un citron central.",
    dimensions: "13cm x 13cm"
  },
  {
    id: 5,
    name: 'Plateau Ondulé "Coquette Bow"',
    price: 10,
    image: "assets/pink-bow-tray.jpg",
    desc: "Un plateau ultra féminin en argile rose poudré vernie, orné d'un magnifique nœud en relief rouge et de petites fleurs blanches.",
    dimensions: "15cm x 14cm"
  },
  {
    id: 6,
    name: "Porte-Encens Vague Fleurie",
    price: 10,
    image: "assets/incense-holders.jpg",
    desc: "Un magnifique porte-encens en forme de vague ondulée modelé à la main, orné de jolis motifs floraux peints et de petites touches dorées étincelantes. Disponible en Rose fuchsia ou Gris sauge.",
    dimensions: "14cm x 4.5cm"
  },
  {
    id: 7,
    name: "Bougeoir Tasse Rétro",
    price: 10,
    image: "assets/cup-candle-holders.jpg",
    desc: "Un adorable bougeoir de chambre rétro avec sa petite anse ronde pratique. Disponible en Jaune moucheté vitaminé ou en bicolore Orange & Bleu fleuri.",
    dimensions: "Base ø 9cm, Hauteur 5cm"
  }
];

// WhatsApp Config - Placeholder for the user's phone number
// Format: country code without + or 00. Example: '21650000000' for Tunisia
const SELLER_WHATSAPP_NUMBER = "21629208687"; // Ex: "21650123456"

// Cart State
let cart = [];

// DOM Elements
const productsGrid = document.getElementById("products-grid-container");
const cartDrawer = document.getElementById("cart-drawer-panel");
const cartOverlay = document.getElementById("cart-overlay-bg");
const openCartBtn = document.getElementById("open-cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const footerCartLink = document.getElementById("footer-cart-link");
const cartItemsList = document.getElementById("cart-items-list");
const cartCountBadge = document.getElementById("cart-count-badge");
const cartTotalDisplay = document.getElementById("cart-total-display");
const cartGrandTotalDisplay = document.getElementById("cart-grand-total-display");
const cartFooterArea = document.getElementById("cart-footer-area");
const emptyCartState = document.getElementById("empty-cart-state");
const checkoutTriggerBtn = document.getElementById("checkout-trigger-btn");
const copySummaryBtn = document.getElementById("copy-summary-btn");

// Toast Container
const toastContainer = document.getElementById("toast-container");

// Product Modal DOM Elements
const productDetailModal = document.getElementById("product-detail-modal");
const productModalOverlay = document.getElementById("product-modal-overlay");
const closeProductModalBtn = document.getElementById("close-product-modal-btn");
const modalProductImg = document.getElementById("modal-product-img");
const modalProductTitle = document.getElementById("modal-product-title");
const modalProductPrice = document.getElementById("modal-product-price");
const modalProductDesc = document.getElementById("modal-product-desc");
const modalProductDims = document.getElementById("modal-product-dims");
const modalAddToCartBtn = document.getElementById("modal-add-to-cart-btn");

// Checkout Modal DOM Elements
const checkoutModal = document.getElementById("checkout-modal");
const checkoutModalOverlay = document.getElementById("checkout-modal-overlay");
const closeCheckoutModalBtn = document.getElementById("close-checkout-modal-btn");
const checkoutForm = document.getElementById("order-checkout-form");

// Invoice Modal DOM Elements
const invoiceModal = document.getElementById("invoice-modal");
const invoiceModalOverlay = document.getElementById("invoice-modal-overlay");
const closeInvoiceModalBtn = document.getElementById("close-invoice-modal-btn");
const invoiceDoneBtn = document.getElementById("invoice-done-btn");

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  loadCartFromLocalStorage();
  renderProducts();
  updateCartUI();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  // Open / Close Cart Drawer
  openCartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);
  if (footerCartLink) {
    footerCartLink.addEventListener("click", (e) => {
      e.preventDefault();
      openCart();
    });
  }

  // Open Checkout Modal
  if (checkoutTriggerBtn) {
    checkoutTriggerBtn.addEventListener("click", () => {
      if (cart.length === 0) return;
      openCheckoutModal();
    });
  }

  // Copy Order Summary
  if (copySummaryBtn) {
    copySummaryBtn.addEventListener("click", () => {
      if (cart.length === 0) return;
      copyOrderSummary();
    });
  }

  // Close Checkout Modal
  if (closeCheckoutModalBtn) {
    closeCheckoutModalBtn.addEventListener("click", closeCheckoutModal);
  }
  if (checkoutModalOverlay) {
    checkoutModalOverlay.addEventListener("click", closeCheckoutModal);
  }

  // Handle Form Submission (WhatsApp checkout + Invoice generation)
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckout);
  }

  // Close Product Details Modal
  if (closeProductModalBtn) {
    closeProductModalBtn.addEventListener("click", closeProductModal);
  }
  if (productModalOverlay) {
    productModalOverlay.addEventListener("click", closeProductModal);
  }

  // Close Invoice Modal (Clears cart and resets layout)
  if (closeInvoiceModalBtn) {
    closeInvoiceModalBtn.addEventListener("click", () => {
      closeInvoiceModal();
      clearCartAndReset();
    });
  }
  if (invoiceModalOverlay) {
    invoiceModalOverlay.addEventListener("click", () => {
      closeInvoiceModal();
      clearCartAndReset();
    });
  }
  if (invoiceDoneBtn) {
    invoiceDoneBtn.addEventListener("click", () => {
      closeInvoiceModal();
      clearCartAndReset();
    });
  }
}

// Render Shop Products Grid
function renderProducts() {
  if (!productsGrid) return;
  
  productsGrid.innerHTML = products.map(product => `
    <article class="product-card" id="product-${product.id}" onclick="openProductModal(${product.id})">
      <div class="product-img-wrapper">
        <img class="product-img" src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="price-tag">${product.price} DT</span>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <button class="add-to-cart-btn" id="add-to-cart-${product.id}" onclick="event.stopPropagation(); addToCart(${product.id})">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          Ajouter au panier
        </button>
      </div>
    </article>
  `).join("");
}

// Cart Logic Actions
window.addToCart = function(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItemIndex = cart.findIndex(item => item.id === productId);
  
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  
  saveCartToLocalStorage();
  updateCartUI();
  showToast(`"${product.name}" ajouté au panier ! 🌸`);
};

function updateQuantity(productId, delta) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex === -1) return;
  
  cart[itemIndex].quantity += delta;
  
  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
  }
  
  saveCartToLocalStorage();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCartToLocalStorage();
  updateCartUI();
}

function clearCartAndReset() {
  cart = [];
  saveCartToLocalStorage();
  updateCartUI();
  if (checkoutForm) {
    checkoutForm.reset();
  }
}

// Drawer Open / Close Functions
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("visible");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("visible");
}

// LocalStorage helpers
function saveCartToLocalStorage() {
  localStorage.setItem("clay_shop_cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("clay_shop_cart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  }
}

// Render/Update Cart items list & counts
function updateCartUI() {
  // Update badge count
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountBadge.textContent = totalCount;
  
  if (cart.length === 0) {
    emptyCartState.style.display = "flex";
    cartFooterArea.style.display = "none";
    
    // Clear list but keep empty state
    const items = cartItemsList.querySelectorAll(".cart-item");
    items.forEach(el => el.remove());
    return;
  }
  
  emptyCartState.style.display = "none";
  cartFooterArea.style.display = "block";
  
  // Calculate Subtotal
  let subtotal = 0;
  
  // Render Item Elements
  const cartHTML = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    if (!product) return "";
    
    const itemTotal = product.price * cartItem.quantity;
    subtotal += itemTotal;
    const productCode = `MW-00${product.id}`;
    
    return `
      <div class="cart-item" id="cart-item-${product.id}">
        <img class="cart-item-img" src="${product.image}" alt="${product.name}">
        <div class="cart-item-details">
          <div class="cart-item-tag">MAISON OF WISHES</div>
          <h4 class="cart-item-title">${product.name}</h4>
          <div class="cart-item-specs">Code: ${productCode} | Dims: ${product.dimensions || "Unique"}</div>
          <div class="cart-item-controls">
            <div class="cart-item-price">${cartItem.quantity} × ${product.price}.00 DT</div>
            <div class="quantity-selector">
              <button class="quantity-btn" aria-label="Moins" onclick="changeQty(${product.id}, -1)">&minus;</button>
              <span class="quantity-display">${cartItem.quantity}</span>
              <button class="quantity-btn" aria-label="Plus" onclick="changeQty(${product.id}, 1)">&plus;</button>
            </div>
          </div>
        </div>
        <button class="cart-item-remove-icon" aria-label="Supprimer" onclick="deleteItem(${product.id})">&times;</button>
      </div>
    `;
  }).join("");
  
  // Replace current items list preserving empty cart state DOM
  const existingItems = cartItemsList.querySelectorAll(".cart-item");
  existingItems.forEach(el => el.remove());
  cartItemsList.insertAdjacentHTML("beforeend", cartHTML);
  
  if (cartTotalDisplay) {
    cartTotalDisplay.textContent = `${subtotal} DT`;
  }
  if (cartGrandTotalDisplay) {
    cartGrandTotalDisplay.textContent = `${subtotal} DT`;
  }
}

// Global functions for inline onclick handlers in cart list
window.changeQty = function(id, delta) {
  updateQuantity(id, delta);
};

window.deleteItem = function(id) {
  removeFromCart(id);
};

// Toast notification helper
function showToast(message) {
  if (!toastContainer) return;
  
  const toast = document.createElement("div");
  toast.className = "toast-item";
  toast.innerHTML = `<span>🌸</span> ${message}`;
  
  toastContainer.appendChild(toast);
  
  // Automatically remove toast after fade-out animation completes
  setTimeout(() => {
    toast.remove();
  }, 3100);
}

// Product detail modal handlers
window.openProductModal = function(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  if (modalProductImg) {
    modalProductImg.src = product.image;
    modalProductImg.alt = product.name;
  }
  if (modalProductTitle) {
    modalProductTitle.textContent = product.name;
  }
  if (modalProductPrice) {
    modalProductPrice.textContent = `${product.price} DT`;
  }
  if (modalProductDesc) {
    modalProductDesc.textContent = product.desc;
  }
  if (modalProductDims) {
    modalProductDims.textContent = product.dimensions || "N/A";
  }
  
  // Configure the Add to Cart button inside the modal
  if (modalAddToCartBtn) {
    modalAddToCartBtn.onclick = () => {
      addToCart(productId);
      closeProductModal();
    };
  }
  
  if (productDetailModal) {
    productDetailModal.style.display = "block";
    productDetailModal.offsetHeight;
    productDetailModal.classList.add("visible");
  }
  
  if (productModalOverlay) {
    productModalOverlay.style.display = "block";
    productModalOverlay.offsetHeight;
    productModalOverlay.classList.add("visible");
  }
};

window.closeProductModal = function() {
  if (productDetailModal) {
    productDetailModal.classList.remove("visible");
    setTimeout(() => {
      productDetailModal.style.display = "none";
    }, 350);
  }
  if (productModalOverlay) {
    productModalOverlay.classList.remove("visible");
    setTimeout(() => {
      productModalOverlay.style.display = "none";
    }, 350);
  }
};

// Checkout Modal triggers
function openCheckoutModal() {
  if (checkoutModal) {
    checkoutModal.style.display = "block";
    checkoutModal.offsetHeight;
    checkoutModal.classList.add("visible");
  }
  if (checkoutModalOverlay) {
    checkoutModalOverlay.style.display = "block";
    checkoutModalOverlay.offsetHeight;
    checkoutModalOverlay.classList.add("visible");
  }
}

function closeCheckoutModal() {
  if (checkoutModal) {
    checkoutModal.classList.remove("visible");
    setTimeout(() => {
      checkoutModal.style.display = "none";
    }, 350);
  }
  if (checkoutModalOverlay) {
    checkoutModalOverlay.classList.remove("visible");
    setTimeout(() => {
      checkoutModalOverlay.style.display = "none";
    }, 350);
  }
}

// Invoice Modal triggers
function openInvoiceModal() {
  if (invoiceModal) {
    invoiceModal.style.display = "block";
    invoiceModal.offsetHeight;
    invoiceModal.classList.add("visible");
  }
  if (invoiceModalOverlay) {
    invoiceModalOverlay.style.display = "block";
    invoiceModalOverlay.offsetHeight;
    invoiceModalOverlay.classList.add("visible");
  }
}

function closeInvoiceModal() {
  if (invoiceModal) {
    invoiceModal.classList.remove("visible");
    setTimeout(() => {
      invoiceModal.style.display = "none";
    }, 350);
  }
  if (invoiceModalOverlay) {
    invoiceModalOverlay.classList.remove("visible");
    setTimeout(() => {
      invoiceModalOverlay.style.display = "none";
    }, 350);
  }
}

// Generate the text order summary
function generateOrderText() {
  let subtotal = 0;
  let orderDetails = "";
  
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      orderDetails += `- ${item.quantity}x ${product.name} (Code: MW-00${product.id}) -> ${itemTotal} DT\n`;
    }
  });

  let text = `✨ COMMANDE - MAISON OF WISHES ✨\n\n🛒 Détails de la commande :\n${orderDetails}\n💵 Total à payer : ${subtotal} DT\n_(Frais de livraison gérés séparément lors de la confirmation)_`;
  return { text, subtotal };
}

// Copy order summary to clipboard helper
function copyOrderSummary() {
  const { text } = generateOrderText();
  
  navigator.clipboard.writeText(text)
    .then(() => {
      showToast("Résumé copié dans le presse-papiers ! 📋");
    })
    .catch(err => {
      console.error("Could not copy order summary: ", err);
      alert("Une erreur est survenue lors de la copie. Vous pouvez commander directement.");
    });
}

// Handle Checkout Submission (Form Validation & Redirection to WhatsApp + Invoice Generation)
function handleCheckout(e) {
  e.preventDefault();
  
  const name = document.getElementById("checkout-name").value.trim();
  const phone = document.getElementById("checkout-phone").value.trim();
  const city = document.getElementById("checkout-city").value;
  const address = document.getElementById("checkout-address").value.trim();
  const notes = document.getElementById("checkout-notes").value.trim();
  
  if (!name || !phone || !city || !address) {
    alert("Veuillez remplir tous les champs obligatoires (*)");
    return;
  }

  // 1. Generate Invoice Identifiers
  const invoiceNum = "MW-" + Math.floor(1000 + Math.random() * 9000);
  const today = new Date().toLocaleDateString('fr-FR');

  // 2. Populate Invoice DOM
  const invoiceIdEl = document.getElementById("invoice-id");
  const invoiceDateEl = document.getElementById("invoice-date");
  const clientNameEl = document.getElementById("invoice-client-name");
  const clientPhoneEl = document.getElementById("invoice-client-phone");
  const clientCityEl = document.getElementById("invoice-client-city");
  const clientAddressEl = document.getElementById("invoice-client-address");
  const tableBodyEl = document.getElementById("invoice-table-body");
  const subtotalEl = document.getElementById("invoice-subtotal");
  const grandTotalEl = document.getElementById("invoice-grand-total");

  if (invoiceIdEl) invoiceIdEl.textContent = `#${invoiceNum}`;
  if (invoiceDateEl) invoiceDateEl.textContent = today;
  if (clientNameEl) clientNameEl.textContent = name;
  if (clientPhoneEl) clientPhoneEl.textContent = phone;
  if (clientCityEl) clientCityEl.textContent = city;
  if (clientAddressEl) clientAddressEl.textContent = address;

  // 3. Render Invoice Table Items
  let subtotal = 0;
  const invoiceRowsHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return "";
    
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;
    
    return `
      <tr>
        <td>
          <strong>${product.name}</strong><br>
          <span style="font-size: 0.75rem; color: #718096;">Code: MW-00${product.id} | Dims: ${product.dimensions || "Unique"}</span>
        </td>
        <td class="text-center">${item.quantity}</td>
        <td class="text-right">${product.price}.00 DT</td>
        <td class="text-right">${itemTotal}.00 DT</td>
      </tr>
    `;
  }).join("");

  if (tableBodyEl) tableBodyEl.innerHTML = invoiceRowsHTML;
  if (subtotalEl) subtotalEl.textContent = `${subtotal}.00 DT`;
  if (grandTotalEl) grandTotalEl.textContent = `${subtotal}.00 DT`;

  // 4. Format WhatsApp Message Text
  let messageText = `✨ *NOUVELLE COMMANDE - MAISON OF WISHES* ✨\n`;
  messageText += `*Facture N° :* #${invoiceNum}\n\n`;
  messageText += `👤 *Informations Client :*\n`;
  messageText += `• *Nom :* ${name}\n`;
  messageText += `• *Téléphone :* ${phone}\n`;
  messageText += `• *Gouvernorat :* ${city}\n`;
  messageText += `• *Adresse :* ${address}\n`;
  if (notes) {
    messageText += `• *Note spéciale :* ${notes}\n`;
  }
  messageText += `\n🛒 *Détails de la commande :*\n`;
  
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      const itemTotal = product.price * item.quantity;
      messageText += `- ${item.quantity}x *${product.name}* (MW-00${product.id}) -> ${itemTotal} DT\n`;
    }
  });
  
  messageText += `\n💵 *Total à payer :* ${subtotal} DT\n`;
  messageText += `_(Frais de livraison gérés séparément lors de la confirmation)_`;
  
  // URL Encode
  const encodedText = encodeURIComponent(messageText);
  
  // Target URL
  let whatsappUrl = "";
  if (SELLER_WHATSAPP_NUMBER === "YOUR_PHONE_NUMBER" || !SELLER_WHATSAPP_NUMBER) {
    whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  } else {
    whatsappUrl = `https://api.whatsapp.com/send?phone=${SELLER_WHATSAPP_NUMBER}&text=${encodedText}`;
  }
  
  // Open WhatsApp in new window/tab
  window.open(whatsappUrl, "_blank");
  
  // Close Checkout Modal & Open Invoice Modal
  closeCheckoutModal();
  closeCart();
  openInvoiceModal();
  
  alert("Merci pour votre commande ! Votre résumé va s'ouvrir sur WhatsApp, et votre facture a été générée. Vous pouvez l'imprimer ou l'enregistrer en PDF.");
}
