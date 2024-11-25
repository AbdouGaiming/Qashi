document.getElementById("add-product-submit").addEventListener("click", function (event) {
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
        Swal.fire({
            title: "Product Added Successfully!",
            text: "You have successfully added a new product.",
            icon: "success",
            confirmButtonText: "Continue",
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById("add-product-form").submit();
            }
        });
    }
});

function toggleAddProductForm() {
    const form = document.getElementById("add-product-form");
    if (form.style.display === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}