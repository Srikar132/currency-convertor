document.addEventListener("DOMContentLoaded", () => {
    const dropList = document.querySelectorAll("form select");
    const apiKey = '0975dcfd1052bb535a4d3785';
    const fromCountry = document.querySelector('#from');
    const toCountry = document.querySelector('#to');
    const fromFlag = document.querySelector('#fromImg');
    const toFlag = document.querySelector('#toImg');
    const reverseBtn = document.querySelector('.exchange-icon');



    for (let i = 0; i < dropList.length; i++) {
        for (let currency_code in country_list) {
            let selected = i === 0 ? (currency_code === "USD" ? "selected" : "") : (currency_code === "INR" ? "selected" : "");
            let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
            dropList[i].insertAdjacentHTML("beforeend", optionTag);
        }
    }

    reverseBtn.addEventListener('click',event => {
        let tempCode = fromCountry.value;
        fromCountry.value = toCountry.value;
        toCountry.value = tempCode;
        updateFlag();
        getExchangeRate();
    });

    fromCountry.addEventListener('change', () => {
        updateFlag();
        getExchangeRate();
    });
    toCountry.addEventListener('change', () => {
        updateFlag();
        getExchangeRate();
    });

    function updateFlag() {
        if (fromCountry.value in country_list) {
            fromFlag.src = `https://flagsapi.com/${country_list[fromCountry.value]}/flat/64.png`;
        } else {
            fromFlag.src = '';
        }

        if (toCountry.value in country_list) {
            toFlag.src = `https://flagsapi.com/${country_list[toCountry.value]}/flat/64.png`;
        } else {
            toFlag.src = '';
        }
    }

    updateFlag();



    document.querySelector('form button').addEventListener('click', event => {
        event.preventDefault();
        getExchangeRate();
    });

    function getExchangeRate() {
        let amount = document.querySelector('form input').value;
        let amountDisplay = document.querySelector('.amountDisplay');

        if (!amount || amount <= 0) {
            amountDisplay.textContent = 'Please enter an valid amount!';
            return;
        }

        amountDisplay.textContent = 'Getting exchange rate...';
        let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCountry.value}`;

        fetch(url).then(response => response.json()).then(result => {
            let exchangeRate = result.conversion_rates[toCountry.value];
            let totalRate = (amount * exchangeRate).toFixed(2);
            amountDisplay.textContent = `${amount} ${fromCountry.value} = ${totalRate} ${toCountry.value}`;
        }).catch(() => {
            amountDisplay.textContent = 'Something went wrong';
        });
    }
});
