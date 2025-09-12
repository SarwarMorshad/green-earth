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
 * Cart (in-memory)
 ***********************/
let cart = []; // resets on refresh
let currentPlants = []; // last rendered list for easy addToCart

// Draw the cart into the right sidebar (.cart-items)
const renderCart = () => {
  const list = document.querySelector(".cart-items");
  if (!list) return;

  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = `<p class="text-gray-500">Your cart is empty.</p>`;
    const badge = document.getElementById("cart-count");
    if (badge) badge.textContent = "0";
    return;
  }

  let totalQty = 0;
  let totalPrice = 0;

  cart.forEach((item, i) => {
    totalQty += item.qty;
    totalPrice += (item.price || 0) * item.qty;

    const row = document.createElement("div");
    row.className = "flex items-center justify-between bg-white p-3 rounded-md shadow-sm mb-2";
    row.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${item.image}" class="w-12 h-12 object-cover rounded" alt="${item.name}">
        <div>
          <p class="font-medium">${item.name}</p>
          <p class="text-sm opacity-70">৳ ${item.price || 0} × ${item.qty}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 ml-4 mr-2">
        <button class="btn btn-xs" onclick="decrementCartAt(${i})">−</button>
        <button class="btn btn-xs" onclick="incrementCartAt(${i})">+</button>
        <button class="btn btn-xs btn-error" onclick="removeCartAt(${i})">✕</button>
      </div>
    `;
    list.appendChild(row);
  });

  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = String(totalQty);

  const totalRow = document.createElement("div");
  totalRow.className = "text-right font-semibold mt-2";
  totalRow.textContent = `Total: ৳ ${totalPrice}`;
  list.appendChild(totalRow);
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

/***********************
 * Products grid
 ***********************/
const displayPlants = (plants) => {
  currentPlants = plants || [];

  const container = document.getElementById("plant-cards-container");
  container.innerHTML = "";

  if (!plants || plants.length === 0) {
    container.innerHTML = `
      <div class="col-span-full place-self-center text-center">
        <p class="text-center"><i class="fa-solid fa-triangle-exclamation text-2xl"></i></p>
        <p>No plants found in this category.</p>
        <h1 class="font-bold text-xl mt-6">Try another category</h1>
      </div>`;
    return;
  }

  plants.forEach((plant, idx) => {
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

// Beginner-friendly: add by index, merge by name
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

/***********************
 * Initial boot
 ***********************/
loadCategories();
loadAllPlants();
renderCart(); // show empty state on first load
