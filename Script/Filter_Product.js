// Function to filter products by category, color, size every time the button filter is clicked we go to the product page with the query string of the filter
function filterProducts() {
    const category = document.getElementById('category').value;
    const color = document.getElementById('color').value;
    const size = document.getElementById('size').value;

    // Check if at least one filter value is provided
    if (category || color || size) {
        // Redirect to the product page with the query string of the filter
        const queryParams = [];
        if (category) queryParams.push(`category=${encodeURIComponent(category)}`);
        if (color) queryParams.push(`color=${encodeURIComponent(color)}`);
        if (size) queryParams.push(`size=${encodeURIComponent(size)}`);
        window.location.href = `ProductPage.html?${queryParams.join('&')}`;
    } else {
        alert('Please select at least one filter option.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('filter-button').addEventListener('click', filterProducts);
});
