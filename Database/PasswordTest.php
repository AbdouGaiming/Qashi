<?php
// Mot de passe en clair que vous voulez tester
$password = 'password123';

// Générer un hachage
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
echo "Hachage généré : $hashedPassword <br>";

// Test de password_verify
if (password_verify($password, $hashedPassword)) {
    echo "Mot de passe correct";
} else {
    echo "Mot de passe incorrect";
}

?>
