// Système d'authentification unifié
class AuthSystem {
    static isLoggedIn() {
        return localStorage.getItem('adminLoggedIn') === 'true';
    }

    static login(username, password) {
        // Comptes de test
        const accounts = {
            'admin': 'admin123',
            'modo': 'modo123'
        };

        if (accounts[username] && accounts[username] === password) {
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminUser', username);
            localStorage.setItem('adminRole', username === 'admin' ? 'admin' : 'moderateur');
            return true;
        }
        return false;
    }

    static logout() {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminRole');
        window.location.href = '../index.html';
    }

    static requireAuth() {
        if (!this.isLoggedIn() && !window.location.href.includes('index.html')) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    static getCurrentUser() {
        return {
            username: localStorage.getItem('adminUser'),
            role: localStorage.getItem('adminRole')
        };
    }
}