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

$("#new-password").on("focus", function () {
    $("#PassValidation").show();
});

$("#new-password").on("blur", function () {
    $("#PassValidation").hide();
});

$("#new-password").on("keyup", function () {
    var password = $(this).val();
    var passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(password)) {
        $("#PassValidation").css("background-color", "#d4edda");
        $("#PassValidation").css("color", "#155724");
    } else {
        $("#PassValidation").css("background-color", "#f8d7da");
        $("#PassValidation").css("color", "#721c24");
    }
});

$("#confirm-password").on("input", function () {
    var password = $("#new-password").val();
    var repassword = $(this).val();

    if (password === repassword) {
        document.getElementById("update-password").disabled = false;
        document.getElementById("I-confirm-password").style.display = "none";
    } else {
        document.getElementById("update-password").disabled = true;
        document.getElementById("I-confirm-password").style.display = "block";
    }
});

document.getElementById("update-password").addEventListener("click", function (event) {
    event.preventDefault();
    Swal.fire({
        title: "Password Updated Successfully!",
        text: "Your password has been updated.",
        icon: "success",
        confirmButtonText: "Continue",
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById("password-form").submit();
        }
    });
});
