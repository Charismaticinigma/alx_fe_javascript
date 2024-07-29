// Set up mock API endpoint
const apiEndpoint = 'https://jsonplaceholder.typicode.com/posts';

// Function to fetch data from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data from server:', error);
    }
}

// Function to post data to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quote),
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error posting data to server:', error);
    }
}

// Set up periodic data fetching
setInterval(async () => {
    const data = await fetchQuotesFromServer();
    // Update local storage with fetched data
    updateLocalStorage(data);
}, 60000); // Fetch data every 1 minute

// Function to update local storage with fetched data
function updateLocalStorage(data) {
    // Get current local storage data
    const currentData = JSON.parse(localStorage.getItem('quotes'));

    // Merge fetched data with current local storage data
    const mergedData = [...currentData, ...data];

    // Remove duplicates
    const uniqueData = mergedData.filter((quote, index, self) => {
        return index === self.findIndex((q) => q.id === quote.id);
    });

    // Update local storage with merged data
    localStorage.setItem('quotes', JSON.stringify(uniqueData));
}

// Function to sync local data with server data
async function syncQuotes() {
    // Get current local storage data
    const currentData = JSON.parse(localStorage.getItem('quotes'));

    // Fetch data from server
    const serverData = await fetchQuotesFromServer();

    // Merge local data with server data
    const mergedData = [...currentData, ...serverData];

    // Remove duplicates
    const uniqueData = mergedData.filter((quote, index, self) => {
        return index === self.findIndex((q) => q.id === quote.id);
    });

    // Update local storage with merged data
    localStorage.setItem('quotes', JSON.stringify(uniqueData));

    // Display notification to the user
    alert('Quotes synced with server!');
}

// Set up periodic data syncing
setInterval(async () => {
    await syncQuotes();
}, 60000); // Sync data every 1 minute

// Initialize quotes array
let quotes = [];

// Function to add a quote
function addQuote() {
    // Retrieve the input values for the quote and author
    const quote = document.getElementById('newQuoteText').value.trim();
    const author = document.getElementById('newQuoteCategory').value.trim();

    // Check if both the quote and author fields are filled out
    if (quote && author) {
        // Create a JavaScript object to represent the quote
        const quoteObject = {
            quote,
            author,
        };

        // Convert the JavaScript object to a JSON string
        const quoteJSON = JSON.stringify(quoteObject);

        // Generate a unique key for the quote
        const quoteKey = `quote-${quotes.length}`;

        // Store the JSON string in local storage
        localStorage.setItem(quoteKey, quoteJSON);

        // Add the quote to the array of quotes
        quotes.push(quoteObject);