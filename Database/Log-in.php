<?php
require 'database.php';
header('Content-Type: application/json');

// Récupérer l'email et le mot de passe depuis la requête GET
$email = $_GET['email'] ?? null;
$password = $_GET['password'] ?? null;

// Valider les entrées
if (!$email || !$password) {
    echo json_encode(['status' => 'error', 'message' => 'Veuillez fournir un email et un mot de passe.']);
    exit();
}

// Préparer et exécuter la requête SQL
$query = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Vérification du mot de passe
    if (password_verify($password, $user['password'])) {
        session_start();
        $_SESSION['user_id'] = $user['user_id']; // Stocker l'ID utilisateur dans la session
        $_SESSION['user_type'] = $user['user_type']; // Stocker le type d'utilisateur dans la session

        echo json_encode([
            'status' => 'success',
            'message' => 'Connexion réussie.',
            'userType' => $user['user_type']
        ]);
    } else {
        // Pour déboguer, afficher le mot de passe de la base de données (temporairement, pour test uniquement)
        error_log("Mot de passe fourni : $password");
        error_log("Mot de passe haché dans la base : " . $user['password']);
        
        echo json_encode(['status' => 'error', 'message' => 'Mot de passe incorrect.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Cet email n\'existe pas.']);
}

$conn->close();
