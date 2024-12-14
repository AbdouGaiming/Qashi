document.addEventListener('DOMContentLoaded', function () {
    loadProducts();

    document.getElementById('add-product-form').addEventListener('submit', function(event) {
        event.preventDefault();

        let valid = true;

        const productName = document.getElementById("product-name").value.trim();
        const description = document.getElementById("description").value.trim();
        const price = document.getElementById("price").value.trim();
        const variantColor = document.getElementById("variant-color").value.trim();
        const variantStockQuantity = document.getElementById("variant-stock-quantity").value.trim();

        const nameRegExp = /^[a-zA-Z0-9\s]+$/;
        const priceRegExp = /^\d+(\.\d{1,2})?$/;
        const colorRegExp = /^[a-zA-Z\s]+$/;
        const stockRegExp = /^\d+$/;

        if (!nameRegExp.test(productName)) {
            document.getElementById("I-product-name").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-product-name").style.display = "none";
        }

        if (description === "") {
            document.getElementById("I-description").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-description").style.display = "none";
        }

        if (!priceRegExp.test(price)) {
            document.getElementById("I-price").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-price").style.display = "none";
        }

        if (!colorRegExp.test(variantColor)) {
            document.getElementById("I-variant-color").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-variant-color").style.display = "none";
        }

        if (!stockRegExp.test(variantStockQuantity)) {
            document.getElementById("I-variant-stock-quantity").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-variant-stock-quantity").style.display = "none";
        }

        if (valid) {
            const productData = {
                name: productName,
                description: description,
                price: price,
                stock: variantStockQuantity,
                category: document.getElementById('category').value,
                sub_category: document.getElementById('sub-category').value,
                image_url: document.getElementById('image-url').value,
            };

            if (document.getElementById('add-product-submit').textContent === 'Add Product') {
                addProduct(productData);
            } else {
                productData.product_id = document.getElementById('product-id').value;
                updateProduct(productData);
            }
        }
    });
});

function loadProducts() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'Database/fetch_products.php', true);

    xhr.onload = function () {
        if (this.status === 200) {
            const products = JSON.parse(this.responseText);
            displayProducts(products);
        }
    };

    xhr.send();
}

function displayProducts(products) {
    const productsTableBody = document.querySelector('.products-table tbody');
    productsTableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.product_id}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.sub_category}</td>
            <td>
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
            </td>
        `;

        // Attach event listeners
        const editButton = row.querySelector('.edit-button');
        const deleteButton = row.querySelector('.delete-button');

        editButton.addEventListener('click', function () {
            editProduct(product);
        });

        deleteButton.addEventListener('click', function () {
            deleteProduct(product.product_id);
        });

        productsTableBody.appendChild(row);
    });
}

function addProduct(productData) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'Database/products.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (this.status === 200) {
            loadProducts();
        }
    };

    const params = new URLSearchParams(productData).toString();

    xhr.send(`action=add&${params}`);
}

function deleteProduct(productId) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'Database/products.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (this.status === 200) {
            loadProducts();
        }
    };

    xhr.send(`action=delete&product_id=${encodeURIComponent(productId)}`);
}

function editProduct(product) {
    // Populate form with product data
    document.getElementById('product-id').value = product.product_id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('description').value = product.description;
    document.getElementById('price').value = product.price;
    document.getElementById('stock').value = product.stock;
    document.getElementById('category').value = product.category;
    document.getElementById('sub-category').value = product.sub_category;
    document.getElementById('image-url').value = product.image_url;

    // Show form
    toggleAddProductForm();

    // Change submit event to update
    document.getElementById('add-product-submit').textContent = 'Update Product';
}

function updateProduct(productData) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'Database/products.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (this.status === 200) {
            loadProducts();
        }
    };

    const params = new URLSearchParams(productData).toString();

    xhr.send(`action=update&${params}`);
}

function toggleAddProductForm() {
    const form = document.getElementById('add-product-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    form.reset();
    document.getElementById('add-product-submit').textContent = 'Add Product';
}