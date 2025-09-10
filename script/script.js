//  ! Load Categories from API
const loadCategories = () => {
  const url = `https://openapi.programming-hero.com/api/categories`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
};

// ! Display Categories
const displayCategories = (categories) => {
  console.log(categories);
  const categoriesContainer = document.getElementById("categories-container");
  categoriesContainer.innerHTML = "";
  categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `<li class="text-lg mb-2 cursor-pointer"><a >${category.category_name}</a></li>`;
    categoriesContainer.appendChild(categoryDiv);
  });
};

loadCategories();
