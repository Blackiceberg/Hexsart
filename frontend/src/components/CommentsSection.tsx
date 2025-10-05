// frontend/src/components/CommentsSection.tsx
import React, { useState, useEffect } from 'react';
import { Comment } from '../../shared/types';
import { useAuth } from '../hooks/useAuth';

interface CommentsSectionProps {
  bdName: string;
  chapitreId: string;
  comments: Comment[];
  onCommentsUpdate: (comments: Comment[]) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  bdName,
  chapitreId,
  comments,
  onCommentsUpdate
}) => {
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Charger les commentaires
  useEffect(() => {
    loadComments();
  }, [bdName, chapitreId]);

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/comments?bd=${bdName}&chapitre=${chapitreId}`);
      const data = await response.json();
      onCommentsUpdate(data);
    } catch (error) {
      console.error('Erreur chargement commentaires:', error);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bdName,
          chapitreId,
          contenu: newComment.trim()
        })
      });

      if (response.ok) {
        setNewComment('');
        loadComments(); // Recharger les commentaires
      }
    } catch (error) {
      console.error('Erreur envoi commentaire:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      loadComments();
    } catch (error) {
      console.error('Erreur approbation:', error);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    
    try {
      await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      loadComments();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  return (
    <section className="comments-section">
      <h3>💬 Commentaires ({comments.length})</h3>

      {isAuthenticated ? (
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Partagez vos impressions..."
            rows={3}
          />
          <button 
            onClick={submitComment} 
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'Publication...' : 'Publier'}
          </button>
        </div>
      ) : (
        <div className="auth-prompt">
          <a href="/connexion">Connectez-vous</a> pour commenter
        </div>
      )}

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className={`comment ${comment.approuve ? '' : 'pending'}`}>
            <div className="comment-header">
              <strong>{comment.auteur}</strong>
              <span className="comment-date">
                {new Date(comment.date).toLocaleDateString('fr-FR')}
              </span>
              {!comment.approuve && <span className="pending-badge">⏳ En attente</span>}
            </div>
            
            <p>{comment.contenu}</p>

            {/* Actions modération */}
            {user && (user.role === 'admin' || user.role === 'moderateur') && !comment.approuve && (
              <div className="moderation-actions">
                <button 
                  onClick={() => approveComment(comment.id)}
                  className="btn-approve"
                >
                  ✅ Approuver
                </button>
                <button 
                  onClick={() => deleteComment(comment.id)}
                  className="btn-delete"
                >
                  🗑️ Supprimer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommentsSection;