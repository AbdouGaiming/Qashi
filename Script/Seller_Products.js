document.addEventListener('DOMContentLoaded', function () {
    loadProducts();

    document.getElementById('product-form').addEventListener('submit', function(event) {
        event.preventDefault();

        let valid = true;

        const productId = document.getElementById("product-id").value;
        const productName = document.getElementById("product-name").value.trim();
        const description = document.getElementById("description").value.trim();
        const price = document.getElementById("price").value.trim();
        const category = document.getElementById("category").value;
        const subCategory = document.getElementById("sub-category").value;
        const imageFile = document.getElementById("image-file").files[0];

        // Variant inputs
        const variantColors = document.querySelectorAll('.variant-color');
        const variantSizes = document.querySelectorAll('.variant-size');
        const variantStockQuantities = document.querySelectorAll('.variant-stock-quantity');

        // Define regex patterns
        const nameRegExp = /^[a-zA-Z0-9\s]+$/;
        const priceRegExp = /^\d+(\.\d{1,2})?$/;
        const stockRegExp = /^\d+$/;
        const imageFileRegExp = /\.(jpg|jpeg|png|gif|svg)$/i;

        // Validate Product Name
        if (!nameRegExp.test(productName)) {
            document.getElementById("I-product-name").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-product-name").style.display = "none";
        }

        // Validate Description
        if (description === "") {
            document.getElementById("I-description").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-description").style.display = "none";
        }

        // Validate Price
        if (!priceRegExp.test(price)) {
            document.getElementById("I-price").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-price").style.display = "none";
        }

        // Validate Category
        if (category === "") {
            document.getElementById("I-category").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-category").style.display = "none";
        }

        // Validate Sub Category
        if (subCategory === "") {
            document.getElementById("I-sub-category").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-sub-category").style.display = "none";
        }

        // Validate Variants
        variantColors.forEach((colorInput, index) => {
            const sizeInput = variantSizes[index];
            const stockInput = variantStockQuantities[index];

            if (colorInput.value.trim() === "") {
                document.getElementById("I-variant-color").style.display = "block";
                valid = false;
            } else {
                document.getElementById("I-variant-color").style.display = "none";
            }

            if (sizeInput.value.trim() === "") {
                document.getElementById("I-variant-size").style.display = "block";
                valid = false;
            } else {
                document.getElementById("I-variant-size").style.display = "none";
            }

            if (!stockRegExp.test(stockInput.value.trim())) {
                document.getElementById("I-variant-stock-quantity").style.display = "block";
                valid = false;
            } else {
                document.getElementById("I-variant-stock-quantity").style.display = "none";
            }
        });

        // Validate Image File
        if (!productId && !imageFile) {
            document.getElementById("I-image-file").style.display = "block";
            valid = false;
        } else if (imageFile && !imageFileRegExp.test(imageFile.name)) {
            document.getElementById("I-image-file").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-image-file").style.display = "none";
        }

        if (valid) {
            const formData = new FormData();
            formData.append('action', productId ? 'update' : 'add');
            if (productId) {
                formData.append('product_id', productId);
            }
            formData.append('name', productName);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('sub_category', subCategory);
            if (imageFile) {
                formData.append('image_file', imageFile);
            }

            // Collect variants
            const variants = [];
            variantColors.forEach((colorInput, index) => {
                variants.push({
                    color: colorInput.value.trim(),
                    size: variantSizes[index].value.trim(),
                    stock_quantity: variantStockQuantities[index].value.trim()
                });
            });
            formData.append('variants', JSON.stringify(variants));

            addOrUpdateProduct(formData);
        }
    });

    // Handle dynamic variant removal
    document.getElementById('variants-container').addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-variant-button')) {
            e.target.parentElement.remove();
        }
    });
});

function loadProducts() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'Database/Seller_Products.php', true);

    xhr.onload = function () {
        if (this.status === 200) {
            try {
                const products = JSON.parse(this.responseText);
                displayProducts(products);
            } catch (error) {
                console.error("Error parsing JSON:", error.message);
            }
        } else {
            console.error(`Failed to load products. Status: ${this.status}`);
        }
    };

    xhr.send();
}

