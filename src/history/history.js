// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Get the container element where we'll append our history items
    const historyContainer = document.getElementById('historyContainer');

    // Retrieve the alias history from Chrome's storage
    chrome.storage.sync.get(['aliasHistory'], function(result) {
        // If there's no history, use an empty array
        const history = result.aliasHistory || [];
        
        // Group the history items by date
        const groupedHistory = groupByDate(history);

        // Iterate over each date group in the grouped history
        for (const [date, aliases] of Object.entries(groupedHistory)) {
            // Create a container for each date group
            const dateGroup = document.createElement('div');
            dateGroup.className = 'date-group';

            // Create and append the date header
            const dateHeader = document.createElement('div');
            dateHeader.className = 'date-header';
            dateHeader.textContent = new Date(date).toLocaleDateString();
            dateGroup.appendChild(dateHeader);

            // Iterate over each alias in the current date group
            aliases.forEach(item => {
                // Create a container for each alias item
                const aliasItem = document.createElement('div');
                aliasItem.className = 'alias-item';

                // Create and append the alias text
                const aliasText = document.createElement('span');
                aliasText.textContent = item.alias;
                aliasItem.appendChild(aliasText);

                // Create and append the copy button
                const copyButton = document.createElement('button');
                copyButton.className = 'copy-btn';
                copyButton.textContent = 'Copy';
                copyButton.onclick = function() {
                    // Copy the alias to clipboard when button is clicked
                    navigator.clipboard.writeText(item.alias).then(() => {
                        // Change button text to indicate successful copy
                        copyButton.textContent = 'Copied!';
                        // Reset button text after 2 seconds
                        setTimeout(() => {
                            copyButton.textContent = 'Copy';
                        }, 2000);
                    });
                };
                aliasItem.appendChild(copyButton);

                // Append the alias item to the date group
                dateGroup.appendChild(aliasItem);
            });

            // Append the entire date group to the history container
            historyContainer.appendChild(dateGroup);
        }
    });
});

// Function to group history items by date
function groupByDate(history) {
    const grouped = {};
    history.forEach(item => {
        // Convert the ISO date string to a Date object and then to a date string
        const date = new Date(item.date).toDateString();
        // If this date doesn't exist in the grouped object yet, create an empty array for it
        if (!grouped[date]) {
            grouped[date] = [];
        }
        // Add the current item to the array for this date
        grouped[date].push(item);
    });
    return grouped;
}