// Products Data
const products = [
  {
    id: 1,
    name: "Plateau Banane & Porte-Bougie",
    price: 10,
    image: "assets/banana-holder.png",
    desc: "Un charmant vide-poche en argile modelé à la main, décoré de délicates fleurs peintes, avec une sculpture de banane et un porte-bougie."
  },
  {
    id: 2,
    name: 'Porte-Carte Enveloppe "Maison of Wishes"',
    price: 10,
    image: "assets/wishes-envelope.jpg",
    desc: "Notre enveloppe signature en argile blanche avec un cœur rouge sculpté façon sceau de cire. Parfait pour vos cartes, photos ou vœux."
  },
  {
    id: 3,
    name: 'Coupe Ondulée "Starry Midnight"',
    price: 10,
    image: "assets/black-wavy-tray.jpg",
    desc: "Un élégant plateau ondulé au fini noir brillant, orné de mini-fleurs peintes à la main, de cœurs et de nœuds rappelant une nuit étoilée."
  },
  {
    id: 4,
    name: "Plateau Citron d'Amalfi",
    price: 10,
    image: "assets/lemon-wavy-tray.jpg",
    desc: "Apportez une touche de soleil méditerranéen à votre intérieur avec ce plateau ondulé blanc et bleu cobalt orné d'un citron central."
  },
  {
    id: 5,
    name: 'Plateau Ondulé "Coquette Bow"',
    price: 10,
    image: "assets/pink-bow-tray.jpg",
    desc: "Un plateau ultra féminin en argile rose poudré vernie, orné d'un magnifique nœud en relief rouge et de petites fleurs blanches."
  }
];

// WhatsApp Config - Placeholder for the user's phone number
// Format: country code without + or 00. Example: '21650000000' for Tunisia
const SELLER_WHATSAPP_NUMBER = "YOUR_PHONE_NUMBER"; // Ex: "21650123456"

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
const cartFooterArea = document.getElementById("cart-footer-area");
const emptyCartState = document.getElementById("empty-cart-state");
const checkoutTriggerBtn = document.getElementById("checkout-trigger-btn");
const checkoutFormSection = document.getElementById("checkout-form-section");
const checkoutForm = document.getElementById("order-checkout-form");

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

  // Show Checkout Form
  checkoutTriggerBtn.addEventListener("click", () => {
    checkoutFormSection.classList.toggle("visible");
    if (checkoutFormSection.classList.contains("visible")) {
      // Scroll form into view inside the drawer
      setTimeout(() => {
        checkoutFormSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  });

  // Handle Form Submission (WhatsApp checkout)
  checkoutForm.addEventListener("submit", handleCheckout);
}

// Render Shop Products Grid
function renderProducts() {
  if (!productsGrid) return;
  
  productsGrid.innerHTML = products.map(product => `
    <article class="product-card" id="product-${product.id}">
      <div class="product-img-wrapper">
        <img class="product-img" src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="price-tag">${product.price} DT</span>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <button class="add-to-cart-btn" id="add-to-cart-${product.id}" onclick="addToCart(${product.id})">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          Ajouter au panier
        </button>
      </div>
    </article>
  `).join("");
}

// Cart Logic Actions
window.addToCart = function(productId) {
  const existingItemIndex = cart.findIndex(item => item.id === productId);
  
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  
  saveCartToLocalStorage();
  updateCartUI();
  openCart();
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

// Drawer Open / Close Functions
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("visible");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("visible");
  // Hide checkout form when closing
  checkoutFormSection.classList.remove("visible");
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
    
    return `
      <div class="cart-item" id="cart-item-${product.id}">
        <img class="cart-item-img" src="${product.image}" alt="${product.name}">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${product.name}</h4>
          <div class="cart-item-price">${product.price} DT</div>
          <div class="cart-item-controls">
            <div class="quantity-selector">
              <button class="quantity-btn" aria-label="Moins" onclick="changeQty(${product.id}, -1)">&minus;</button>
              <span class="quantity-display">${cartItem.quantity}</span>
              <button class="quantity-btn" aria-label="Plus" onclick="changeQty(${product.id}, 1)">&plus;</button>
            </div>
            <button class="remove-item-btn" onclick="deleteItem(${product.id})">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
  
  // Replace current items list preserving empty cart state DOM
  const existingItems = cartItemsList.querySelectorAll(".cart-item");
  existingItems.forEach(el => el.remove());
  cartItemsList.insertAdjacentHTML("beforeend", cartHTML);
  
  cartTotalDisplay.textContent = `${subtotal} DT`;
}

// Global functions for inline onclick handlers in cart list
window.changeQty = function(id, delta) {
  updateQuantity(id, delta);
};

window.deleteItem = function(id) {
  removeFromCart(id);
};

// Handle Checkout Submission (Form Validation & Redirection to WhatsApp)
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
  
  // Format WhatsApp message text
  let messageText = `✨ *NOUVELLE COMMANDE - MAISON OF WISHES* ✨\n\n`;
  messageText += `👤 *Informations Client :*\n`;
  messageText += `• *Nom :* ${name}\n`;
  messageText += `• *Téléphone :* ${phone}\n`;
  messageText += `• *Gouvernorat :* ${city}\n`;
  messageText += `• *Adresse :* ${address}\n`;
  if (notes) {
    messageText += `• *Note spéciale :* ${notes}\n`;
  }
  messageText += `\n🛒 *Détails de la commande :*\n`;
  
  let subtotal = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      messageText += `- ${item.quantity}x *${product.name}* (${product.price} DT) -> ${itemTotal} DT\n`;
    }
  });
  
  messageText += `\n💵 *Total à payer :* ${subtotal} DT\n`;
  messageText += `_(Frais de livraison gérés séparément lors de la confirmation)_`;
  
  // URL Encode
  const encodedText = encodeURIComponent(messageText);
  
  // Target URL
  // If SELLER_WHATSAPP_NUMBER is placeholder, it uses general link, otherwise specific number
  let whatsappUrl = "";
  if (SELLER_WHATSAPP_NUMBER === "YOUR_PHONE_NUMBER" || !SELLER_WHATSAPP_NUMBER) {
    // Falls back to direct sharing link if no number is configured yet
    whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  } else {
    // Sends to the specific phone number
    whatsappUrl = `https://api.whatsapp.com/send?phone=${SELLER_WHATSAPP_NUMBER}&text=${encodedText}`;
  }
  
  // Open WhatsApp in new window/tab
  window.open(whatsappUrl, "_blank");
  
  // Clear Cart and UI
  cart = [];
  saveCartToLocalStorage();
  updateCartUI();
  closeCart();
  
  // Reset form
  checkoutForm.reset();
  
  alert("Merci pour votre commande ! Vous allez être redirigé vers WhatsApp pour l'envoyer et finaliser avec nous.");
}
