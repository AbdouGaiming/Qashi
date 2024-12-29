document.addEventListener('DOMContentLoaded', function () {
    loadCartItems(); // Load the cart items when the page loads
    loadProducts();

    document.getElementById('searchbtn').addEventListener('click', function () {
        const searchTerm = document.querySelector('.search-input').value;
        searchProducts(searchTerm);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    loadCartItems(); // Load the cart items when the page loads
});

// Function to load cart items
function loadCartItems() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'Database/fetch_cart_items.php', true);

    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            try {
                const data = JSON.parse(xhr.responseText);
                const cartDropdown = document.getElementById('cartDropdown');
                cartDropdown.innerHTML = '<p style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Cart Items:</p>';

                if (data.length === 0) {
                    cartDropdown.innerHTML += '<p>No items in cart.</p>';
                } else {
                    let total = 0;
                    data.forEach(item => {
                        const cartItem = document.createElement('div');
                        cartItem.className = 'cart-item';

                        const img = document.createElement('img');
                        img.src = item.image_url; // Ensure the backend returns a valid image URL
                        img.alt = item.name;

                        const details = document.createElement('div');
                        details.className = 'cart-item-details';

                        const name = document.createElement('p');
                        name.textContent = item.name;
                        name.className = 'cart-item-name';

                        const price = document.createElement('p');
                        const itemTotal = item.price * item.quantity;
                        price.textContent = `$${itemTotal.toFixed(2)}`;
                        price.className = 'cart-item-price';

                        details.appendChild(name);
                        details.appendChild(price);

                        const controls = document.createElement('div');
                        controls.className = 'cart-item-controls';

                        const decreaseButton = document.createElement('button');
                        decreaseButton.textContent = '-';
                        decreaseButton.className = 'qty-btn';
                        decreaseButton.onclick = function () {
                            decreaseCartItem(item.id);
                        };

                        const quantity = document.createElement('span');
                        quantity.textContent = item.quantity;
                        quantity.className = 'qty-display';

                        const increaseButton = document.createElement('button');
                        increaseButton.textContent = '+';
                        increaseButton.className = 'qty-btn';
                        increaseButton.onclick = function () {
                            increaseCartItem(item.id);
                        };

                        controls.appendChild(decreaseButton);
                        controls.appendChild(quantity);
                        controls.appendChild(increaseButton);

                        cartItem.appendChild(img);
                        cartItem.appendChild(details);
                        cartItem.appendChild(controls);

                        cartDropdown.appendChild(cartItem);

                        // Add to total
                        total += itemTotal;
                    });

                    // Add total at the end
                    const totalElement = document.createElement('div');
                    totalElement.className = 'cart-total';
                    totalElement.innerHTML = `<p>Total: <span class="price" style="color: black; font-weight: bold;">$${total.toFixed(2)}</span></p>`;
                    cartDropdown.appendChild(totalElement);

                    // Add the "Go to Checkout" button
                    const checkoutButton = document.createElement('button');
                    checkoutButton.className = 'checkout-button';
                    checkoutButton.id = 'cart-button';
                    checkoutButton.textContent = 'Go to Checkout';
                    checkoutButton.onclick = function () {
                        window.location.href = 'CheckOut.html';
                    };
                    cartDropdown.appendChild(checkoutButton);
                }
            } catch (error) {
                console.error('Error parsing cart data:', error);
            }
        } else {
            console.error('Error loading cart items:', xhr.status);
        }
    };

    xhr.onerror = function () {
        console.error('An error occurred while loading the cart.');
    };

    xhr.send();
}



// Function to add product to cart
function addToCart(productId, quantity, size, color) {
    const params = new URLSearchParams({
        product_id: productId,
        quantity: quantity,
        size: size,
        color: color
    });

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `Database/add_to_cart.php?${params.toString()}`, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // Refresh the cart after successful addition
                    loadCartItems();
                } else {
                    console.error('Error adding to cart:', response.message);
                }
            } catch (error) {
                console.error('Error parsing add-to-cart response:', error);
            }
        } else {
            console.error('Failed to add to cart. Status:', xhr.status);
        }
    };

    xhr.onerror = function () {
        console.error('An error occurred while adding to the cart.');
    };

    xhr.send();
}


// Function to decrease cart item quantity
function decreaseCartItem(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'Database/decrease_cart_item.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            console.log('Raw Response:', xhr.responseText); // Debugging output
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // Refresh the cart after successful decrease
                    loadCartItems();
                } else {
                    console.error('Error decreasing cart item:', response.message);
                }
            } catch (error) {
                console.error('Error parsing decrease response:', error, xhr.responseText);
            }
        } else {
            console.error('Failed to decrease cart item. Status:', xhr.status);
        }
    };

    xhr.onerror = function () {
        console.error('An error occurred while decreasing the cart item.');
    };

    xhr.send(`id=${encodeURIComponent(id)}`);
}


