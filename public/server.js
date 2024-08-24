document.addEventListener('DOMContentLoaded', async function() {
    let companies = [];

    // Fetch the companies data from the JSON file
    async function fetchCompanies() {
        try {
            const response = await fetch('companies.json');
            const data = await response.json();
            companies = data;
            console.log('Companies data fetched successfully:', companies);
        } catch (error) {
            console.error('Error fetching companies data:', error);
        }
    }

    await fetchCompanies();

    const tickerInput = document.getElementById('tickerInput');
    const suggestionsList = document.getElementById('suggestions');
    const tickerForm = document.getElementById('tickerForm');
    const options = document.querySelectorAll('.option');

    if (!tickerInput || !suggestionsList || !tickerForm || options.length === 0) {
        console.error('One or more elements not found:', {
            tickerInput,
            suggestionsList,
            tickerForm,
            options
        });
        return;
    }

    console.log('Elements found:', {
        tickerInput,
        suggestionsList,
        tickerForm,
        options
    });

    // Initialize the visual state of the checkboxes
    function initializeCheckboxes() {
        options.forEach(option => {
            const checkbox = option.querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }

    initializeCheckboxes();

    // Input event on ticker input
    tickerInput.addEventListener('input', function() {
        console.log('Input event triggered');
        const input = this.value.toLowerCase();
        const suggestions = companies.filter(company => company.Name.toLowerCase().includes(input));
        suggestionsList.innerHTML = '';
        if (input) {
            suggestionsList.classList.add('active');
        } else {
            suggestionsList.classList.remove('active');
        }
        suggestions.forEach(company => {
            const li = document.createElement('li');
            li.textContent = `${company.Name} (${company.Ticker})`;
            li.addEventListener('click', function() {
                tickerInput.value = company.Ticker;
                suggestionsList.innerHTML = '';
                suggestionsList.classList.remove('active');
            });
            suggestionsList.appendChild(li);
        });
    });

    // Blur event on ticker input
    tickerInput.addEventListener('blur', function() {
        console.log('Blur event triggered');
        setTimeout(() => {
            suggestionsList.innerHTML = '';
            suggestionsList.classList.remove('active');
        }, 100); // Delay to allow click event to register
    });

    // Focus event on ticker input
    tickerInput.addEventListener('focus', function() {
        console.log('Focus event triggered');
        const input = this.value.toLowerCase();
        const suggestions = companies.filter(company => company.Name.toLowerCase().includes(input));
        suggestionsList.innerHTML = '';
        if (input) {
            suggestionsList.classList.add('active');
        } else {
            suggestionsList.classList.remove('active');
        }
        suggestions.forEach(company => {
            const li = document.createElement('li');
            li.textContent = `${company.Name} (${company.Ticker})`;
            li.addEventListener('click', function() {
                tickerInput.value = company.Ticker;
                suggestionsList.innerHTML = '';
                suggestionsList.classList.remove('active');
            });
            suggestionsList.appendChild(li);
        });
    });

    // Submit event on form
    tickerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Submit event triggered');
        const ticker = tickerInput.value.trim().toUpperCase();
        const company = companies.find(company => company.Ticker === ticker);

        // Get preferences
        const yahooChecked = document.getElementById('yahoo').checked;
        const finvizChecked = document.getElementById('finviz').checked;
        const twitterChecked = document.getElementById('twitter').checked;
        const googlenewsChecked = document.getElementById('googlenews').checked;
        const seekingalphaChecked = document.getElementById('seekingalpha').checked;
        const cnbcChecked = document.getElementById('cnbc').checked;
        const investorRelationsChecked = document.getElementById('investorRelations').checked;
        const careersChecked = document.getElementById('careers').checked;

        // List of URLs based on preferences
        const urls = [];
        if (yahooChecked) urls.push(`https://finance.yahoo.com/quote/${ticker}`);
        if (finvizChecked) urls.push(`https://finviz.com/quote.ashx?t=${ticker}`);
        if (twitterChecked) urls.push(`https://twitter.com/search?q=%24${ticker}`);
        if (googlenewsChecked) urls.push(`https://www.google.com/search?tbm=nws&q=${ticker}`);
        if (seekingalphaChecked) urls.push(`https://seekingalpha.com/symbol/${ticker}`);
        if (cnbcChecked) urls.push(`https://www.cnbc.com/quotes/${ticker}`);
        if (investorRelationsChecked) urls.push(`https://www.google.com/search?q=${ticker}+investor+relations`);
        if (careersChecked && company) {
            const companyName = company.Name;
            urls.push(`https://www.google.com/search?q=${companyName}+careers`);
        }

        // Open selected URLs in new tabs
        urls.forEach(url => {
            window.open(url, '_blank');
        });
    });

    // Click event on options
    options.forEach(option => {
        option.addEventListener('click', function() {
            console.log('Option click event triggered');
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('selected', checkbox.checked);
        });
    });

    console.log('Event listeners attached successfully');
});