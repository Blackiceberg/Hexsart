console.log('🚀 Hexart - Chargement du site');

// Fonctions utilitaires
function navigateTo(url) {
    window.location.href = url;
}

function showLoading() {
    document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.5rem;">Chargement...</div>';
}
