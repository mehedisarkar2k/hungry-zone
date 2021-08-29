const createFoodItem = (data) => {
  return `
<div class="col">
    <div class="card h-100">
        <img src="${data.imgSrc}" class="card-img-top" alt="${data.imgAlt}" />
        <div class="card-body">
            <h5 class="card-title">${data.itemName}</h5>
            <p class="card-text">
                ${data.itemDetails}
            </p>
        </div>
        <div class="card-footer">
            <div class="d-flex justify-content-between">
                <div class="btn btn-outline-primary">See details</div>
                <div class="btn btn-outline-primary">Add to cart</div>
            </div>
        </div>
    </div>
</div>
`;
};

const fetchData = (link, callback) => {
  fetch(link)
    .then((response) => response.json())
    .then((data) => callback(data));
};

document.getElementById("search-btn").addEventListener("click", () => {
  const mealContainer = document.getElementById("meal-container");
  const searchData = document.getElementById("search-field").value;
  const messageContainer = document.getElementById("message-container");
  const spinnerContainer = document.getElementById("spinner-container");

  messageContainer.style.display = "none";

  const link = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchData}`;
  mealContainer.innerHTML = "";

  if (searchData) {
    spinnerContainer.style.display = "block";

    fetchData(link, (data) => {
      const allItems = data.meals;
      spinnerContainer.style.display = "none";

      if (allItems != null) {
        messageContainer.style.display = "none";

        allItems.forEach((item) => {
          const eachItem = {
            imgSrc: item.strMealThumb,
            imgAlt: item.strMeal,
            itemName: item.strMeal,
            itemDetails: item.strInstructions.slice(0, 250),
          };

          mealContainer.innerHTML += createFoodItem(eachItem);
        });
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

const showError = (message, container) => {
  container.style.display = "block";
  container.className = "bg-warning p-2 w-50 mx-auto";
  container.querySelector("p").innerHTML = message;
  container.querySelector("p").classList.add("text-danger");
};
