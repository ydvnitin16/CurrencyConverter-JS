const BASE_URL =
"https://v6.exchangerate-api.com/v6/27f69f95527ed36500d35e9e/latest";
let dropDowns = document.querySelectorAll(".dropdowns select");
let btn = document.querySelector('.btn');
let fromCurr = document.querySelector(".from select");
let toCurr = document.querySelector(".to select");
let msg = document.querySelector('.msg');

for (let select of dropDowns) {
    for (currCode in countryList) {
        let newOptions = document.createElement("option");
        newOptions.innerText = currCode;
        newOptions.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOptions.selected = true;
        }
        else if (select.name === "to" && currCode === "INR") {
            newOptions.selected = true;
        }
        select.append(newOptions);

    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
};

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amountVal = amount.value;
    if (amountVal === "" || amountVal < 1) {
        amountVal = 1;
        amount.value = "1"
    }
    const URL = `${BASE_URL}/${fromCurr.value}`;

    try {
        let response = await fetch(URL);
        let data = await response.json();
        console.log(data); // Check the full response to ensure data structure

        if (data.result === "success") {
            let rate = data.conversion_rates[toCurr.value]; // Get the conversion rate for the 'to' currency
            if (rate) { // Ensure rate exists before multiplying
                let finalAmount = rate * amountVal;
                msg.innerText = `${amountVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
            } else {
                msg.innerText = `Exchange rate for ${toCurr.value} not available.`;
            }
        } else {
            msg.innerText = "Error fetching exchange rate. Please try again.";
        }
    } catch (error) {
        msg.innerText = "Error: Unable to fetch data. Check your connection.";
    }
};



const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});;