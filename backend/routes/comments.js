class CommentSystem {
    constructor() {
        this.apiBase = 'http://localhost:5000/api';
        this.currentUser = null;
        this.token = localStorage.getItem('authToken');
        this.init();
    }

    async init() {
        await this.checkAuth();
        this.loadEventListeners();
    }

    async checkAuth() {
        if (this.token) {
            try {
                const response = await fetch(`${this.apiBase}/auth/me`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.currentUser = data.user;
                    this.updateAuthUI();
                }
            } catch (error) {
                console.error('Erreur vérification auth:', error);
                this.logout();
            }
        }
    }

    updateAuthUI() {
        const authElements = document.querySelectorAll('.auth-status');
        authElements.forEach(element => {
            if (this.currentUser) {
                element.innerHTML = `
                    <div class="flex-between">
                        <span>👋 Connecté en tant que <strong>${this.currentUser.username}</strong></span>
                        <button class="btn btn-danger btn-small" onclick="commentSystem.logout()">Déconnexion</button>
                    </div>
                `;
            } else {
                element.innerHTML = `
                    <div class="text-center">
                        <a href="/admin/index.html" class="btn btn-primary btn-small">🔐 Se connecter</a>
                        <span class="px-2">pour commenter</span>
                    </div>
                `;
            }
        });
    }

    async loadComments(bdName, chapitreId) {
        try {
            const response = await fetch(
                `${this.apiBase}/comments?bd=${bdName}&chapitre=${chapitreId}&limit=50`
            );
            
            if (response.ok) {
                const data = await response.json();
                this.displayComments(data.comments);
            }
        } catch (error) {
            console.error('Erreur chargement commentaires:', error);
            this.displayComments([]);
        }
    }

    displayComments(comments) {
        const container = document.getElementById('commentsList');
        if (!container) return;

        if (comments.length === 0) {
            container.innerHTML = `
                <div class="text-center p-4">
                    <p>💬 Soyez le premier à commenter cette BD !</p>
                </div>
            `;
            return;
        }

        container.innerHTML = comments.map(comment => `
            <div class="comment ${comment.approuve ? '' : 'pending'}">
                <div class="comment-header">
                    <div>
                        <strong>${comment.auteur}</strong>
                        ${!comment.approuve ? '<span class="status-badge status-pending">⏳ En attente</span>' : ''}
                    </div>
                    <span style="color: #666; font-size: 0.9rem;">
                        ${new Date(comment.date).toLocaleDateString('fr-FR')} à 
                        ${new Date(comment.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
                <p>${comment.contenu}</p>
                ${this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'moderateur') && !comment.approuve ? `
                    <div class="comment-actions">
                        <button class="btn btn-primary btn-small" onclick="commentSystem.approveComment('${comment._id}')">
                            ✅ Approuver
                        </button>
                        <button class="btn btn-danger btn-small" onclick="commentSystem.deleteComment('${comment._id}')">
                            🗑️ Supprimer
                        </button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    async submitComment(bdName, chapitreId, contenu, page = 0) {
        if (!this.currentUser) {
            alert('Veuillez vous connecter pour commenter');
            window.location.href = '/admin/index.html';
            return;
        }

        if (!contenu.trim()) {
            alert('Veuillez écrire un commentaire');
            return;
        }

        if (contenu.length < 5) {
            alert('Le commentaire doit contenir au moins 5 caractères');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    bdName,
                    chapitreId,
                    contenu: contenu.trim(),
                    page
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                document.getElementById('commentText').value = '';
                this.loadComments(bdName, chapitreId);
            } else {
                alert(data.error || 'Erreur lors de la publication');
            }
        } catch (error) {
            console.error('Erreur envoi commentaire:', error);
            alert('Erreur de connexion');
        }
    }

    async approveComment(commentId) {
        try {
            const response = await fetch(`${this.apiBase}/comments/${commentId}/approve`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${this.token}` }
            });

            if (response.ok) {
                this.loadComments(currentBD, currentChapitre);
            }
        } catch (error) {
            console.error('Erreur approbation:', error);
        }
    }

    async deleteComment(commentId) {
        if (!confirm('Supprimer définitivement ce commentaire ?')) return;

        try {
            const response = await fetch(`${this.apiBase}/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${this.token}` }
            });

            if (response.ok) {
                this.loadComments(currentBD, currentChapitre);
            }
        } catch (error) {
            console.error('Erreur suppression:', error);
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        this.token = null;
        this.currentUser = null;
        this.updateAuthUI();
        window.location.reload();
    }

    loadEventListeners() {
        // Événement global pour le formulaire de commentaire
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'commentForm') {
                e.preventDefault();
                const contenu = document.getElementById('commentText').value;
                this.submitComment(currentBD, currentChapitre, contenu, currentPage);
            }
        });
    }
}

// Initialisation globale
const commentSystem = new CommentSystem();

// Variables globales pour la page de lecture
let currentBD = 'Fantaryou';
let currentChapitre = '';
let currentPage = 0;