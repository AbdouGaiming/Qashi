const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");


let formStepsNum = 0;

nextBtns.forEach((btn, index) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    let valid = true;

    if (index === 0) {
      var firstname = document.getElementById("username").value.trim();
      var lastname = document.getElementById("position").value.trim();
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
    } else if (index === 1) {
      var phone = document.getElementById("phone").value.trim();
      var email = document.getElementById("email").value.trim();
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
        xhr.open("GET", "http://localhost/webprojectL3/Qashi/Database/Signup-email-ver.php?email=" + encodeURIComponent(email), true);

 // Synchronous request to halt the process
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onload = function () {
          console.log(xhr.responseText); // Afficher la réponse brute du serveur
          if (xhr.status === 200) {
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
    } else if (index === 2) {
      var dob = document.getElementById("dob").value.trim();
      var dobRegExp = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

      if (!dob) {
        document.getElementById("I-dob").style.display = "block";
        valid = false;
      } else {
        document.getElementById("I-dob").style.display = "none";
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

$("#confirmPassword").on("input", function () {
  var password = $("#password").val();
  var repassword = $(this).val();
  var passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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


document.getElementById("dob").addEventListener("input", function () {
  var dob = this.value.trim();
  var dobRegExp = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  var valid = dobRegExp.test(dob);

  if (!valid) {
    document.getElementById("I-dob").style.display = "block";
    document.querySelector(".btn-next").disabled = true;
  } else {
    document.getElementById("I-dob").style.display = "none";
    document.querySelector(".btn-next").disabled = false;
  }
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


// document.getElementById("Submit").addEventListener("click", function () {
//   event.preventDefault();
//   Swal.fire({
//     title: "Account Created Successfully!",
//     text: "You just created your account successfully!",
//     icon: "success",
//     confirmButtonText: "Continue",
//   }).then((result) => {
//     if (result.isConfirmed) {
//       document.getElementById("accountForm").submit();
//     }
//   });
// });

//ajax request

document.getElementById("Submit").addEventListener("click", function (event) {
  event.preventDefault();

  const formData = new FormData(document.getElementById("accountForm"));
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "Database/Sign-up(email ver).php?email=" + encodeURIComponent(email), true);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  // Utiliser le bon header

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        // Vérifier si la réponse commence bien par un objet JSON (c'est-à-dire '{' ou '[')
        if (xhr.responseText.trim().startsWith("{") || xhr.responseText.trim().startsWith("[")) {
          const response = JSON.parse(xhr.responseText);  // Parse la réponse en JSON
          // Traitement de la réponse ici
          if (response.success) {
            Swal.fire({
              title: "Account Created Successfully!",
              text: response.message || "Your account has been created successfully!",
              icon: "success",
              confirmButtonText: "Continue",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "index.html"; // Redirect after success
              }
            });
          } else {
            Swal.fire({
              title: "Error",
              text: response.message || "There was an issue creating your account.",
              icon: "error",
              confirmButtonText: "Try Again",
            });
          }
        } else {
          console.error("Réponse inattendue : ", xhr.responseText); // Afficher la réponse brute si ce n'est pas du JSON
          Swal.fire({
            title: "Erreur",
            text: "La réponse du serveur n'est pas au format JSON.",
            icon: "error",
            confirmButtonText: "Essayer à nouveau",
          });
        }
      } catch (error) {
        console.error("Erreur lors du parsing du JSON :", error);
        console.log("Réponse du serveur : ", xhr.responseText); // Afficher la réponse brute
        Swal.fire({
          title: "Erreur",
          text: "Une erreur s'est produite lors du traitement de la réponse.",
          icon: "error",
          confirmButtonText: "Essayer à nouveau",
        });
      }
    } else {
      console.error("Erreur HTTP. Statut : ", xhr.status);
      Swal.fire({
        title: "Erreur",
        text: "La soumission du formulaire a échoué. Veuillez vérifier votre réseau et réessayer.",
        icon: "error",
        confirmButtonText: "Essayer à nouveau",
      });
    }
  };
  

  xhr.onerror = function () {
    console.error("A network error occurred during the request.");
    Swal.fire({
      title: "Error",
      text: "An error occurred while submitting the form. Please try again.",
      icon: "error",
      confirmButtonText: "Try Again",
    });
  };

  xhr.send();
});
