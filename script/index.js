const resultDiv = document.getElementById("results");
let dataSaved = null;
let searchResults = null;
const errorMsg = document.getElementById("inputMsg");
const loader = document.querySelector("#loading");

// Fetch the data and save it to the DOM (only once)
async function fetchAndSaveData() {
  if (!dataSaved) {
    const url =
      "https://raw.githubusercontent.com/chingu-voyages/v46-tier1-team-07/main/data/recipes.json";
    // const url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=60&q=${searchInput}`;
    // const options = {
    //   method: "GET",
    //   headers: {
    //     "X-RapidAPI-Key": "Add API Key Here",
    //     "X-RapidAPI-Host": "tasty.p.rapidapi.com",
    //   },
    // };
    try {
      const response = await fetch(url);
      //   const response = await fetch(url, options);
      const data = await response.json();
      dataSaved = data.results;
    } catch (error) {
      errorMsg.innerHTML = `<p>Something went wrong</p>`;
      resultDiv.innerHTML = "";
      return;
    }
  }
}

// Add event listener
document.getElementById("addInput").addEventListener("keyup", (event) => {
  if (addInput.value.length === 0) {
    errorMsg.innerHTML = `<p>Please enter a search term</p>`;
    resultDiv.innerHTML = "";
    return;
  } else {
    if (event.key === "Enter") {
      errorMsg.innerHTML = "";
      recipeApiResult();
    }
  }
});

document.getElementById("searchBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = document.getElementById("addInput").value.trim();
  if (searchInput.length > 0) {
    recipeApiResult();
  } else {
    errorMsg.innerHTML = `<p>Please enter a search term</p>`;
    resultDiv.innerHTML = "";
    return;
  }
});

async function recipeApiResult() {
  try {
    const searchInput = document.getElementById("addInput").value.toLowerCase();
    searchResults = dataSaved.filter((item) =>
      item.description.toLowerCase().includes(searchInput)
    );
    if (searchResults.length > 0) {
      showResults(searchResults);
    } else {
      showNoResults();
    }
  } catch (error) {
    errorMsg.innerHTML = `<p>Something went wrong</p>`;
    resultDiv.innerHTML = "";
    return;
  }
  document.getElementById("addInput").value = "";
}

// Display search results
function showResults(data) {
  displayLoading();
  resultDiv.innerHTML = "";

  data.forEach((item) => {
    resultDiv.innerHTML += `<div class="result-item">
    <p><img src="${item.thumbnail_url}" alt="${item.name}" width="20%" /></p>
    <p>${item.name}</p>
    <p>${item.id}</p>
    <button onclick="showRecipeDetails(${item.id})">More Information</button>
    </div>`;
  });
  errorMsg.innerHTML = "";
}

function showNoResults() {
  resultDiv.innerHTML = `<p>There are no results</p>`;
}

// Define the recepiApiDetails function
async function recepiApiDetails(id) {
  try {
    const recipe = findRecipeById(id, searchResults);
    let instructionSteps = " ";
    recipe.instructions.forEach((item) => {
      instructionSteps += `<li>${item.display_text}</li>`;
    });
    let category = " ";
    recipe.topics.forEach((item) => {
      category += `<span>${item.name}, </span>`;
    });
    if (recipe) {
      resultDiv.innerHTML = `
          <div class="recipe-details">
            <p>${recipe.name}</p>
            <p>Category: ${category}</p>
            <p>Instructions:</p>
            <ul>${instructionSteps}</ul>
            <button onclick="showSearchResults()">Back to Results</button>
          </div>
        `;
    } else {
      resultDiv.innerHTML = `<p>Recipe not found</p>`;
    }
  } catch (error) {
    errorMsg.innerHTML = `<p>Something went wrong</p>`;
    return;
  }
}

// Show Recipe Details
function showRecipeDetails(id) {
  recepiApiDetails(id);
}

// Show Search Results
function showSearchResults() {
  showResults(searchResults);
}

// Add this function to find a recipe by ID
function findRecipeById(id, recipesList) {
  return recipesList.find((recipe) => recipe.id === id);
}

// Loading spinner until fetch is uploaded
function displayLoading() {
  loader.classList.add("display");
  setTimeout(() => {
    loader.classList.remove("display");
  }, 500);
}

// hiding loading
function hideLoading() {
  loader.classList.remove("display");
}

// Fetch and save data to DOM when the page loads
window.addEventListener("load", () => {
  fetchAndSaveData();
});

document.getElementById("refresh-btn").addEventListener("click", function () {
  window.location.reload();
});
