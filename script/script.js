//  ! Load Categories from API
const loadCategories = () => {
  const url = `https://openapi.programming-hero.com/api/categories`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
};

// ! Display Categories
const displayCategories = (categories) => {
  //   console.log(categories);
  const categoriesContainer = document.getElementById("categories-container");
  categoriesContainer.innerHTML = "";
  categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    // console.log(category.id);
    categoryDiv.innerHTML = `<li class="text-lg mb-2 cursor-pointer" onclick="loadPlants(${category.id})"><a>${category.category_name}</a></li>`;
    categoriesContainer.appendChild(categoryDiv);
  });
};

// ! Load Plants from API
const loadPlants = (category_id) => {
  const url = `https://openapi.programming-hero.com/api/category/${category_id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayPlants(data.plants));
};

// ! Display Plants
const displayPlants = (plants) => {
  //   console.log(plants);
  const plantsContainer = document.getElementById("plant-cards-container");
  plantsContainer.innerHTML = "";
  plants.forEach((plant) => {
    const plantDiv = document.createElement("div");
    plantDiv.innerHTML = `
       <div class="card bg-base-100 shadow-md p-4 rounded-lg w-[350px] max-h-[500px]">
            <img src="${plant.image}" alt="${plant.name}" class="w-full h-[250px] rounded-md mx-auto " />
            <h1 class="text-lg font-bold mt-4">${plant.name}</h1>
            <p class="text-sm overflow-hidden text-ellipsis whitespace-nowrap mt-4" title="${plant.description}">${plant.description}</p>
            <div class="flex items-center justify-between mt-4 mb-4">
              <a class="bg-[#DCFCE7] p-2 rounded-lg text-[#15803D]" href="#">${plant.category}</a>
              <p>৳ <span>${plant.price}</span></p>
            </div>
            <button class="btn bg-[#15803D] hover:bg-[#166534] px-8 rounded-full text-white">Add to Cart</button>
          </div>
    `;
    plantsContainer.appendChild(plantDiv);
  });
};

loadCategories();
