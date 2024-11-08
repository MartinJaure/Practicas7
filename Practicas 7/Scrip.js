document.addEventListener('DOMContentLoaded', function () {
    const calorieForm = document.getElementById('calorieForm');
    const budgetInput = document.getElementById('budget');
    const mealCaloriesInput = document.getElementById('mealCalories');
    const mealList = document.getElementById('mealList');
    const resultDiv = document.getElementById('result');
    const meals = [];

    document.getElementById('addMeal').addEventListener('click', function () {
        const mealCalories = parseInt(mealCaloriesInput.value);
        if (!isNaN(mealCalories) && mealCalories >= 0) {
            meals.push(mealCalories);
            const li = document.createElement('li');
            li.textContent = `Comida: ${mealCalories} calorías`;
            mealList.appendChild(li);
            mealCaloriesInput.value = ''; // Limpiar el campo de entrada
        } else {
            alert('Por favor, ingresa un número válido de calorías o deja el campo vacío.');
        }
    });

    calorieForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar el envío del formulario

        const budget = parseInt(budgetInput.value);
        const totalCalories = meals.reduce((total, meal) => total + meal, 0);

        if (totalCalories < budget) {
            resultDiv.textContent = `Estás en un déficit de ${budget - totalCalories} calorías.`;
        } else if (totalCalories > budget) {
            resultDiv.textContent = `Estás en un superávit de ${totalCalories - budget} calorías.`;
        } else {
            resultDiv.textContent = 'Estás en equilibrio calórico.';
        }
    });
});