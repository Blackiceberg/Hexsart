<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataFile = 'comments.json';

// Charger les commentaires
function loadComments() {
    global $dataFile;
    if (!file_exists($dataFile)) {
        file_put_contents($dataFile, json_encode([]));
    }
    return json_decode(file_get_contents($dataFile), true) ?: [];
}

// Sauvegarder les commentaires
function saveComments($comments) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($comments, JSON_PRETTY_PRINT));
}

// GET - Récupérer les commentaires
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $bd = $_GET['bd'] ?? '';
    $chapitre = $_GET['chapitre'] ?? '';
    
    $comments = loadComments();
    
    if ($bd && $chapitre) {
        $filteredComments = array_filter($comments, function($comment) use ($bd, $chapitre) {
            return $comment['bdName'] === $bd && $comment['chapitreId'] === $chapitre;
        });
        echo json_encode(array_values($filteredComments));
    } else {
        echo json_encode($comments);
    }
    exit;
}

// POST - Ajouter un commentaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $comments = loadComments();
    
    $newComment = [
        'id' => uniqid(),
        'auteur' => $input['auteur'] ?? 'Anonyme',
        'contenu' => $input['contenu'],
        'bdName' => $input['bdName'],
        'chapitreId' => $input['chapitreId'],
        'date' => date('c'),
        'approuve' => false
    ];
    
    $comments[] = $newComment;
    saveComments($comments);
    
    echo json_encode($newComment);
    exit;
}

// DELETE - Supprimer un commentaire
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? '';
    
    if ($id) {
        $comments = loadComments();
        $comments = array_filter($comments, function($comment) use ($id) {
            return $comment['id'] !== $id;
        });
        saveComments($comments);
        echo json_encode(['success' => true]);
    }
    exit;
}
?>