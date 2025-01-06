document.addEventListener('DOMContentLoaded', function () {
    const productId = getProductIdFromURL();
    if (productId) {
        loadProductInfo(productId);
        loadVariants(productId);
    }

    document.querySelector('.add-variant-button').addEventListener('click', () => {
        toggleVariantForm();
    });

    document.getElementById('variant-form').addEventListener('submit', function(event) {
        event.preventDefault();
        handleVariantFormSubmit(productId);
    });
});

function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('product_id');
}

function loadProductInfo(productId) {
    fetch(`Database/Seller_Products.php?action=get_product&product_id=${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Swal.fire({
                    title: "Error!",
                    text: data.error,
                    icon: "error",
                    confirmButtonText: "Okay",
                }).then(() => {
                    window.location.href = "Seller_Products.html";
                });
            } else {
                const productInfoDiv = document.getElementById('product-info');
                productInfoDiv.innerHTML = `
                    <p><strong>Product ID:</strong> ${data.product_id}</p>
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Description:</strong> ${data.description}</p>
                    <p><strong>Price:</strong> $${parseFloat(data.price).toFixed(2)}</p>
                    <p><strong>Category:</strong> ${data.category}</p>
                    <p><strong>Image:</strong> <img src="${data.image_url}" alt="Product Image" width="100"/></p>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching product info:', error);
            Swal.fire({
                title: "Error!",
                text: "Failed to load product information.",
                icon: "error",
                confirmButtonText: "Okay",
            }).then(() => {
                window.location.href = "Seller_Products.html";
            });
        });
}

function loadVariants(productId) {
    fetch(`Database/Seller_Variants.php?action=get_variants&product_id=${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Swal.fire({
                    title: "Error!",
                    text: data.error,
                    icon: "error",
                    confirmButtonText: "Okay",
                });
            } else {
                displayVariants(data);
            }
        })
        .catch(error => {
            console.error('Error fetching variants:', error);
            Swal.fire({
                title: "Error!",
                text: "Failed to load variants.",
                icon: "error",
                confirmButtonText: "Okay",
            });
        });
}

function displayVariants(variants) {
    const variantsTableBody = document.querySelector('.variants-table tbody');
    variantsTableBody.innerHTML = '';

    variants.forEach(variant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${variant.variant_id}</td>
            <td>${variant.color}</td>
            <td>${variant.size}</td>
            <td>${variant.stock_quantity}</td>
            <td>
                <button class="edit-variant-button" data-id="${variant.variant_id}">Edit</button>
                <button class="delete-variant-button" data-id="${variant.variant_id}">Delete</button>
            </td>
        `;

        // Edit Variant
        row.querySelector('.edit-variant-button').addEventListener('click', function () {
            populateVariantForm(variant);
        });

        // Delete Variant
        row.querySelector('.delete-variant-button').addEventListener('click', function () {
            Swal.fire({
                title: `Delete Variant ID ${variant.variant_id}?`,
                text: "Are you sure you want to delete this variant?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteVariant(variant.variant_id, productId);
                }
            });
        });

        variantsTableBody.appendChild(row);
    });
}

function toggleVariantForm() {
    const formContainer = document.getElementById('variant-form-container');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
    if (formContainer.style.display === 'block') {
        document.getElementById('form-title').textContent = 'Add New Variant';
        document.getElementById('variant-form').reset();
        document.getElementById('variant-id').value = '';
        hideAllValidationMessages();
    }
}

function populateVariantForm(variant) {
    toggleVariantForm();
    document.getElementById('form-title').textContent = 'Edit Variant';
    document.getElementById('variant-id').value = variant.variant_id;
    document.getElementById('variant-color').value = variant.color;
    document.getElementById('variant-size').value = variant.size;
    document.getElementById('variant-stock-quantity').value = variant.stock_quantity;
}

function hideAllValidationMessages() {
    const validationLabels = document.querySelectorAll('label[id^="I-"]');
    validationLabels.forEach(label => {
        label.style.display = 'none';
    });
}

function handleVariantFormSubmit(productId) {
    const variantId = document.getElementById('variant-id').value;
    const color = document.getElementById('variant-color').value.trim();
    const size = document.getElementById('variant-size').value.trim();
    const stockQuantity = document.getElementById('variant-stock-quantity').value.trim();

    let valid = true;

    // Simple validation
    if (color === "") {
        document.getElementById("I-variant-color").style.display = "block";
        valid = false;
    } else {
        document.getElementById("I-variant-color").style.display = "none";
    }

    if (size === "") {
        document.getElementById("I-variant-size").style.display = "block";
        valid = false;
    } else {
        document.getElementById("I-variant-size").style.display = "none";
    }

    if (stockQuantity === "" || isNaN(stockQuantity) || parseInt(stockQuantity) < 0) {
        document.getElementById("I-variant-stock-quantity").style.display = "block";
        valid = false;
    } else {
        document.getElementById("I-variant-stock-quantity").style.display = "none";
    }

    if (valid) {
        const action = variantId ? 'update_variant' : 'add_variant';
        const formData = new FormData();
        formData.append('action', action);
        formData.append('product_id', productId);
        formData.append('color', color);
        formData.append('size', size);
        formData.append('stock_quantity', stockQuantity);
        if (variantId) {
            formData.append('variant_id', variantId);
        }

        fetch('Database/Seller_Variants.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    title: "Success!",
                    text: data.success,
                    icon: "success",
                    confirmButtonText: "Okay",
                }).then(() => {
                    loadVariants(productId);
                    toggleVariantForm();
                });
            } else if (data.error) {
                Swal.fire({
                    title: "Error!",
                    text: data.error,
                    icon: "error",
                    confirmButtonText: "Okay",
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: "Error!",
                text: "An unexpected error occurred.",
                icon: "error",
                confirmButtonText: "Okay",
            });
        });
    }
}

function deleteVariant(variantId, productId) {
    const formData = new FormData();
    formData.append('action', 'delete_variant');
    formData.append('variant_id', variantId);

    fetch('Database/Seller_Variants.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: "Deleted!",
                text: data.success,
                icon: "success",
                confirmButtonText: "Okay",
            }).then(() => {
                loadVariants(productId);
            });
        } else if (data.error) {
            Swal.fire({
                title: "Error!",
                text: data.error,
                icon: "error",
                confirmButtonText: "Okay",
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: "Error!",
            text: "An unexpected error occurred.",
            icon: "error",
            confirmButtonText: "Okay",
        });
    });
}