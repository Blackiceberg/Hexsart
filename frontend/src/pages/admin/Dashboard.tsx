// frontend/src/pages/admin/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface DashboardStats {
  totalComments: number;
  pendingModeration: number;
  totalUsers: number;
  recentComments: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Tableau de Bord Admin</h1>
        <div className="user-info">
          Connecté en tant que <strong>{user?.username}</strong>
          <button onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}>
            Déconnexion
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats?.totalComments || 0}</div>
          <div className="stat-label">Commentaires total</div>
        </div>
        
        <div className="stat-card highlight">
          <div className="stat-number">{stats?.pendingModeration || 0}</div>
          <div className="stat-label">En attente de modération</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats?.totalUsers || 0}</div>
          <div className="stat-label">Utilisateurs</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats?.recentComments || 0}</div>
          <div className="stat-label">Commentaires cette semaine</div>
        </div>
      </div>

      <div className="admin-menu">
        <Link to="/admin/comments" className="menu-card">
          <h3>📝 Gestion des Commentaires</h3>
          <p>Modérer et répondre aux commentaires</p>
          {stats?.pendingModeration > 0 && (
            <span className="badge">{stats.pendingModeration} en attente</span>
          )}
        </Link>

        <Link to="/admin/users" className="menu-card">
          <h3>👥 Gestion des Utilisateurs</h3>
          <p>Gérer les comptes et permissions</p>
        </Link>

        <Link to="/" className="menu-card">
          <h3>👁️ Voir le Site</h3>
          <p>Accéder au site public</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;