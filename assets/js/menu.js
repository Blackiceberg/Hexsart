// Menu universel pour le site principal
function loadMainMenu() {
    const menuHTML = `
        <nav class="main-nav">
            <div class="nav-container">
                <a href="../index.html" class="nav-link">🏠 Accueil</a>
                <a href="../galerie/bd.html?bd=Fantaryou" class="nav-link">📚 BD Fantaryou</a>
                <a href="../connexion.html" class="nav-link">🔐 Connexion</a>
                <a href="../admin/index.html" class="nav-link">⚙️ Admin</a>
            </div>
        </nav>
    `;
    
    const header = document.querySelector('header');
    if (header) {
        header.insertAdjacentHTML('afterend', menuHTML);
    }
}

// Menu universel pour l'administration
function loadAdminMenu() {
    const menuHTML = `
        <nav class="admin-nav">
            <div class="nav-container">
                <a href="../index.html" class="nav-link">🏠 Accueil Public</a>
                <a href="dashboard.html" class="nav-link">📊 Tableau de Bord</a>
                <a href="commentaires.html" class="nav-link">💬 Commentaires</a>
                <a href="utilisateurs.html" class="nav-link">👥 Utilisateurs</a>
                <button onclick="adminLogout()" class="nav-link logout-btn">🚪 Déconnexion</button>
            </div>
        </nav>
    `;
    
    const header = document.querySelector('.admin-header') || document.querySelector('header');
    if (header) {
        header.insertAdjacentHTML('afterend', menuHTML);
    }
}

// Charger le menu automatiquement
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('/admin/')) {
        loadAdminMenu();
    } else {
        loadMainMenu();
    }
});