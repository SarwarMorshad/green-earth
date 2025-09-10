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

  // All Plants button (same style & inline onclick pattern as your lessons code)
  const allDiv = document.createElement("div");
  allDiv.innerHTML = `
    <button id="btn-category-all"
            onclick="loadAllPlants()"
            class="btn-category btn btn-outline btn-success w-full mb-2"> All Plants
    </button>`;
  categoriesContainer.appendChild(allDiv);

  // Real category buttons
  categories.forEach((cat) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `
      <button id="btn-category-${cat.id}"
              onclick="loadPlants(${cat.id})"
              class="btn-category mb-2 btn btn-outline btn-success w-full"> ${cat.category_name || "Category"}
      </button>`;
    categoriesContainer.appendChild(categoryDiv);
  });

  // Set default active
  document.getElementById("btn-category-all")?.classList.add("btn-active");
};

// ! Clear Active (same simple pattern you like)
const clearActiveButtons = () => {
  const buttons = document.querySelectorAll(".btn-category");
  buttons.forEach((button) => {
    button.classList.remove("btn-active");
  });
};

// ! Spinner manager (matches your commented HTML structure)
const manageSpinner = (show) => {
  const spinner = document.getElementById("spinner");
  if (!spinner) return;
  if (show) {
    spinner.classList.remove("hidden");
  } else {
    spinner.classList.add("hidden");
  }
};

// ! Load ALL Plants from API
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

// ! Load Plants by Category from API
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

// ! Display Plants (card grid)
const displayPlants = (plants) => {
  const plantsContainer = document.getElementById("plant-cards-container");
  plantsContainer.innerHTML = "";

  if (!plants || plants.length === 0) {
    plantsContainer.innerHTML = `
      <div class="col-span-full place-self-center text-center">
        <p class="text-center"><i class="fa-solid fa-triangle-exclamation text-2xl"></i></p>
        <p>No plants found in this category.</p>
        <h1 class="font-bold text-xl mt-6">Try another category</h1>
      </div>
    `;
    return;
  }

  plants.forEach((plant) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="bg-white p-5 rounded-lg shadow-md w-[350px] max-h-[520px]">
        <img src="${plant.image}" alt="${plant.name || "Plant"}"
             class="w-full h-[250px] rounded-md object-cover" />
        <h1 class="font-bold text-lg mt-4">${plant.name || ""}</h1>

        <!-- two-line truncate (no Tailwind plugin needed) -->
        <p class="text-sm mt-3 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden"
           title="${plant.description || ""}">
          ${plant.description || ""}
        </p>

        <div class="flex items-center justify-between mt-4 mb-4">
          <span class="bg-[#DCFCE7] text-[#15803D] p-2 rounded-md">${plant.category || ""}</span>
          <p>৳ <span>${plant.price ?? ""}</span></p>
        </div>
        <button class="btn bg-[#15803D] text-white w-full">Add to Cart</button>
      </div>
    `;
    plantsContainer.appendChild(card);
  });
};

// ! Initial boot (same pattern as your lessons)
loadCategories();
loadAllPlants();
