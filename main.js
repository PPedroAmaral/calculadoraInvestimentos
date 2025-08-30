import { generateReturnsArray } from "./src/investimentGoals";

const form = document.getElementById("investiment-form");
const clearFormButton = document.getElementById('clear-form')

function renderProgression(evt) {
  evt.preventDefault();
  if(document.querySelector('.error')){
    return;
  }
  const startingAmmount = Number(
    document.getElementById("starting-amount").value.replace(',','.')
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(',','.')
  );
  const timeAmount = Number(document.getElementById("time-amount"));
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(document.getElementById("return-rate").value.replace(',','.'));
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(document.getElementById("tax-rate").value.replace(',','.'));

  const returnsArray = generateReturnsArray(
    startingAmmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  console.log(returnsArray);
}

function clearForm() {
  form['startubg-amount'].value = '';
  form['additional-contribution'].value = '';
  form['time-amount'].value = '';
  form['return-rate'].value = '';
  form['tax-rate'].value = '';

  const errorInputContainers = document.querySelectorAll('.error');

  for( const errorInputContainer of errorInputContainers) {
    errorInputContainer.classList.revome('error');
    errorInputContainer.parentElement.querySelector('p').remove()
  }
}

function validateInput(evt) {
  if(evt.target.value === '') {
    return;
  }

  const parentElement = evt.target.parentElement;
  const grandParentElemnt = evt.target.parentElement.parentElement;
  const inputValue = evt.target.value.replace(',','.');

  if (!parentElement.classList.contains('error') && (isNaN(inputValue) || Number(inputValue) <= 0)) {
    const errorTextElement = document.createElement('p');
    errorTextElement.classList.add('text-red-800');
    errorTextElement.innerHTML = 'Insira um valor numérico ou maior que zero'; 
    
    parentElement.classList.add('error');
    grandParentElemnt.appendChild(errorTextElement);
    
  } else if (parentElement.classList.contains('error') && !isNaN(inputValue) && Number(inputValue) > 0 ) {
    parentElement.classList.remove('error');
    grandParentElemnt.querySelector('p').remove();
  }
}

for (const formElemnt of form) {
  if (formElemnt.tagName === "INPUT" && formElemnt.hasAttribute("name")) {
    formElemnt.addEventListener("blur", validateInput);
  }
}

form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener('click', clearForm);


