$(document).ready(function () {
    document.getElementById("update-profile").addEventListener("click", function (event) {
        event.preventDefault();
        let valid = true;

        const firstname = document.getElementById("firstname").value.trim();
        const lastname = document.getElementById("lastname").value.trim();
        const datebirth = document.getElementById("datebirth").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();

        const nameRegExp = /^[a-zA-Z]+$/;
        const phoneRegExp = /^(0(6|5|7|9)\d{8}|0(21|23|29|44|20)\d{6}|\+213(7|5|6|9)\d{8})$/;
        const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (firstname && !nameRegExp.test(firstname)) {
            document.getElementById("I-firstname").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-firstname").style.display = "none";
        }

        if (lastname && !nameRegExp.test(lastname)) {
            document.getElementById("I-lastname").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-lastname").style.display = "none";
        }

        if (datebirth && isNaN(Date.parse(datebirth))) {
            document.getElementById("I-datebirth").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-datebirth").style.display = "none";
        }

        if (phone && !phoneRegExp.test(phone)) {
            document.getElementById("I-phone").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-phone").style.display = "none";
        }

        if (email && !emailRegExp.test(email)) {
            document.getElementById("I-email").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-email").style.display = "none";
        }

        if (valid) {
            Swal.fire({
                title: "Profile Updated Successfully!",
                text: "Your profile information has been updated.",
                icon: "success",
                confirmButtonText: "Continue",
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById("profile-form").submit();
                }
            });
        }
    });

    // Show password validation when focusing on the new password field
    $("#new-password").on("focus", function () {
        $("#PassValidation").show();
    });

    // Hide password validation when blurring out of the new password field
    $("#new-password").on("blur", function () {
        $("#PassValidation").hide();
    });

    // Disable the update password button initially
    $("#update-password").prop("disabled", true);

    // Validate the new password as the user types
    $("#new-password").on("keyup", function () {
        var password = $(this).val();
        var passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (passwordRegex.test(password)) {
            // If password meets the criteria, change validation box to green
            $("#PassValidation").css("background-color", "#d4edda");
            $("#PassValidation").css("color", "#155724");
        } else {
            // If password does not meet the criteria, change validation box to red
            $("#PassValidation").css("background-color", "#f8d7da");
            $("#PassValidation").css("color", "#721c24");
        }
    });

    // Validate if the confirm password matches the new password
    $("#confirm-password").on("input", function () {
        var password = $("#new-password").val();
        var repassword = $(this).val();
        var passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // Check if the new password meets the criteria
        if (passwordRegex.test(password)) {
            // Check if passwords match
            if (password === repassword) {
                $("#update-password").prop("disabled", false);
                $("#I-confirm-password").hide();
            } else {
                $("#update-password").prop("disabled", true);
                $("#I-confirm-password").show();
            }
        } else {
            $("#update-password").prop("disabled", true);
        }
    });

    // Handle the update password button click
    $("#update-password").on("click", function (event) {
        event.preventDefault();
        Swal.fire({
            title: "Password Updated Successfully!",
            text: "Your password has been updated.",
            icon: "success",
            confirmButtonText: "Continue",
        }).then((result) => {
            if (result.isConfirmed) {
                $("#password-form").submit();
            }
        });
    });
});


///////AJAAX

document.addEventListener("DOMContentLoaded", function () {
    // Fetch session details when the page loads
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "Database/GetSession.php", true);
    
    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    // Check user entry type (login or signup) and user ID
                    const userId = response.data.user_id;
                    const entryType = response.data.entry_type;

                    if (!userId) {
                        alert("User is not logged in. Redirecting to login page.");
                        window.location.href = "login.html";
                    } else {
                        console.log(`User ID: ${userId}, Entry Type: ${entryType}`);
                        // Perform actions based on entry type
                        if (entryType === "login") {
                            console.log("User entered via login.");
                        } else if (entryType === "signup") {
                            console.log("User entered via signup.");
                        }
                    }
                } else {
                    alert(response.message || "Failed to fetch session details.");
                    window.location.href = "login.html"; // Redirect if session invalid
                }
            } catch (error) {
                console.error("Error parsing JSON response:", error.message);
                alert("An unexpected error occurred. Please try again later.");
            }
        } else {
            console.error("HTTP Error:", xhr.status);
            alert("Failed to fetch session details. Please try again later.");
        }
    };

    xhr.onerror = function () {
        console.error("Network Error");
        alert("Could not connect to the server. Please check your internet connection.");
    };
    
    xhr.send();
});

document.addEventListener("DOMContentLoaded", function () {
    // Get the user_id from a global variable, session, or other storage mechanism
    const userId = sessionStorage.getItem("user_id") || null; // Example: Fetch from session storage or replace with your logic

    if (!userId) {
        alert("User not logged in. Please log in to view your profile.");
        window.location.href = "login.html"; // Redirect to login page
        return; // Exit if no user_id is found
    }

    // Prepare the GET request with the user_id parameter
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `Database/GetUserProfile.php?user_id=${encodeURIComponent(userId)}`, true);

    // Define the response handler
    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText); // Parse the JSON response

                if (response.success) {
                    // Populate placeholders with user data
                    document.getElementById("firstname").placeholder = response.data.firstname || "N/A";
                    document.getElementById("lastname").placeholder = response.data.lastname || "N/A";
                    document.getElementById("datebirth").placeholder = response.data.datebirth || "N/A";
                    document.getElementById("phone").placeholder = response.data.phone || "N/A";
                    document.getElementById("email").placeholder = response.data.email || "N/A";
                } else {
                    // Show error message in case of failure
                    alert(response.message || "Failed to load profile data.");
                }
            } catch (error) {
                console.error("Error parsing JSON response:", error.message);
                alert("An unexpected error occurred. Please try again later.");
            }
        } else {
            console.error("HTTP Error:", xhr.status);
            alert(`Failed to fetch user data. Server returned status: ${xhr.status}.`);
        }
    };

    // Define the error handler for network issues
    xhr.onerror = function () {
        console.error("Network Error");
        alert("Could not connect to the server. Please check your internet connection.");
    };

    // Send the request
    xhr.send();
});
