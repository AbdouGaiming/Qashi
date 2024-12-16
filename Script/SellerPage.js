const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum = 0;

nextBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        let valid = true;

        // Validate Step 1
        if (index === 0) {
            var firstname = document.getElementById("firstname").value.trim();
            var lastname = document.getElementById("lastname").value.trim();
            var nameRegExp = /^[a-zA-Z]+$/;

            if (!nameRegExp.test(firstname)) {
                document.getElementById("I-username").style.display = "block";
                valid = false;
            } else {
                document.getElementById("I-username").style.display = "none";
            }

            if (!nameRegExp.test(lastname)) {
                document.getElementById("I-lastname").style.display = "block";
                valid = false;
            } else {
                document.getElementById("I-lastname").style.display = "none";
            }
        } 
        // Validate Step 2
        else if (index === 1) {
            var phone = document.getElementById("phone").value.trim();
            var email = document.getElementById("email").value.trim();
            email = email.toLowerCase();
            var phoneRegExp = /^(0(6|5|7|9)\d{8}|0(21|23|29|44|20)\d{6}|\+213(7|5|6|9)\d{8})$/;
            var emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!phoneRegExp.test(phone)) {
                document.getElementById("I-phone").style.display = "block";
                valid = false;
            } else {
                document.getElementById("I-phone").style.display = "none";
            }

            if (!emailRegExp.test(email)) {
                document.getElementById("I-email").style.display = "block";
                valid = false;
            } else {
                // AJAX request to check for duplicate email
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "Database/Sign-up(email ver).php", false); // Synchronous request to halt the process
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                xhr.onload = function () {
                    if (xhr.status === 200  && xhr.readyState === 4) {
                        const response = JSON.parse(xhr.responseText);
                        if (!response.success) {
                            document.getElementById("I-email").textContent = response.message;
                            document.getElementById("I-email").style.display = "block";
                            valid = false;
                        } else {
                            document.getElementById("I-email").style.display = "none";
                        }
                    } else {
                        console.error("Error verifying email. Status:", xhr.status);
                    }
                };

                xhr.onerror = function () {
                    console.error("An error occurred while verifying the email.");
                };

                xhr.send(`email=${encodeURIComponent(email)}`);
            }
        } 
        // Validate Step 3
        else if (index === 2) {
            var dob = document.getElementById("dob").value;
            var dobRegExp = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

            if (!dob) {
                document.getElementById("I-dob").style.display = "block";
                valid = false;
            } else {
                document.getElementById("I-dob").style.display = "none";
            }
        } 
        // Validate Step 4
        else if (index === 3) {
            var storename = document.getElementById("storeName").value.trim();
            var address = document.getElementById("storeAddress").value.trim();
            var nameRegExp = /^[a-zA-Z]+$/;
            var addressRegExp = /^(?!\s*$)[a-zA-Z0-9\s,'-]+$/;

            if (!nameRegExp.test(storename)) {
                document.getElementById("I-storename").style.display = "block";
                valid = false;
            } else {
                document.getElementById("I-storename").style.display = "none";
            }

            if (!addressRegExp.test(address)) {
                document.getElementById("I-storeAddress").style.display = "block";
                valid = false;
            } else {
                document.getElementById("I-storeAddress").style.display = "none";
            }
        }

        if (valid) {
            formStepsNum++;
            updateFormSteps();
            updateProgressbar();
        }
    });
});

$("#password").on("focus", function () {
    $("#PassValidation").show();
});

$("#password").on("blur", function () {
    $("#PassValidation").hide();
});

document.getElementById("Submit").disabled = true;

$("#password").on("keyup", function () {
    var password = $(this).val();
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(password)) {
        $("#PassValidation").css("background-color", "#d4edda");
        $("#PassValidation").css("color", "#155724");
    } else {
        $("#PassValidation").css("background-color", "#f8d7da");
        $("#PassValidation").css("color", "#721c24");
    }
});

$("#confirmPassword").on("input", function () {
    var password = $("#password").val();
    var repassword = $(this).val();
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (passwordRegex.test(password)) {
        if (password === repassword) {
            document.getElementById("Submit").disabled = false;
            document.getElementById("I-confirmPassword").style.display = "none";
        } else {
            document.getElementById("Submit").disabled = true;
            document.getElementById("I-confirmPassword").style.display = "block";
        }
    }
});

document.getElementById("Submit").addEventListener("click", function () {
    event.preventDefault();
    Swal.fire({
        title: "Account Created Successfully!",
        text: "You just created your account successfully!",
        icon: "success",
        confirmButtonText: "Continue",
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById("accountForm").submit();
        }
    });
});

prevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        formStepsNum--;
        updateFormSteps();
        updateProgressbar();
    });
});

function updateFormSteps() {
    formSteps.forEach((formStep) => {
        formStep.classList.contains("form-step-active") &&
            formStep.classList.remove("form-step-active");
    });
    formSteps[formStepsNum].classList.add("form-step-active");
}

function updateProgressbar() {
    progressSteps.forEach((progressStep, idx) => {
        if (idx < formStepsNum + 1) {
            progressStep.classList.add("progress-step-active");
        } else {
            progressStep.classList.remove("progress-step-active");
        }
    });
    const progressActive = document.querySelectorAll(".progress-step-active");
    progress.style.width =
        ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}

// Attach event listener to the "Submit" button
document.getElementById("Submit").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve form data
    const formData = new FormData(document.getElementById("accountForm"));

    // Convert form data to query parameters (URL-encoded format)
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
        params.append(key, value);
    });

    // Log the form data for debugging
    console.log("Form Data (Encoded):", params.toString());

    // Initialize XMLHttpRequest
    const xhr = new XMLHttpRequest();

    // Configure the GET request with the query parameters
    xhr.open("GET", `Database/SellerPage.php?${params.toString()}`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Define the response handler
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log("Raw Response:", xhr.responseText); // Debugging raw response

            try {
                const response = JSON.parse(xhr.responseText); // Parse JSON response
                console.log("Parsed Response:", response); // Log parsed response

                if (response.success) {
                    // Show success message with SweetAlert2
                    Swal.fire({
                        title: "Account Created Successfully!",
                        text: response.message,
                        icon: "success",
                        confirmButtonText: "Continue",
                    }).then(() => {
                        window.location.href = "index.html"; // Redirect to the homepage
                    });
                } else {
                    // Show error message with SweetAlert2
                    Swal.fire({
                        title: "Error",
                        text: response.message,
                        icon: "error",
                        confirmButtonText: "Try Again",
                    });
                }
            } catch (error) {
                // Handle JSON parsing error
                console.error("Error Parsing JSON:", error.message);
                Swal.fire({
                    title: "Unexpected Error",
                    text: "Could not parse server response. Please try again later.",
                    icon: "error",
                });
            }
        } else {
            // Handle HTTP errors
            Swal.fire({
                title: "HTTP Error",
                text: `Failed to contact the server. Status: ${xhr.status}`,
                icon: "error",
            });
        }
    };

    // Handle network or other errors
    xhr.onerror = function () {
        Swal.fire({
            title: "Network Error",
            text: "Could not send the request. Please check your network connection.",
            icon: "error",
        });
    };

    // Send the request
    xhr.send();
});
 