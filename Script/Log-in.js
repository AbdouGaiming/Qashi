document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    if (!email || !password) {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs',
        icon: 'error',
        confirmButtonText: 'Réessayer'
      });
      return;
    }
  
    // AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "Log-in.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
    xhr.onload = function () {
      const response = JSON.parse(xhr.responseText);
      if (response.status === 200  ) {
        Swal.fire({
          title: 'Connexion réussie',
          text: response.message,
          icon: 'success',
          confirmButtonText: 'Continuer'
        }).then(() => {
          window.location.href = response.redirect; // Redirect based on user type
        });
      } else if (response.message === "Email does not exist.") {
        const emailLabel = document.getElementById("emailLabel");
        emailLabel.textContent = "Cet email n'existe pas.";
        emailLabel.style.color = "red";
      } else {
        Swal.fire({
          title: 'Erreur',
          text: response.message,
          icon: 'error',
          confirmButtonText: 'Réessayer'
        });
      }
    };
  
    const data = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    xhr.send(data);
  });
  