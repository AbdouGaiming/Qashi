document.addEventListener("DOMContentLoaded", function () {
    const productContainer = document.querySelector(".product-container");
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
        fetchProductDetails(productId);
    }

    function fetchProductDetails(id) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `Database/fetch_product_details.php?id=${id}`, true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        renderProductDetails(response.product);
                    } else {
                        productContainer.innerHTML = `<p>Product not found.</p>`;
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error.message);
                    productContainer.innerHTML = `<p>Failed to load product details. Please try again later.</p>`;
                }
            } else {
                productContainer.innerHTML = `<p>Server error. Status: ${xhr.status}</p>`;
            }
        };

        xhr.onerror = function () {
            productContainer.innerHTML = `<p>Network error. Please check your connection.</p>`;
        };

        xhr.send();
    }

    function renderProductDetails(product) {
        productContainer.innerHTML = `
            <div class="img-card">
                <img src="${product.image_url}" alt="${product.name}" id="featured-image" />
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <h5>Price: $${product.price}</h5>
                <p>${product.description}</p>
                <div class="sizes">
                        <p><strong>Available Sizes:</strong></p>
                        <select id="size-select">
                            ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join("")}
                        </select>
                </div>
                <div class="colors">
                        <p><strong>Available Colors:</strong></p>
                        ${product.colors.map((color, index) => `
                            <div class="color-select">
                                <label for="color-${index}">Color ${index + 1}:</label>
                                <select id="color-${index}" name="color-${index}">
                                    <option value="${color}">${color}</option>
                                </select>
                            </div>
                        `).join("")}    
                    </div>

                <div class="quantity">
                    <input type="number" value="1" min="1" />
                    <button>Add to Cart</button>
                </div>
            </div>
        `;
    }
});
