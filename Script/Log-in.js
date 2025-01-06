document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.toLowerCase();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        Swal.fire({
            title: 'Erreur',
            text: 'Veuillez remplir tous les champs.',
            icon: 'error',
            confirmButtonText: 'Réessayer'
        });
        return;
    }

    // Prepare data for the request
    const data = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    const xhr = new XMLHttpRequest();
    
    // Change to GET request and append data to the URL
    xhr.open('GET', 'http://localhost/webprojectL3/Qashi/Database/Log-in.php?' + data, true);


    xhr.onload = function () {
        console.log("Raw Response:", xhr.responseText); // Affiche la réponse brute pour le débogage
    
        try {
            const response = JSON.parse(xhr.responseText);
    
            if (response.status === "success") {
                Swal.fire({
                    title: 'Connexion réussie',
                    text: response.message,
                    icon: 'success',
                    confirmButtonText: 'Continuer'
                }).then(() => {
                    if (response.userType === "Buyer") {
                        window.location.href = 'User_Profile.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                });
            } else {
                Swal.fire({
                    title: 'Erreur',
                    text: response.message,
                    icon: 'error',
                    confirmButtonText: 'Réessayer'
                });
            }
        } catch (error) {
            console.error("Error parsing JSON:", error.message);
            console.error("Raw Response:", xhr.responseText);
            Swal.fire({
                title: 'Erreur',
                text: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.',
                icon: 'error',
                confirmButtonText: 'Réessayer'
            });
        }
    };
    

    xhr.onerror = function () {
        Swal.fire({
            title: 'Erreur réseau',
            text: 'Impossible de se connecter au serveur. Vérifiez votre connexion Internet.',
            icon: 'error',
            confirmButtonText: 'Réessayer'
        });
    };

    // Send the GET request with data in the URL
    xhr.send();
});
