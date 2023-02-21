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

function getValueByKey(meal, keyField) {
	const arrFromObj = Object.entries(meal)
	const allIngredients = arrFromObj.filter(([key,value]) => {
		return key.includes(keyField.trim()) && value !== ''
	}).filter(([_,val]) => val !==null).map(([_, val]) => val)
	return allIngredients
}

async function openModal(id) {
	modal.style.display = 'flex';
	const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);

	const { meals } = await res.json();
	const [meal] = meals;
	const { strMeal, strMealThumb, strInstructions, strYoutube } = meal;

	const ingredients = getValueByKey(meal, "strIngredient");
	const measures = getValueByKey(meal, "strMeasure");
	console.log(ingredients);
	console.log(measures);

	modal.innerHTML = `
		<div class="modal-container">
			<button onclick="closeModal()" class=close-btn>
				<i class="fa fa-times" aria-hidden="true"></i>
			</button>
			<div class="left-part">
				<img src="${meal.strMealThumb}" alt="Meal Image Thumb">
			</div>
			<div class="right-part">
				<h2 class="right-part_header">${strMeal}</h2>
				<p class="right-part_instructions">${strInstructions}</p>
				<div class=ingredients-measurements-comtainer>
					<ul class=ingredients></ul>
					<ul class=measures></ul>
				</div>
				${strYoutube && `<a class="watch-video" href=${strYoutube} target=_black>watch video</a>`}
			</div>
		</div>
	`;
	const ingredientsEl = modal.querySelector(".ingredients");
	const measuresEl = modal.querySelector(".measures");
	for (let i = 0; i < ingredients.length; i++) {
		const ingredient = ingredients[i];
		ingredientsEl.innerHTML += `<li>${ingredient}</li>`;
	}
	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];
		measuresEl.innerHTML += `<li>${measure}</li>`;
	}
}

async function getRecepies() {
	const recipeName = searchInput.value;
	const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);
	const data = await res.json();
	createRecipesGrid(data);
	searchInput.value = "";
}

function closeModal() {
	modal.style.display = "none";
}
