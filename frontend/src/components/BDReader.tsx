// frontend/src/components/BDReader.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chapitre, Comment } from '../../../shared/types';

const BDReader: React.FC = () => {
  const { bdName, chapitreId } = useParams<{ bdName: string; chapitreId: string }>();
  const navigate = useNavigate();
  
  const [currentChapitre, setCurrentChapitre] = useState<Chapitre | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [chapitresList, setChapitresList] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données du chapitre
  useEffect(() => {
    const loadChapitreData = async () => {
      try {
        const [chapitreRes, chapitresRes] = await Promise.all([
          fetch(`/api/bd/${bdName}/chapitres/${chapitreId}`),
          fetch(`/api/bd/${bdName}/chapitres`)
        ]);
        
        const chapitreData = await chapitreRes.json();
        const chapitresData = await chapitresRes.json();
        
        setCurrentChapitre(chapitreData);
        setChapitresList(chapitresData);
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement:', error);
        setLoading(false);
      }
    };

    loadChapitreData();
  }, [bdName, chapitreId]);

  // Navigation entre chapitres
  const navigateToChapitre = useCallback((targetChapitreId: string) => {
    navigate(`/lecture/${bdName}/${targetChapitreId}`);
  }, [navigate, bdName]);

  // Navigation clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!currentChapitre) return;

      switch(e.key) {
        case 'ArrowLeft':
          if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
          } else {
            // Aller au chapitre précédent
            const currentIndex = chapitresList.indexOf(chapitreId!);
            if (currentIndex > 0) {
              navigateToChapitre(chapitresList[currentIndex - 1]);
            }
          }
          break;
          
        case 'ArrowRight':
          if (currentPage < currentChapitre.episodes.length - 1) {
            setCurrentPage(currentPage + 1);
          } else {
            // Aller au chapitre suivant
            const currentIndex = chapitresList.indexOf(chapitreId!);
            if (currentIndex < chapitresList.length - 1) {
              navigateToChapitre(chapitresList[currentIndex + 1]);
            }
          }
          break;
          
        case 'Home':
          setCurrentPage(0);
          break;
          
        case 'End':
          setCurrentPage(currentChapitre.episodes.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, currentChapitre, chapitresList, chapitreId, navigateToChapitre]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (!currentChapitre) return <div className="error">Chapitre non trouvé</div>;

  return (
    <div className="bd-reader">
      {/* En-tête avec navigation */}
      <header className="reader-header">
        <button onClick={() => navigate(`/bd/${bdName}`)}>
          ← Retour aux chapitres
        </button>
        
        <div className="chapter-nav">
          <button 
            disabled={chapitresList.indexOf(chapitreId!) === 0}
            onClick={() => navigateToChapitre(chapitresList[chapitresList.indexOf(chapitreId!) - 1])}
          >
            ← Chapitre précédent
          </button>
          
          <h1>{currentChapitre.title}</h1>
          
          <button 
            disabled={chapitresList.indexOf(chapitreId!) === chapitresList.length - 1}
            onClick={() => navigateToChapitre(chapitresList[chapitresList.indexOf(chapitreId!) + 1])}
          >
            Chapitre suivant →
          </button>
        </div>
      </header>

      {/* Lecteur d'images */}
      <div className="image-viewer">
        <img 
          src={currentChapitre.episodes[currentPage].url} 
          alt={`Page ${currentPage + 1}`}
          loading="lazy"
        />
        
        <div className="page-controls">
          <button 
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            ←
          </button>
          
          <span>
            Page {currentPage + 1} / {currentChapitre.episodes.length}
          </span>
          
          <button 
            onClick={() => setCurrentPage(Math.min(currentChapitre.episodes.length - 1, currentPage + 1))}
            disabled={currentPage === currentChapitre.episodes.length - 1}
          >
            →
          </button>
        </div>
      </div>

      {/* Section commentaires */}
      <CommentsSection 
        bdName={bdName!}
        chapitreId={chapitreId!}
        comments={comments}
        onCommentsUpdate={setComments}
      />
    </div>
  );
};

export default BDReader;