const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const recipesList = document.querySelector(".recipes-list");
const modal = document.querySelector(".modal");

searchBtn.addEventListener('click', getRecepies);
searchInput.addEventListener('keypress', event => {
	if (event.key === 'Enter' || event.keyCode === 13) {
		getRecepies();
	}
});

function createRecipesGrid({ meals }) {
	if (meals) {
		recipesList.innerHTML = "";
		console.log(meals);
		for (let i = 0; i < meals.length; i++) {
			const meal = meals[i];
			const {strArea, strMealThumb, strMeal, idMeal} = meal;

			recipesList.innerHTML += `
				<div class="recipe-box">
					<span>${strArea}</span>
					<img src="${strMealThumb}" alt="">
					<p>${strMeal}</p>
					<button onclick="openModal(${idMeal})" class="view-btn">View Recipe</button>
				</div>
			`;
		}
	} else {
		recipesList.innerHTML = "Recipes not found";
	}
}

async function openModal(id) {
	modal.style.display = 'flex';
	const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
	const {meals} = await res.json();
	const [meal] = meals;
	console.log(meal);
}

async function getRecepies() {
	const recipeName = searchInput.value;
	const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);
	const data = await res.json();
	createRecipesGrid(data);
	searchInput.value = "";
}
