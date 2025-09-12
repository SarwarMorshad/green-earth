/***********************
 * Globals
 ***********************/
let cart = []; // in-memory cart (clears on refresh)
let allPlants = []; // full list from API (all or filtered)
let currentPlants = []; // current page slice (used by addToCart)
let currentPage = 1;
const PAGE_SIZE = 6;

/***********************
 * Categories
 ***********************/

// ! Load Categories from API
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((json) => displayCategories(json.categories))
    .catch((err) => console.error("Failed to load categories:", err));
};

// ! Display Categories (with "All Plants" first)
const displayCategories = (categories) => {
  const categoriesContainer = document.getElementById("categories-container");
  categoriesContainer.innerHTML = "";

  // All Plants button
  const allDiv = document.createElement("div");
  allDiv.innerHTML = `
    <button id="btn-category-all"
            onclick="loadAllPlants()"
            class="btn-category btn btn-outline btn-success w-full mb-2">
      All Plants
    </button>`;
  categoriesContainer.appendChild(allDiv);

  // Real category buttons
  categories.forEach((cat) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `
      <button id="btn-category-${cat.id}"
              onclick="loadPlants(${cat.id})"
              class="btn-category btn btn-outline btn-success w-full mb-2">
        ${cat.category_name || "Category"}
      </button>`;
    categoriesContainer.appendChild(categoryDiv);
  });

  // Default active
  document.getElementById("btn-category-all")?.classList.add("btn-active");
};

// ! Clear Active (simple pattern)
const clearActiveButtons = () => {
  const buttons = document.querySelectorAll(".btn-category");
  buttons.forEach((button) => button.classList.remove("btn-active"));
};

/***********************
 * Spinner (optional)
 ***********************/
const manageSpinner = (show) => {
  const spinner = document.getElementById("spinner");
  if (!spinner) return; // if you didn't add spinner HTML, just ignore
  spinner.classList.toggle("hidden", !show);
};

/***********************
 * Data loaders
 ***********************/
const loadAllPlants = () => {
  manageSpinner(true);
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((json) => {
      clearActiveButtons();
      document.getElementById("btn-category-all")?.classList.add("btn-active");
      displayPlants(json.plants || []);
    })
    .catch((err) => {
      console.error("Failed to load all plants:", err);
      displayPlants([]);
    })
    .finally(() => manageSpinner(false));
};

const loadPlants = (category_id) => {
  manageSpinner(true);
  fetch(`https://openapi.programming-hero.com/api/category/${category_id}`)
    .then((res) => res.json())
    .then((json) => {
      clearActiveButtons();
      document.getElementById(`btn-category-${category_id}`)?.classList.add("btn-active");
      displayPlants(json.plants || []);
    })
    .catch((err) => {
      console.error("Failed to load plants by category:", err);
      displayPlants([]);
    })
    .finally(() => manageSpinner(false));
};

/***********************
 * Products grid (Paged)
 ***********************/
// ! Entry point when new data arrives: store, reset page, render
const displayPlants = (plants) => {
  allPlants = plants || [];
  currentPage = 1;
  renderCurrentPage();
  renderPagination();
};

