// Function to filter products by category, color, size every time the button filter is clicked we go to the product page with the query string of the filter
function filterProducts() {
    const category = document.getElementById('category').value;
    const color = document.getElementById('color').value;
    const size = document.getElementById('size').value;

    // Check if at least one filter value is provided
    if (category || color || size) {
        // Prepare the query string of the filter
        const queryParams = [];
        if (category) queryParams.push(`category=${encodeURIComponent(category)}`);

        // Handle checkbox filters dynamically
        const categories = [];
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="category"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                categories.push(checkbox.value);
            }
        });
        if (categories.length > 0) queryParams.push(`category=${encodeURIComponent(categories.join(','))}`);

        if (color) queryParams.push(`color=${encodeURIComponent(color)}`);
        if (size) queryParams.push(`size=${encodeURIComponent(size)}`);
        const queryString = queryParams.join('&');

        // Make an AJAX request to the product page with the query string of the filter
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `ProductPage.html?${queryString}`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Update the product list with the response
                document.getElementById('product-list').innerHTML = xhr.responseText;
            }
        };
        xhr.send();
    } else {
        alert('Please select at least one filter option.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('filter-button').addEventListener('click', filterProducts);
});
