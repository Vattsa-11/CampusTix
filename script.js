// Global Variables
let currentSection = "home"
let cart = []
let events = []
const userTickets = []
const isLoggedIn = false

// Sample Data
const sampleEvents = [
  {
    id: 1,
    title: "Tech Fest 2025",
    description: "Annual technology festival featuring workshops, competitions, and exhibitions.",
    date: "2025-03-15",
    time: "10:00",
    venue: "Main Auditorium",
    price: 150,
    category: "technical",
    organizer: "Computer Science Society",
    image: "🚀",
  },
  {
    id: 2,
    title: "Cultural Night",
    description: "Celebrate diversity with music, dance, and cultural performances.",
    date: "2025-03-20",
    time: "18:00",
    venue: "Open Ground",
    price: 100,
    category: "cultural",
    organizer: "Cultural Committee",
    image: "🎭",
  },
  {
    id: 3,
    title: "Startup Pitch Competition",
    description: "Present your innovative ideas to industry experts and investors.",
    date: "2025-03-25",
    time: "14:00",
    venue: "Conference Hall",
    price: 200,
    category: "academic",
    organizer: "Entrepreneurship Cell",
    image: "💡",
  },
  {
    id: 4,
    title: "Gaming Tournament",
    description: "Compete in various gaming competitions and win exciting prizes.",
    date: "2025-04-01",
    time: "12:00",
    venue: "Gaming Arena",
    price: 50,
    category: "sports",
    organizer: "Gaming Club",
    image: "🎮",
  },
  {
    id: 5,
    title: "Art Exhibition",
    description: "Showcase of student artwork and creative expressions.",
    date: "2025-04-05",
    time: "11:00",
    venue: "Art Gallery",
    price: 0,
    category: "cultural",
    organizer: "Art Society",
    image: "🎨",
  },
  {
    id: 6,
    title: "Science Symposium",
    description: "Research presentations and scientific discussions.",
    date: "2025-04-10",
    time: "09:00",
    venue: "Science Building",
    price: 75,
    category: "academic",
    organizer: "Science Club",
    image: "🔬",
  },
]

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  events = [...sampleEvents]
  initializeApp()
  setupEventListeners()
  animateStats()
})

function initializeApp() {
  renderFeaturedEvents()
  renderAllEvents()
  renderUserTickets()
  updateCartUI()

  // Set initial active section
  showSection("home")
}

function setupEventListeners() {
  // Header scroll effect
  window.addEventListener("scroll", () => {
    const header = document.getElementById("header")
    if (window.scrollY > 100) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Search functionality
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.addEventListener("input", filterEvents)
  }

  // Filter functionality
  const typeFilter = document.getElementById("typeFilter")
  const priceFilter = document.getElementById("priceFilter")
  if (typeFilter) typeFilter.addEventListener("change", filterEvents)
  if (priceFilter) priceFilter.addEventListener("change", filterEvents)

  // Form submissions
  const createEventForm = document.getElementById("createEventForm")
  if (createEventForm) {
    createEventForm.addEventListener("submit", handleCreateEvent)
  }

  // Mobile menu toggle
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("navMenu")
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }
}

