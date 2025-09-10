//  ! Load Categories from API
const loadCategories = () => {
  const url = `https://openapi.programming-hero.com/api/categories`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((err) => console.error("Failed to load categories:", err));
};

// ! Display Categories (prepends "All Plants")
const displayCategories = (categories) => {
  const categoriesContainer = document.getElementById("categories-container");
  categoriesContainer.innerHTML = "";

  // Add the "All Plants" pseudo-category first
  const allItem = document.createElement("div");
  allItem.innerHTML = `
    <li class="text-lg mb-2 cursor-pointer" onclick="loadAllPlants()">
      <a>All Plants</a>
    </li>
  `;
  categoriesContainer.appendChild(allItem);

  // Then render the real categories
  categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `
      <li class="text-lg mb-2 cursor-pointer" onclick="loadPlants(${category.id})">
        <a>${category.category_name}</a>
      </li>`;
    categoriesContainer.appendChild(categoryDiv);
  });
};

// ! Load ALL Plants from API
const loadAllPlants = () => {
  const url = `https://openapi.programming-hero.com/api/plants`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayPlants(data.plants || []))
    .catch((err) => console.error("Failed to load all plants:", err));
};

// ! Load Plants by Category from API
const loadPlants = (category_id) => {
  const url = `https://openapi.programming-hero.com/api/category/${category_id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayPlants(data.plants || []))
    .catch((err) => console.error("Failed to load plants by category:", err));
};

// ! Display Plants
const displayPlants = (plants) => {
  const plantsContainer = document.getElementById("plant-cards-container");
  plantsContainer.innerHTML = "";

  if (!plants || plants.length === 0) {
    plantsContainer.innerHTML = `<p class="text-gray-500">No plants found.</p>`;
    return;
  }

  plants.forEach((plant) => {
    const plantDiv = document.createElement("div");
    plantDiv.innerHTML = `
      <div class="card bg-base-100 shadow-md p-4 rounded-lg w-[350px] max-h-[500px]">
        <img src="${plant.image}" alt="${
      plant.name
    }" class="w-full h-[250px] rounded-md mx-auto object-cover" />
        <h1 class="text-lg font-bold mt-4">${plant.name || ""}</h1>
        <p class="text-sm mt-4 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden" 
           title="${plant.description || ""}">
           ${plant.description || ""}
        </p>
        <div class="flex items-center justify-between mt-4 mb-4">
          <a class="bg-[#DCFCE7] p-2 rounded-lg text-[#15803D]" href="#">${plant.category || ""}</a>
          <p>৳ <span>${plant.price ?? ""}</span></p>
        </div>
        <button class="btn bg-[#15803D] hover:bg-[#166534] px-8 rounded-full text-white">Add to Cart</button>
      </div>
    `;
    plantsContainer.appendChild(plantDiv);
  });
};

// Initial load
loadCategories();
loadAllPlants(); // <- show all plants on first render
