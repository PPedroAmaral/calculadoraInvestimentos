import { generateReturnsArray } from "./src/investimentGoals";
import { Chart } from "chart.js/auto";

const finalMoneyChart = document.getElementById("final-money-distribuition");
const progressionChart = document.getElementById("progression");
const form = document.getElementById("investiment-form");
const clearFormButton = document.getElementById("clear-form");
let doughnutChartReference = {};
let progressionChartReference = {};

function formatCurrency(value) {
  return value.toFixed(2);
}

function renderProgression(evt) {
  evt.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  resetCharts();
  
  const startingAmmount = Number(
    document.getElementById("starting-amount").value.replace(",", ".")
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(",", ".")
  );
  const timeAmount = Number(document.getElementById("time-amount").value.replace(",", "."));
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", ".")
  );
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("tax-rate").value.replace(",", ".")
  );

  const returnsArray = generateReturnsArray(
    startingAmmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  const finalInvestimentObject = returnsArray[returnsArray.length - 1];

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total investido", "Rendimento", "Imposto"],
      datasets: [
        {
          data: [
            formatCurrency(finalInvestimentObject.investedAmount),
            formatCurrency(
              finalInvestimentObject.totalInterestReturns * (1 - taxRate / 100)
            ),
            formatCurrency(
              finalInvestimentObject.totalInterestReturns * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            "rgb(49,196,141)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  progressionChartReference = new Chart(progressionChart, {
  type: "bar",
  data: {
    labels: returnsArray.map(investimentObject => investimentObject.month),
    datasets: [{
      label: 'Total Investido',
      data: returnsArray.map(investimentObject => formatCurrency(investimentObject.investedAmount)) ,
      backgroundColor: "rgb(49,196,141)"
    }, {
      label: 'Retorno do Investimento',
      data: returnsArray.map(investimentObject => formatCurrency(investimentObject.interestReturns)),
      backgroundColor: "rgb(54, 162, 235)",
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        stack: true,
      },
      y: {
        stack: true,
      },
    },
  },
});
}

function isObjectEmpty (obj) {
  return Object.keys(obj).length === 0;
}

function resetCharts(){
  if(!isObjectEmpty(doughnutChartReference) && !isObjectEmpty(progressionChart)) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  form["tax-rate"].value = "";

  resetCharts();

  const errorInputContainers = document.querySelectorAll(".error");

  for (const errorInputContainer of errorInputContainers) {
    errorInputContainer.classList.remove("error");
    errorInputContainer.parentElement.querySelector("p").remove();
  }
}

function validateInput(evt) {
  if (evt.target.value === "") {
    return;
  }

  const parentElement = evt.target.parentElement;
  const grandParentElemnt = evt.target.parentElement.parentElement;
  const inputValue = evt.target.value.replace(",", ".");

  if (
    !parentElement.classList.contains("error") &&
    (isNaN(inputValue) || Number(inputValue) <= 0)
  ) {
    const errorTextElement = document.createElement("p");
    errorTextElement.classList.add("text-red-800");
    errorTextElement.innerHTML = "Insira um valor numérico ou maior que zero";

    parentElement.classList.add("error");
    grandParentElemnt.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElemnt.querySelector("p").remove();
  }
}

for (const formElemnt of form) {
  if (formElemnt.tagName === "INPUT" && formElemnt.hasAttribute("name")) {
    formElemnt.addEventListener("blur", validateInput);
  }
}

/* form.addEventListener("submit", renderProgression); */
clearFormButton.addEventListener("click", clearForm);
