function convertToMonthlyReturnRate(yearlyReturnRate) {
  return yearlyReturnRate ** (1 / 12);
}

function generateReturnsArray(
  startingAmmount = 0,
  timeHorizon = 0,
  timePeriod = "monthly",
  monthlyContribution = 0,
  returnRate = 0,
  returnTimeFrame = "monthly"
) {
  if (!timeHorizon || !startingAmmount) {
    throw new Error(
      " Investimento inicial e prazo devem ser preenchidos com valores positivos."
    );
  }

  const finalReturnRate =
    returnTimeFrame === "monthly"
      ? 1 + returnRate / 100
      : convertToMonthlyReturnRate(1 + returnRate / 100);

  const finalTimeHorizon =
    timePeriod === "monthly" ? timeHorizon : timeHorizon * 12;

  const referenceIncvestmentObject = {
    investedAmount: startingAmmount,
    interestReturns: 0,
    totalInterestReturns: 0,
    month: 0,
    totalAmount: startingAmmount,
  };

  const returnsArray = [referenceIncvestmentObject];
  for (
    let timeReference = 1;
    timeReference <= finalTimeHorizon;
    timeReference++
  ) {
    const totalAmount =
      returnsArray[timeReference - 1].totalAmount * finalReturnRate +
      monthlyContribution;

    const interestReturns =
      returnsArray[timeReference - 1].totalAmount * finalReturnRate;

    const investedAmount =
      startingAmmount + monthlyContribution * timeReference;

    const totalInterestReturns = totalAmount - investedAmount;

    returnsArray.push({
      investedAmount,
      interestReturns,
      totalInterestReturns,
      month: timeReference,
      totalAmount,
    });
  }

  return returnsArray;
}