// Navigation Functions
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll(".section")
  sections.forEach((section) => section.classList.remove("active"))

  // Show target section
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.add("active")
    currentSection = sectionId
  }

  // Update navigation
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => link.classList.remove("active"))

  // Add active class to current nav link
  const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`)
  if (activeLink) {
    activeLink.classList.add("active")
  }

  // Scroll to top
  window.scrollTo(0, 0)
}

function showEventDetails(eventId) {
  const event = events.find((e) => e.id === eventId)
  if (!event) return

  const content = document.getElementById("eventDetailContent")
  content.innerHTML = `
        <div class="event-banner">
            ${event.image}
        </div>
        <div class="event-info">
            <h1>${event.title}</h1>
            <p class="event-description">${event.description}</p>
            <div class="event-meta">
                <p><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
                <p><i class="fas fa-clock"></i> ${event.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.venue}</p>
                <p><i class="fas fa-user"></i> ${event.organizer}</p>
            </div>
        </div>
        <div class="ticket-tiers">
            <div class="ticket-tier">
                <div class="tier-name">Early Bird</div>
                <div class="tier-price">₹${Math.floor(event.price * 0.8)}</div>
                <button class="btn btn-primary" onclick="addToCart(${event.id}, 'early')">Add to Cart</button>
            </div>
            <div class="ticket-tier">
                <div class="tier-name">Regular</div>
                <div class="tier-price">₹${event.price}</div>
                <button class="btn btn-primary" onclick="addToCart(${event.id}, 'regular')">Add to Cart</button>
            </div>
            <div class="ticket-tier">
                <div class="tier-name">VIP</div>
                <div class="tier-price">₹${Math.floor(event.price * 1.5)}</div>
                <button class="btn btn-primary" onclick="addToCart(${event.id}, 'vip')">Add to Cart</button>
            </div>
        </div>
        <div class="related-events">
            <h3>Related Events</h3>
            <div class="events-grid">
                ${getRelatedEvents(event.category, event.id)
                  .map((relatedEvent) => createEventCard(relatedEvent))
                  .join("")}
            </div>
        </div>
    `

  showSection("event-details")
}

// Event Rendering Functions
function renderFeaturedEvents() {
  const container = document.getElementById("featuredEvents")
  if (!container) return

  const featuredEvents = events.slice(0, 3)
  container.innerHTML = featuredEvents.map((event) => createEventCard(event)).join("")
}

function renderAllEvents() {
  const container = document.getElementById("eventsGrid")
  if (!container) return

  container.innerHTML = events.map((event) => createEventCard(event)).join("")
}

function createEventCard(event) {
  return `
        <div class="event-card fade-in" data-category="${event.category}" data-price="${event.price}">
            <div class="event-image">${event.image}</div>
            <h3 class="event-title">${event.title}</h3>
            <div class="event-details">
                <p><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
                <p><i class="fas fa-clock"></i> ${event.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.venue}</p>
            </div>
            <div class="event-price">${event.price === 0 ? "Free" : "₹" + event.price}</div>
            <button class="btn btn-primary" onclick="showEventDetails(${event.id})">View Details</button>
        </div>
    `
}

function getRelatedEvents(category, excludeId) {
  return events.filter((event) => event.category === category && event.id !== excludeId).slice(0, 3)
}

// Filter Functions
function filterEvents() {
  const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || ""
  const typeFilter = document.getElementById("typeFilter")?.value || ""
  const priceFilter = document.getElementById("priceFilter")?.value || ""

  const eventCards = document.querySelectorAll(".event-card")

  eventCards.forEach((card) => {
    const title = card.querySelector(".event-title").textContent.toLowerCase()
    const category = card.dataset.category
    const price = Number.parseInt(card.dataset.price)

    let showCard = true

    // Search filter
    if (searchTerm && !title.includes(searchTerm)) {
      showCard = false
    }

    // Type filter
    if (typeFilter && category !== typeFilter) {
      showCard = false
    }

    // Price filter
    if (priceFilter) {
      switch (priceFilter) {
        case "free":
          if (price !== 0) showCard = false
          break
        case "low":
          if (price < 1 || price > 100) showCard = false
          break
        case "medium":
          if (price < 101 || price > 300) showCard = false
          break
        case "high":
          if (price <= 300) showCard = false
          break
      }
    }

    card.style.display = showCard ? "block" : "none"
  })
}

// Cart Functions
// Cart Variables
let appliedPromo = null;
let discount = 0;
let selectedPayment = null;
let checkoutStep = 1;

function addToCart(eventId, tier = "regular") {
  const event = events.find((e) => e.id === eventId)
  if (!event) return

  let price = event.price
  switch (tier) {
    case "early":
      price = Math.floor(event.price * 0.8)
      break
    case "vip":
      price = Math.floor(event.price * 1.5)
      break
  }

  // Check if the same event and tier is already in cart
  const existingItemIndex = cart.findIndex(item => item.eventId === eventId && item.tier === tier);
  
  if (existingItemIndex !== -1) {
    // Increment quantity if already in cart
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item to cart
    const cartItem = {
      id: Date.now(),
      eventId: eventId,
      eventTitle: event.title,
      tier: tier,
      price: price,
      quantity: 1,
    }
    cart.push(cartItem)
  }
  
  updateCartUI()
  showToast("Ticket added to cart!", "success")
}

function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId)
  updateCartUI()
  showToast("Item removed from cart", "info")
}

function updateItemQuantity(itemId, change) {
  const itemIndex = cart.findIndex(item => item.id === itemId);
  if (itemIndex === -1) return;
  
  cart[itemIndex].quantity += change;
  
  // Remove item if quantity is 0 or less
  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
    showToast("Item removed from cart", "info");
  }
  
  updateCartUI();
}

function updateCartUI() {
  const cartCount = document.getElementById("cartCount")
  const cartItems = document.getElementById("cartItems")
  const cartSubtotal = document.getElementById("cartSubtotal")
  const cartDiscount = document.getElementById("cartDiscount")
  const cartTax = document.getElementById("cartTax")
  const cartTotal = document.getElementById("cartTotal")
  const discountRow = document.getElementById("discountRow")

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Apply discount if promo code is applied
  if (appliedPromo) {
    discount = subtotal * (appliedPromo.discount / 100);
    discountRow.style.display = "flex";
  } else {
    discount = 0;
    discountRow.style.display = "none";
  }
  
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = subtotal - discount + tax;

  // Update cart count (sum of all quantities)
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }

  // Update cart items
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = `<div class="empty-cart"><p>Your cart is empty</p><i class="fas fa-shopping-cart"></i></div>`;
    } else {
      cartItems.innerHTML = cart
        .map(
          (item) => `
              <div class="cart-item">
                  <h4>${item.eventTitle}</h4>
                  <p>${item.tier.charAt(0).toUpperCase() + item.tier.slice(1)} Ticket</p>
                  <div class="cart-item-quantity">
                      <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, -1)">-</button>
                      <span>${item.quantity}</span>
                      <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, 1)">+</button>
                  </div>
                  <div class="cart-item-footer">
                      <span class="cart-item-price">₹${item.price * item.quantity}</span>
                      <button class="btn btn-secondary" onclick="removeFromCart(${item.id})">Remove</button>
                  </div>
              </div>
          `,
        )
        .join("")
    }
  }

  // Update summary values
  if (cartSubtotal) cartSubtotal.textContent = subtotal;
  if (cartDiscount) cartDiscount.textContent = discount;
  if (cartTax) cartTax.textContent = tax;
  if (cartTotal) cartTotal.textContent = total;
}

function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar")
  cartSidebar.classList.toggle("active")
}

function applyPromo() {
  const promoInput = document.getElementById("promoCode");
  const promoMessage = document.getElementById("promoMessage");
  const code = promoInput.value.trim().toUpperCase();
  
  // Sample promo codes
  const promoCodes = [
    { code: "WELCOME10", discount: 10 },
    { code: "STUDENT25", discount: 25 },
    { code: "FLASH15", discount: 15 }
  ];
  
  if (!code) {
    promoMessage.innerHTML = `<span class="promo-error">Please enter a promo code</span>`;
    return;
  }
  
  const promo = promoCodes.find(p => p.code === code);
  
  if (promo) {
    appliedPromo = promo;
    promoMessage.innerHTML = `<span class="promo-success">${promo.discount}% discount applied!</span>`;
    updateCartUI();
  } else {
    promoMessage.innerHTML = `<span class="promo-error">Invalid promo code</span>`;
  }
}

// Checkout Modal Functions
function showCheckoutModal() {
  if (cart.length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }
  
  const modal = document.getElementById("checkoutModal");
  modal.classList.add("active");
  resetCheckoutSteps();
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  modal.classList.remove("active");
}

function resetCheckoutSteps() {
  // Reset to step 1
  checkoutStep = 1;
  updateCheckoutSteps();
  
  // Reset payment selection
  selectedPayment = null;
  document.querySelectorAll('input[name="payment"]').forEach(input => {
    input.checked = false;
  });
  
  // Hide all payment details
  document.getElementById("card-details").style.display = "none";
  document.getElementById("upi-details").style.display = "none";
  document.getElementById("wallet-details").style.display = "none";
}

function updateCheckoutSteps() {
  // Update step indicators
  document.querySelectorAll(".checkout-step").forEach((step, index) => {
    if (index + 1 < checkoutStep) {
      step.classList.add("completed");
      step.classList.remove("active");
    } else if (index + 1 === checkoutStep) {
      step.classList.add("active");
      step.classList.remove("completed");
    } else {
      step.classList.remove("active", "completed");
    }
  });
  
  // Show current step content
  document.querySelectorAll(".checkout-step-content").forEach((content, index) => {
    content.classList.remove("active");
  });
  
  if (checkoutStep === 1) {
    document.getElementById("payment-method-step").classList.add("active");
  } else if (checkoutStep === 2) {
    document.getElementById("confirm-step").classList.add("active");
    updateOrderSummary();
  } else if (checkoutStep === 3) {
    document.getElementById("processing-step").classList.add("active");
  }
}

function selectPaymentMethod(method) {
  selectedPayment = method;
  document.getElementById(method).checked = true;
  
  // Hide all payment details first
  document.getElementById("card-details").style.display = "none";
  document.getElementById("upi-details").style.display = "none";
  document.getElementById("wallet-details").style.display = "none";
  
  // Show selected payment method details
  document.getElementById(`${method}-details`).style.display = "block";
}

function nextCheckoutStep() {
  if (checkoutStep === 1) {
    // Validate payment method selection
    if (!selectedPayment) {
      showToast("Please select a payment method", "error");
      return;
    }
    
    // Validate payment details based on selected method
    if (selectedPayment === "card") {
      const cardNumber = document.getElementById("cardNumber").value;
      const cardExpiry = document.getElementById("cardExpiry").value;
      const cardCvv = document.getElementById("cardCvv").value;
      const cardName = document.getElementById("cardName").value;
      
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        showToast("Please fill in all card details", "error");
        return;
      }
    } else if (selectedPayment === "upi") {
      const upiId = document.getElementById("upiId").value;
      if (!upiId) {
        showToast("Please enter your UPI ID", "error");
        return;
      }
    } else if (selectedPayment === "wallet") {
      const walletType = document.getElementById("walletType").value;
      const walletMobile = document.getElementById("walletMobile").value;
      
      if (!walletType || !walletMobile) {
        showToast("Please fill in all wallet details", "error");
        return;
      }
    }
  }
  
  checkoutStep++;
  updateCheckoutSteps();
}

function prevCheckoutStep() {
  if (checkoutStep > 1) {
    checkoutStep--;
    updateCheckoutSteps();
  }
}

function updateOrderSummary() {
  const orderSummary = document.getElementById("orderSummary");
  const selectedPaymentMethod = document.getElementById("selectedPaymentMethod");
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = appliedPromo ? subtotal * (appliedPromo.discount / 100) : 0;
  const tax = Math.round((subtotal - discountAmount) * 0.18);
  const total = subtotal - discountAmount + tax;
  
  // Update order summary
  orderSummary.innerHTML = `
    <div class="summary-items">
      ${cart.map(item => `
        <div class="summary-item">
          <div class="summary-item-info">
            <strong>${item.eventTitle}</strong>
            <p>${item.tier.charAt(0).toUpperCase() + item.tier.slice(1)} Ticket × ${item.quantity}</p>
          </div>
          <div class="summary-item-price">₹${item.price * item.quantity}</div>
        </div>
      `).join("")}
    </div>
    
    <div class="order-totals">
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>₹${subtotal}</span>
      </div>
      ${appliedPromo ? `
        <div class="summary-row">
          <span>Discount (${appliedPromo.code}):</span>
          <span>-₹${discountAmount}</span>
        </div>
      ` : ''}
      <div class="summary-row">
        <span>Tax (18%):</span>
        <span>₹${tax}</span>
      </div>
      <div class="summary-row total">
        <span>Total:</span>
        <span>₹${total}</span>
      </div>
    </div>
  `;
  
  // Update selected payment method
  let paymentMethodText = "";
  switch (selectedPayment) {
    case "card":
      const cardNumber = document.getElementById("cardNumber").value;
      const lastFour = cardNumber.slice(-4);
      paymentMethodText = `Credit/Debit Card (**** **** **** ${lastFour || '****'})`;
      break;
    case "upi":
      const upiId = document.getElementById("upiId").value;
      paymentMethodText = `UPI (${upiId || 'Not specified'})`;
      break;
    case "wallet":
      const walletType = document.getElementById("walletType").value;
      paymentMethodText = `E-Wallet (${walletType || 'Not selected'})`;
      break;
  }
  
  selectedPaymentMethod.textContent = paymentMethodText;
}

function processPayment() {
  checkoutStep = 3;
  updateCheckoutSteps();
  
  // Simulate payment processing
  setTimeout(() => {
    // Add tickets to user's collection
    cart.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const event = events.find((e) => e.id === item.eventId);
        userTickets.push({
          id: Date.now() + Math.random(),
          eventTitle: item.eventTitle,
          tier: item.tier,
          price: item.price,
          date: event.date,
          venue: event.venue,
          qrCode: generateQRCode(),
        });
      }
    });

    // Clear cart and promo
    cart = [];
    appliedPromo = null;
    discount = 0;
    updateCartUI();
    renderUserTickets();

    // Close checkout modal and cart sidebar
    closeCheckoutModal();
    toggleCart();
    
    // Show success page
    showSection("success");
    showToast("Payment successful!", "success");
  }, 3000);
}

// Legacy checkout function (maintain for compatibility)
function checkout() {
  showCheckoutModal();
}

// Dashboard Functions
function showTab(tabId) {
  // Hide all tab panes
  const tabPanes = document.querySelectorAll(".tab-pane")
  tabPanes.forEach((pane) => pane.classList.remove("active"))

  // Show target tab pane
  const targetPane = document.getElementById(tabId)
  if (targetPane) {
    targetPane.classList.add("active")
  }

  // Update tab buttons
  const tabBtns = document.querySelectorAll(".tab-btn")
  tabBtns.forEach((btn) => btn.classList.remove("active"))

  const activeBtn = document.querySelector(`[onclick="showTab('${tabId}')"]`)
  if (activeBtn) {
    activeBtn.classList.add("active")
  }
}

function showOrganizerTab(tabId) {
  // Hide all tab panes
  const tabPanes = document.querySelectorAll("#organizer-dashboard .tab-pane")
  tabPanes.forEach((pane) => pane.classList.remove("active"))

  // Show target tab pane
  const targetPane = document.getElementById(tabId)
  if (targetPane) {
    targetPane.classList.add("active")
  }

  // Update tab buttons
  const tabBtns = document.querySelectorAll("#organizer-dashboard .tab-btn")
  tabBtns.forEach((btn) => btn.classList.remove("active"))

  const activeBtn = document.querySelector(`[onclick="showOrganizerTab('${tabId}')"]`)
  if (activeBtn) {
    activeBtn.classList.add("active")
  }
}

function renderUserTickets() {
  const container = document.getElementById("ticketsGrid")
  if (!container) return

  if (userTickets.length === 0) {
    container.innerHTML = '<p class="text-center">No tickets purchased yet.</p>'
    return
  }

  container.innerHTML = userTickets
    .map(
      (ticket) => `
        <div class="ticket-card">
            <h3>${ticket.eventTitle}</h3>
            <p>${ticket.tier.charAt(0).toUpperCase() + ticket.tier.slice(1)} Ticket</p>
            <div class="qr-code">${ticket.qrCode}</div>
            <div class="ticket-details">
                <p><i class="fas fa-calendar"></i> ${formatDate(ticket.date)}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${ticket.venue}</p>
                <p><strong>₹${ticket.price}</strong></p>
            </div>
            <button class="btn btn-primary" onclick="downloadTicket(${ticket.id})">Download</button>
        </div>
    `,
    )
    .join("")
}

// Auth Functions
function showAuthModal() {
  const modal = document.getElementById("authModal")
  modal.classList.add("active")
}

function closeAuthModal() {
  const modal = document.getElementById("authModal")
  modal.classList.remove("active")
}

function showAuthTab(tabId) {
  // Hide all auth forms
  const authForms = document.querySelectorAll(".auth-form")
  authForms.forEach((form) => form.classList.remove("active"))

  // Show target form
  const targetForm = document.getElementById(tabId)
  if (targetForm) {
    targetForm.classList.add("active")
  }

  // Update tab buttons
  const authTabs = document.querySelectorAll(".auth-tab")
  authTabs.forEach((tab) => tab.classList.remove("active"))

  const activeTab = document.querySelector(`[onclick="showAuthTab('${tabId}')"]`)
  if (activeTab) {
    activeTab.classList.add("active")
  }
}

// Event Creation
function handleCreateEvent(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const newEvent = {
    id: events.length + 1,
    title: formData.get("title") || e.target.querySelector('input[type="text"]').value,
    description: formData.get("description") || e.target.querySelector("textarea").value,
    date: formData.get("date") || e.target.querySelector('input[type="date"]').value,
    time: formData.get("time") || e.target.querySelector('input[type="time"]').value,
    venue: formData.get("venue") || e.target.querySelector("select").value,
    price: Number.parseInt(formData.get("price") || e.target.querySelector('input[type="number"]').value),
    category: "academic",
    organizer: "Your Organization",
    image: "📅",
  }

  events.push(newEvent)
  renderFeaturedEvents()
  renderAllEvents()

  showToast("Event created successfully!", "success")
  e.target.reset()
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function generateQRCode() {
  const codes = ["QR001", "QR002", "QR003", "QR004", "QR005"]
  return codes[Math.floor(Math.random() * codes.length)]
}

function downloadTicket(ticketId) {
  showToast("Ticket downloaded!", "success")
}

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer")
  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.textContent = message

  container.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number")

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = Number.parseInt(entry.target.dataset.target)
        animateNumber(entry.target, target)
        observer.unobserve(entry.target)
      }
    })
  })

  statNumbers.forEach((stat) => observer.observe(stat))
}

function animateNumber(element, target) {
  let current = 0
  const increment = target / 50
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current) + "+"
  }, 30)
}

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  const authModal = document.getElementById("authModal")
  if (e.target === authModal) {
    closeAuthModal()
  }

  const cartSidebar = document.getElementById("cartSidebar")
  if (e.target === cartSidebar) {
    toggleCart()
  }
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAuthModal()
    const cartSidebar = document.getElementById("cartSidebar")
    if (cartSidebar.classList.contains("active")) {
      toggleCart()
    }
  }
})

// Initialize sample tickets for demo
setTimeout(() => {
  userTickets.push({
    id: 1,
    eventTitle: "Tech Fest 2025",
    tier: "regular",
    price: 150,
    date: "2025-03-15",
    venue: "Main Auditorium",
    qrCode: "QR001",
  })
  renderUserTickets()
}, 1000)
