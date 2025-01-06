<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500'); // Autoriser uniquement le client local
header('Access-Control-Allow-Methods: GET, POST'); // Autoriser les méthodes GET et POST
header('Access-Control-Allow-Headers: Content-Type'); // Autoriser les en-têtes comme Content-Type
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

// Préparer et exécuter la requête SQL pour récupérer l'utilisateur par email
$query = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

// Vérifier si l'utilisateur existe
if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Vérification du mot de passe
    if (password_verify($password, $user['password'])) {
        // Si le mot de passe est correct, on renvoie une réponse positive
        echo json_encode([
            'status' => 'success',
            'message' => 'Connexion réussie.',
            'userType' => $user['user_type']
        ]);
    } else {
        // Pour le débogage, vous pouvez activer cette ligne si nécessaire pour examiner les valeurs
        // error_log("Mot de passe fourni : $password");
        // error_log("Mot de passe haché dans la base : " . $user['password']);
        
        // Erreur en cas de mot de passe incorrect
        echo json_encode(['status' => 'error', 'message' => 'Mot de passe incorrect.']);
        exit();
    }
} else {
    // Erreur si l'email n'existe pas dans la base de données
    echo json_encode(['status' => 'error', 'message' => 'Cet email n\'existe pas.']);
}

$conn->close();
?>