// Function to increase cart item quantity
function increaseCartItem(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'Database/increase_cart_item.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            try {
                console.log(xhr.responseText);
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // Refresh the cart after successful increase
                    loadCartItems();
                } else {
                    console.error('Error increasing cart item:', response.message);
                }
            } catch (error) {
                console.error('Error parsing increase response:', error);
            }
        } else {
            console.error('Failed to increase cart item. Status:', xhr.status);
        }
    };

    xhr.onerror = function () {
        console.error('An error occurred while increasing the cart item.');
    };

    xhr.send(`id=${encodeURIComponent(id)}`);
}



function loadProducts() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'Database/fetch_products.php', true);

    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            const data = JSON.parse(xhr.responseText);
            displayProducts(data);
        } else {
            console.error('Error loading products.');
        }
    };

    xhr.send();
}

function searchProducts(query) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `Database/search_products.php?query=${encodeURIComponent(query)}`, true);

    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            const data = JSON.parse(xhr.responseText);
            displayProducts(data);
        } else {
            console.error('Error searching products.');
        }
    };

    xhr.send();
}

function displayProducts(products) {
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = '';


    if (products.length > 0) {
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
          <img src='${product.image_url}' alt='${product.name}' class='product-img' />
          <h2 class='product-name'>${product.name}</h2>
          <p class='product-price'>$${product.price}</p>
          <button onclick="window.location.href='ProductPage.html?id=${product.product_id}';">View Product</button>
        `;
            productContainer.appendChild(productDiv);
        });
    } else {
        productContainer.innerHTML = '<p>No results found.</p>';
    }
}


let backButtonContainer = null; // Track the back button container

document.addEventListener("DOMContentLoaded", function () {
    const filterForm = document.querySelector("#filterForm");
    const productContainer = document.getElementById("productContainer");

    filterForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Collect filter values
        const category = document.querySelector('input[name="category"]:checked')?.value || "";
        const subcategory = document.querySelector('input[name="subcategory"]:checked')?.value || "";
        const color = document.getElementById("color").value.trim();
        const size = document.getElementById("size").value.trim();

        // Build query parameters
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (subcategory) params.append("subcategory", subcategory);
        if (color) params.append("color", color);
        if (size) params.append("size", size);

        console.log("Filter Parameters:", params.toString());

        // Send AJAX GET request
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `Database/fetch_products_by_category.php?${params.toString()}`, true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);

                    if (response.success && response.products.length > 0) {
                        // Display products
                        displayProducts(response.products);

                        // Add back button only once
                        if (!backButtonContainer) {
                            backButtonContainer = document.createElement("div");
                            backButtonContainer.className = "back-button-container";

                            const backButton = document.createElement("button");
                            backButton.textContent = "Show All Products";
                            backButton.className = "modern-back-button";
                            backButton.onclick = function () {
                                loadProducts(); // Function to load all products
                                clearFilters(); // Function to clear all filters                                
                                backButtonContainer.remove(); // Remove the back button
                                backButtonContainer = null; // Reset the reference
                            };

                            backButtonContainer.appendChild(backButton);
                            productContainer.parentNode.insertBefore(backButtonContainer, productContainer);
                        }
                    } else {
                        productContainer.innerHTML = "<p>No products found matching your filters.</p>";
                    }
                } catch (error) {
                    console.error("Error Parsing JSON:", error.message);
                    productContainer.innerHTML = "<p>Error loading products. Please try again later.</p>";
                }
            } else {
                console.error("Server Error. Status:", xhr.status);
                productContainer.innerHTML = "<p>Failed to fetch products. Please try again later.</p>";
            }
        };

        xhr.onerror = function () {
            console.error("Network Error during AJAX request.");
            productContainer.innerHTML = "<p>Network error. Please check your connection and try again.</p>";
        };

        xhr.send();
    });

    function clearFilters() {
        // Reset all form inputs
        filterForm.reset();
        const checkedRadios = document.querySelectorAll('input[name="category"]:checked, input[name="subcategory"]:checked');
        checkedRadios.forEach(radio => radio.checked = false);
        document.getElementById("color").value = "";
        document.getElementById("size").value = "";
        console.log("Filters cleared");
    }
});

// Ensure JavaScript runs after the page is fully loaded
window.onload = function () {
    document.querySelectorAll('.category').forEach(category => {
        const link = category.querySelector('a');
        const dropdown = category.querySelector('.dropdown');

        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link action
            e.stopPropagation(); // Stop the click event from bubbling up to the document

            // Hide all dropdowns except the one clicked
            document.querySelectorAll('.dropdown').forEach(d => {
                if (d !== dropdown) {
                    d.style.display = 'none';
                }
            });

            // Toggle the current dropdown's visibility
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Close dropdowns when clicking outside of a category
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.category')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });
};

