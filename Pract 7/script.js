// **Elementos del DOM**
// Se seleccionan varios elementos del DOM que serán utilizados en las funciones.
const calorieCounter = document.getElementById('calorie-counter'); // Formulario que contiene las entradas para las calorías
const budgetNumberInput = document.getElementById('budget'); // Input para el número de calorías presupuestadas
const entryDropdown = document.getElementById('entry-dropdown'); // Dropdown para seleccionar el tipo de entrada (desayuno, almuerzo, cena, etc.)
const addEntryButton = document.getElementById('add-entry'); // Botón para agregar nuevas entradas de calorías
const clearButton = document.getElementById('clear'); // Botón para limpiar el formulario
const output = document.getElementById('output'); // Área para mostrar el resultado de las calorías

// **Estado**
let isError = false; // Variable de estado para determinar si hay algún error durante la validación de entradas

// **Función para limpiar entradas**
// Esta función elimina espacios y signos de más o menos (+, -) de las entradas que ingresan los usuarios.
function cleanInputString(str) {
  const regex = /[+-\s]/g; // Expresión regular para encontrar signos de más, menos y espacios
  return str.replace(regex, ''); // Retorna la cadena sin esos caracteres
}

// **Verificar entradas inválidas**
// Esta función verifica si una entrada contiene un formato inválido como "notación científica" (por ejemplo, 1e5).
function isInvalidInput(str) {
  const regex = /\d+e\d+/i; // Expresión regular que busca notación científica en las entradas
  return str.match(regex); // Retorna el valor si coincide con el patrón, o null si no lo encuentra
}

// **Función para agregar entrada**
// Esta función agrega un nuevo conjunto de inputs para introducir una entrada de calorías (nombre y cantidad) en la sección seleccionada por el dropdown.
function addEntry() {
  // Selecciona el contenedor correspondiente a la sección seleccionada en el dropdown
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  
  // Determina el número de la nueva entrada basándose en cuántos inputs ya existen
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

  // Plantilla de HTML para los inputs de nombre y calorías
  const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entrada ${entryNumber} Nombre</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Nombre" />
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entrada ${entryNumber} Calorías</label>
    <input
      type="number"
      id="${entryDropdown.value}-${entryNumber}-calories"
      placeholder="Calorías"
      min="0"
    />
  `;

  // Inserta el nuevo conjunto de inputs en el contenedor correspondiente
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

// **Obtener calorías de entradas**
// Esta función recopila las calorías ingresadas por el usuario en los inputs y las suma.
// Además, limpia las entradas y valida si hay entradas inválidas.
function getCaloriesFromInputs(list) {
  let calories = 0; // Inicializa la variable de calorías
  
  for (const item of list) { // Itera sobre cada input de calorías
    const currVal = cleanInputString(item.value); // Limpia la entrada eliminando signos de más o menos y espacios
    const invalidInputMatch = isInvalidInput(currVal); // Verifica si el valor tiene formato inválido
    
    if (invalidInputMatch) { // Si encuentra una entrada inválida
      alert(`Entrada inválida: ${invalidInputMatch[0]}`); // Muestra una alerta con el error
      isError = true; // Actualiza el estado de error
      return null; // Detiene la función y retorna null
    }
    
    calories += Number(currVal); // Suma las calorías (después de haber limpiado y validado el valor)
  }
  
  return calories; // Retorna el total de calorías
}

// **Función para calcular calorías**
// Esta función calcula las calorías consumidas, quemadas y el superávit o déficit de calorías.
function calculateCalories(e) {
  e.preventDefault(); // Previene la recarga de página al enviar el formulario
  isError = false; // Reinicia el estado de error

  // Obtiene las calorías de cada sección (desayuno, almuerzo, cena, snacks, ejercicio) llamando a `getCaloriesFromInputs`
  const breakfastCalories = getCaloriesFromInputs(document.querySelectorAll('#breakfast input[type="number"]'));
  const lunchCalories = getCaloriesFromInputs(document.querySelectorAll('#lunch input[type="number"]'));
  const dinnerCalories = getCaloriesFromInputs(document.querySelectorAll('#dinner input[type="number"]'));
  const snacksCalories = getCaloriesFromInputs(document.querySelectorAll('#snacks input[type="number"]'));
  const exerciseCalories = getCaloriesFromInputs(document.querySelectorAll('#exercise input[type="number"]'));
  const budgetCalories = Number(budgetNumberInput.value); // Obtiene el número de calorías presupuestadas
  
  if (isError) return; // Si hay error, se detiene la ejecución de la función

  // Calcula las calorías consumidas y las restantes
  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Superávit' : 'Déficit'; // Determina si hay superávit o déficit

  // Actualiza el contenido de salida con los resultados
  output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorías ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calorías Presupuestadas</p>
    <p>${consumedCalories} Calorías Consumidas</p>
    <p>${exerciseCalories} Calorías Quemadas</p>
  `;
  output.classList.remove('hide'); // Muestra la sección de resultados si estaba oculta
}

// **Función para limpiar formulario**
// Esta función limpia todas las entradas del formulario y resetea el contenido.
function clearForm() {
  // Elimina todos los inputs de cada sección (desayuno, almuerzo, etc.)
  document.querySelectorAll('.input-container').forEach(container => (container.innerHTML = ''));
  budgetNumberInput.value = ''; // Limpia el input de calorías presupuestadas
  output.innerHTML = ''; // Limpia el área de salida
  output.classList.add('hide'); // Oculta el área de salida
}

// **Eventos**
// Asocia las funciones a los eventos de los botones y del formulario
addEntryButton.addEventListener('click', addEntry); // Agregar entrada al hacer click en el botón
calorieCounter.addEventListener('submit', calculateCalories); // Calcular calorías al enviar el formulario
clearButton.addEventListener('click', clearForm); // Limpiar formulario al hacer click en el botón de limpiar
