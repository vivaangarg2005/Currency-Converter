const fromSelect = document.getElementById("From");
const toSelect = document.getElementById("To");
const button = document.getElementById("get");
const result = document.getElementById("result");

async function populateCurrencyOptions() {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await response.json();

    if (data.result === "success") {
      const currencies = Object.keys(data.rates);

      currencies.forEach(code => {
        const option1 = document.createElement("option");
        option1.value = code;
        option1.textContent = code;
        fromSelect.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = code;
        option2.textContent = code;
        toSelect.appendChild(option2);
      });

      fromSelect.value = "USD";
      toSelect.value = "INR";
    } else {
      result.innerText = "Failed to load currency list.";
    }
  } catch (error) {
    result.innerText = "Error loading currencies.";
    console.error(error);
  }
}

async function convert() {
  const amount = parseFloat(document.getElementById("Amount").value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(amount) || amount <= 0) {
    result.innerText = "Please enter a valid, positive amount.";
    return;
  }

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await response.json();

    if (data.result === "success" && data.rates[to]) {
      const rate = data.rates[to];
      const converted = amount * rate;
      result.innerText = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
    } else {
      result.innerText = "Conversion failed or currency not supported.";
    }
  } catch (error) {
    result.innerText = "Error fetching exchange rate.";
    console.error(error);
  }
}

populateCurrencyOptions();
button.addEventListener("click", convert);