// ! Render the current page slice
const renderCurrentPage = () => {
  const container = document.getElementById("plant-cards-container");
  container.innerHTML = "";

  if (!allPlants || allPlants.length === 0) {
    container.innerHTML = `
      <div class="col-span-full place-self-center text-center">
        <p class="text-center"><i class="fa-solid fa-triangle-exclamation text-2xl"></i></p>
        <p>No plants found in this category.</p>
        <h1 class="font-bold text-xl mt-6">Try another category</h1>
      </div>`;
    currentPlants = [];
    renderPagination(); // clear/hide pager if needed
    return;
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const slice = allPlants.slice(start, end);
  currentPlants = slice; // used by addToCart(index)

  slice.forEach((plant, idx) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="bg-white p-5 rounded-lg shadow-md w-[350px] max-h-[520px]">
        <img src="${plant.image}" alt="${plant.name || "Plant"}"
             class="w-full h-[250px] rounded-md object-cover" />
        <h1 class="font-bold text-lg mt-4">${plant.name || ""}</h1>

        <p class="text-sm mt-3 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden"
           title="${plant.description || ""}">
          ${plant.description || ""}
        </p>

        <div class="flex items-center justify-between mt-4 mb-4">
          <span class="bg-[#DCFCE7] text-[#15803D] p-2 rounded-md">${plant.category || ""}</span>
          <p>৳ <span>${plant.price ?? ""}</span></p>
        </div>
        <button onclick="addToCart(${idx})" class="btn bg-[#15803D] text-white w-full">
          Add to Cart
        </button>
      </div>`;
    container.appendChild(card);
  });
};

// ! Render paginator (Prev, numbers, Next)
const renderPagination = () => {
  const pager = document.getElementById("pagination");
  if (!pager) return;

  const total = allPlants.length;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 0;

  if (totalPages <= 1) {
    pager.innerHTML = "";
    return;
  }

  let html = `<div class="join">`;

  // Prev
  const prevDisabled = currentPage === 1 ? "btn-disabled" : "";
  html += `<button class="join-item btn ${prevDisabled}" onclick="prevPage()">«</button>`;

  // Page numbers (simple: show all)
  for (let p = 1; p <= totalPages; p++) {
    const active = p === currentPage ? "btn-active" : "";
    html += `<button class="join-item btn ${active}" onclick="goToPage(${p})">${p}</button>`;
  }

  // Next
  const nextDisabled = currentPage === totalPages ? "btn-disabled" : "";
  html += `<button class="join-item btn ${nextDisabled}" onclick="nextPage()">»</button>`;

  html += `</div>`;

  pager.innerHTML = html;
};

const goToPage = (p) => {
  const totalPages = Math.ceil((allPlants?.length || 0) / PAGE_SIZE) || 0;
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderCurrentPage();
  renderPagination();
};

const prevPage = () => goToPage(currentPage - 1);
const nextPage = () => goToPage(currentPage + 1);

/***********************
 * Cart (in-memory)
 ***********************/
// Draw the cart into the sidebar (.cart-items) and modal (#cart-modal-items)
const renderCart = () => {
  const targets = [
    document.querySelector(".cart-items"), // sidebar
    document.getElementById("cart-modal-items"), // modal
  ].filter(Boolean);

  const isEmpty = cart.length === 0;

  let totalQty = 0;
  let totalPrice = 0;

  let html = "";

  if (isEmpty) {
    html = `<p class="text-gray-500">Your cart is empty.</p>`;
  } else {
    const rows = cart
      .map((item, i) => {
        totalQty += item.qty;
        totalPrice += (item.price || 0) * item.qty;
        return `
        <div class="flex items-center justify-between bg-white p-3 rounded-md shadow-sm mb-2">
          <div class="flex items-center gap-3">
            <img src="${item.image}" class="w-12 h-12 object-cover rounded" alt="${item.name}">
            <div>
              <p class="font-medium">${item.name}</p>
              <p class="text-sm opacity-70">৳ ${item.price || 0} × ${item.qty}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-xs" onclick="decrementCartAt(${i})">−</button>
            <button class="btn btn-xs" onclick="incrementCartAt(${i})">+</button>
            <button class="btn btn-xs btn-error" onclick="removeCartAt(${i})">✕</button>
          </div>
        </div>`;
      })
      .join("");

    html = rows + `<div class="text-right font-semibold mt-2">Total: ৳ ${totalPrice}</div>`;
  }

  targets.forEach((el) => (el.innerHTML = html));

  // Update badges (navbar / optional others)
  const badgeEls = [
    document.getElementById("cart-count-nav"), // navbar badge (indicator)
    document.getElementById("cart-count"), // sidebar title badge (optional)
    document.getElementById("cart-count-modal"), // modal title badge (optional)
  ].filter(Boolean);

  const qtyStr = String(totalQty);
  badgeEls.forEach((b) => (b.textContent = cart.length === 0 ? "0" : qtyStr));
};

const incrementCartAt = (i) => {
  if (!cart[i]) return;
  cart[i].qty += 1;
  renderCart();
};

const decrementCartAt = (i) => {
  if (!cart[i]) return;
  cart[i].qty = Math.max(0, cart[i].qty - 1);
  if (cart[i].qty === 0) removeCartAt(i);
  else renderCart();
};

const removeCartAt = (i) => {
  cart.splice(i, 1);
  renderCart();
};

// Beginner-friendly: add by index, merge by name (good enough for now)
const addToCart = (index) => {
  const p = currentPlants[index];
  if (!p) return;

  const found = cart.find((item) => item.name === p.name);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({
      name: p.name || "Plant",
      price: Number(p.price) || 0,
      image: p.image || "",
      qty: 1,
    });
  }

  renderCart();
};

function openCartModal() {
  renderCart();
  const dlg = document.getElementById("cart-modal");
  if (dlg && dlg.showModal) dlg.showModal();
}

/***********************
 * Initial boot
 ***********************/
loadCategories();
loadAllPlants();
renderCart(); // show empty state on first load