function displayProducts(products) {
    const productsTableBody = document.querySelector('.products-table tbody');
    productsTableBody.innerHTML = '';

    products.forEach(product => {
        product.variants.forEach(variant => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.product_id}</td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>$${parseFloat(product.price).toFixed(2)}</td>
                <td>${variant.stock_quantity}</td>
                <td>${capitalizeFirstLetter(product.category)}</td>
                <td>${capitalizeFirstLetter(product.sub_category)}</td>
                <td>${variant.color}</td>
                <td>${variant.size}</td>
                <td>${variant.stock_quantity}</td>
                <td><img src="${product.image_url}" alt="Product Image" width="50"/></td>
                <td>
                    <button class="edit-button" data-id="${product.product_id}" data-variant-id="${variant.variant_id}">Edit</button>
                    <button class="delete-button" data-id="${product.product_id}" data-variant-id="${variant.variant_id}">Delete</button>
                </td>
            `;

            // Attach event listeners for Edit and Delete buttons
            const editButton = row.querySelector('.edit-button');
            const deleteButton = row.querySelector('.delete-button');

            editButton.addEventListener('click', function () {
                editProduct(product, variant);
            });

            deleteButton.addEventListener('click', function () {
                Swal.fire({
                    title: `Delete Variant ID ${variant.variant_id}?`,
                    text: "Are you sure you want to delete this variant?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "Cancel",
                }).then((result) => {
                    if (result.isConfirmed) {
                        deleteVariant(product.product_id, variant.variant_id);
                    }
                });
            });

            productsTableBody.appendChild(row);
        });
    });
}

function addOrUpdateProduct(formData) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'Database/Seller_Products.php', true);

    xhr.onload = function () {
        if (this.status === 200) {
            try {
                const response = JSON.parse(this.responseText);
                if (response.success) {
                    Swal.fire({
                        title: "Success!",
                        text: response.success,
                        icon: "success",
                        confirmButtonText: "Okay",
                    }).then(() => {
                        loadProducts();
                        toggleAddProductForm();
                        document.getElementById('product-form').reset();
                        // Reset variants
                        document.getElementById('variants-container').innerHTML = `
                            <div class="variant">
                                <label for="variant-color">Color</label>
                                <input type="text" class="variant-color" name="variant_color[]" required>
                                <label id="I-variant-color" style="display:none; color:red;">Please enter a valid color.</label>

                                <label for="variant-size">Size</label>
                                <input type="text" class="variant-size" name="variant_size[]" required>
                                <label id="I-variant-size" style="display:none; color:red;">Please enter a valid size.</label>

                                <label for="variant-stock-quantity">Stock Quantity</label>
                                <input type="text" class="variant-stock-quantity" name="variant_stock_quantity[]" required>
                                <label id="I-variant-stock-quantity" style="display:none; color:red;">Please enter a valid stock quantity.</label>

                                <button type="button" class="remove-variant-button">Remove Variant</button>
                            </div>
                        `;
                    });
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: response.error,
                        icon: "error",
                        confirmButtonText: "Okay",
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to parse server response.",
                    icon: "error",
                    confirmButtonText: "Okay",
                });
            }
        } else {
            Swal.fire({
                title: "Error!",
                text: `Server error. Status: ${this.status}`,
                icon: "error",
                confirmButtonText: "Okay",
            });
        }
    };

    xhr.onerror = function () {
        Swal.fire({
            title: "Error!",
            text: "Network error. Please try again.",
            icon: "error",
            confirmButtonText: "Okay",
        });
    };

    xhr.send(formData);
}

function deleteVariant(productId, variantId) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'Database/Seller_Products.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (this.status === 200) {
            try {
                const response = JSON.parse(this.responseText);
                if (response.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: response.success,
                        icon: "success",
                        confirmButtonText: "Okay",
                    }).then(() => {
                        loadProducts();
                    });
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: response.error,
                        icon: "error",
                        confirmButtonText: "Okay",
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to parse server response.",
                    icon: "error",
                    confirmButtonText: "Okay",
                });
            }
        } else {
            Swal.fire({
                title: "Error!",
                text: `Server error. Status: ${this.status}`,
                icon: "error",
                confirmButtonText: "Okay",
            });
        }
    };

    xhr.onerror = function () {
        Swal.fire({
            title: "Error!",
            text: "Network error. Please try again.",
            icon: "error",
            confirmButtonText: "Okay",
        });
    };

    const params = new URLSearchParams({
        action: 'delete_variant',
        product_id: productId,
        variant_id: variantId
    }).toString();

    xhr.send(params);
}

function editProduct(product, variant) {
    // Populate form with product data
    document.getElementById('product-id').value = product.product_id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('description').value = product.description;
    document.getElementById('price').value = product.price;
    document.getElementById('category').value = product.category;
    document.getElementById('sub-category').value = product.sub_category;

    // Remove existing variants
    document.getElementById('variants-container').innerHTML = '';

    // Add the variant to be edited
    const variantsContainer = document.getElementById('variants-container');
    const variantDiv = document.createElement('div');
    variantDiv.classList.add('variant');
    variantDiv.innerHTML = `
        <label for="variant-color">Color</label>
        <input type="text" class="variant-color" name="variant_color[]" value="${variant.color}" required>
        <label id="I-variant-color" style="display:none; color:red;">Please enter a valid color.</label>

        <label for="variant-size">Size</label>
        <input type="text" class="variant-size" name="variant_size[]" value="${variant.size}" required>
        <label id="I-variant-size" style="display:none; color:red;">Please enter a valid size.</label>

        <label for="variant-stock-quantity">Stock Quantity</label>
        <input type="text" class="variant-stock-quantity" name="variant_stock_quantity[]" value="${variant.stock_quantity}" required>
        <label id="I-variant-stock-quantity" style="display:none; color:red;">Please enter a valid stock quantity.</label>

        <button type="button" class="remove-variant-button">Remove Variant</button>
    `;
    variantsContainer.appendChild(variantDiv);

    // Change form title and submit button
    document.getElementById('form-title').textContent = 'Update Product';
    document.getElementById('submit-button').textContent = 'Update Product';

    // Show the form
    toggleAddProductForm();
}

function addVariant() {
    const variantsContainer = document.getElementById('variants-container');
    const variantHTML = `
        <div class="variant">
            <label for="variant-color">Color</label>
            <input type="text" class="variant-color" name="variant_color[]" required>
            <label id="I-variant-color" style="display:none; color:red;">Please enter a valid color.</label>

            <label for="variant-size">Size</label>
            <input type="text" class="variant-size" name="variant_size[]" required>
            <label id="I-variant-size" style="display:none; color:red;">Please enter a valid size.</label>

            <label for="variant-stock-quantity">Stock Quantity</label>
            <input type="text" class="variant-stock-quantity" name="variant_stock_quantity[]" required>
            <label id="I-variant-stock-quantity" style="display:none; color:red;">Please enter a valid stock quantity.</label>

            <button type="button" class="remove-variant-button">Remove Variant</button>
        </div>
    `;
    variantsContainer.insertAdjacentHTML('beforeend', variantHTML);
}

function toggleAddProductForm() {
    const formContainer = document.getElementById('add-product-form-container');
    const form = document.getElementById('product-form');

    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block';
        form.reset();
        // Reset variants
        document.getElementById('variants-container').innerHTML = `
            <div class="variant">
                <label for="variant-color">Color</label>
                <input type="text" class="variant-color" name="variant_color[]" required>
                <label id="I-variant-color" style="display:none; color:red;">Please enter a valid color.</label>

                <label for="variant-size">Size</label>
                <input type="text" class="variant-size" name="variant_size[]" required>
                <label id="I-variant-size" style="display:none; color:red;">Please enter a valid size.</label>

                <label for="variant-stock-quantity">Stock Quantity</label>
                <input type="text" class="variant-stock-quantity" name="variant_stock_quantity[]" required>
                <label id="I-variant-stock-quantity" style="display:none; color:red;">Please enter a valid stock quantity.</label>

                <button type="button" class="remove-variant-button">Remove Variant</button>
            </div>
        `;
    } else {
        formContainer.style.display = 'none';
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}