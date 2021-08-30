// global variables
const mealContainer = document.getElementById("meal-container");
const spinnerContainer = document.getElementById("spinner-container");
const messageContainer = document.getElementById("message-container");

// functions
const fetchData = (link, callback) => {
  fetch(link)
    .then((response) => response.json())
    .then((data) => callback(data));
};

const seeFoodDetails = (idMeal) => {
  const foodDetailsContainer = document.getElementById("food-details");
  const foodDetailsTitle = document.getElementById("food-details-title");
  const link = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;

  foodDetailsContainer.querySelector(".modal-body").innerHTML = "";
  foodDetailsTitle.innerText = "Loading...";

  fetchData(link, (data) => {
    const item = data.meals[0];

    foodDetailsTitle.innerText = item.strMeal;
    foodDetailsContainer.querySelector(".modal-body").innerHTML = `
    <div class="card">
      <img style="object-fit: cover; height: 250px;"  src="${
        item.strMealThumb
      }" class="card-img-top" alt="${item.strMeal}">
      <div class="card-body">
        <p class="card-text">${item.strInstructions.slice(0, 450)}</p>
      </div>
    </div>`;

    foodDetailsContainer.querySelector(".modal-footer").innerHTML = `
      <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">
        Close
      </button>
      <button class="btn btn-outline-success">
        Add to cart
      </button>
    
    `;
  });
};

const showError = (message, container) => {
  container.style.display = "block";
  container.className = "bg-warning p-2 w-50 mx-auto";
  container.querySelector("p").innerHTML = message;
  container.querySelector("p").classList.add("text-danger");
};

const cardFooter = (data, type) => {
  if (type == "meal" || type == "category") {
    return `
  <div class="d-flex justify-content-between">
    <button  type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#food-details" onclick="seeFoodDetails(${data.idMeal})">
      See details
    </button>
    <div class="btn btn-outline-success">Add to cart</div>
  </div>
  `;
  } else {
    return `
  <div class="d-flex justify-content-center">
    <button  type="button" class="btn btn-outline-success" onclick="seeFoodCatagories('${data.strCategory}')">
      See Catagories
    </button>
  </div>
  `;
  }
};

const seeFoodCatagories = (strCategory) => {
  mealContainergit.innerHTML = "";
  const link = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${strCategory}`;

  spinnerContainer.style.display = "block";

  fetchData(link, (data) => {
    const allItems = data.meals;
    spinnerContainer.style.display = "none";
    makeCard(mealContainer, allItems, "category");
  });
};

const makeCard = (target, data, type) => {
  let eachItem = {};

  data.forEach((item) => {
    if (type == "meal" || type == "category") {
      eachItem.imgSrc = item.strMealThumb;
      eachItem.imgAlt = item.strMeal;
      eachItem.itemName = item.strMeal;
      eachItem.idMeal = item.idMeal;
    } else {
      eachItem.imgSrc = item.strCategoryThumb;
      eachItem.imgAlt = item.strCategory;
      eachItem.itemName = item.strCategory;
      eachItem.strCategory = item.strCategory;
    }

    target.innerHTML += createFoodItem(eachItem, type);
  });
};

const createFoodItem = (data, type) => {
  return `
<div class="col">
    <div class="card h-100">
        <img src="${data.imgSrc}" class="card-img-top" alt="${data.imgAlt}" />
        <div class="card-body">
            <h5 class="card-title text-success fw-bold">${data.itemName}</h5>
        </div>
        <div class="card-footer">
            ${cardFooter(data, type)}
        </div>
    </div>
</div>
`;
};

// search search handler
document.getElementById("search-btn").addEventListener("click", () => {
  const mealContainer = document.getElementById("meal-container");
  const searchData = document.getElementById("search-field").value;
  const spinnerContainer = document.getElementById("spinner-container");
  let link = "";

  messageContainer.style.display = "none";

  mealContainer.innerHTML = "";

  if (searchData) {
    spinnerContainer.style.display = "block";

    if (searchData.length > 1) {
      link = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchData}`;
    } else {
      link = `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchData}`;
    }

    fetchData(link, (data) => {
      const allItems = data.meals;
      spinnerContainer.style.display = "none";

      if (allItems != null) {
        messageContainer.style.display = "none";

        makeCard(mealContainer, allItems, "meal");
      } else {
        showError(
          `You search for <span class="fw-bolder fst-italic">${searchData}</span>. No items found.`,
          messageContainer
        );
      }
    });
  } else {
    showError("You can't search by empty value!!!", messageContainer);
  }
});

// initial food items by category

(() => {
  const link = `https://www.themealdb.com/api/json/v1/1/categories.php`;
  spinnerContainer.style.display = "block";

  fetchData(link, (data) => {
    const allItems = data.categories;

    spinnerContainer.style.display = "none";

    if (allItems != null) {
      messageContainer.style.display = "none";

      makeCard(mealContainer, allItems, "allCategory");
    } else {
      showError(`Something went wrong...!`, messageContainer);
    }
  });
})();
