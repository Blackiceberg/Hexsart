import express from 'express';
import Comment from '../models/Comment.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/comments - Récupérer les commentaires d'un chapitre
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { bd, chapitre, page, limit = 20, sort = '-date' } = req.query;

        if (!bd || !chapitre) {
            return res.status(400).json({
                error: 'Les paramètres "bd" et "chapitre" sont requis.'
            });
        }

        // Construction de la query
        let query = { bdName: bd, chapitreId: chapitre };
        
        // Les utilisateurs non authentifiés ne voient que les commentaires approuvés
        if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderateur')) {
            query.approuve = true;
        }

        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit),
            sort,
            collation: { locale: 'fr' } // Pour le tri sensible à la locale
        };

        const comments = await Comment.find(query)
            .sort(options.sort)
            .limit(options.limit)
            .skip((options.page - 1) * options.limit)
            .lean();

        const total = await Comment.countDocuments(query);

        res.json({
            comments,
            pagination: {
                page: options.page,
                limit: options.limit,
                total,
                pages: Math.ceil(total / options.limit)
            }
        });

    } catch (error) {
        console.error('Erreur récupération commentaires:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des commentaires.' 
        });
    }
});

// POST /api/comments - Ajouter un commentaire
router.post('/', authenticate, async (req, res) => {
    try {
        const { bdName, chapitreId, contenu, page } = req.body;

        // Validation
        if (!bdName || !chapitreId || !contenu) {
            return res.status(400).json({
                error: 'Les champs "bdName", "chapitreId" et "contenu" sont requis.'
            });
        }

        if (contenu.length < 5) {
            return res.status(400).json({
                error: 'Le commentaire doit contenir au moins 5 caractères.'
            });
        }

        // Les admins et modérateurs ont leurs commentaires approuvés automatiquement
        const isAutoApproved = req.user.role === 'admin' || req.user.role === 'moderateur';

        const newComment = new Comment({
            auteur: req.user.username,
            contenu: contenu.trim(),
            bdName,
            chapitreId,
            page: page || 0,
            approuve: isAutoApproved,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        await newComment.save();

        // Populer les données pour la réponse
        const commentWithDetails = await Comment.findById(newComment._id).lean();

        res.status(201).json({
            message: isAutoApproved 
                ? 'Commentaire publié avec succès.' 
                : 'Commentaire soumis. Il sera visible après modération.',
            comment: commentWithDetails
        });

    } catch (error) {
        console.error('Erreur création commentaire:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                error: 'Données invalides', 
                details: errors 
            });
        }

        res.status(500).json({ 
            error: 'Erreur lors de la création du commentaire.' 
        });
    }
});

// PATCH /api/comments/:id/approve - Approuver un commentaire
router.patch('/:id/approve', authenticate, authorize('admin', 'moderateur'), async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            { approuve: true },
            { new: true, runValidators: true }
        );

        if (!comment) {
            return res.status(404).json({ 
                error: 'Commentaire non trouvé.' 
            });
        }

        res.json({
            message: 'Commentaire approuvé avec succès.',
            comment
        });

    } catch (error) {
        console.error('Erreur approbation commentaire:', error);
        res.status(500).json({ 
            error: 'Erreur lors de l\'approbation du commentaire.' 
        });
    }
});

// DELETE /api/comments/:id - Supprimer un commentaire
router.delete('/:id', authenticate, authorize('admin', 'moderateur'), async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);

        if (!comment) {
            return res.status(404).json({ 
                error: 'Commentaire non trouvé.' 
            });
        }

        res.json({ 
            message: 'Commentaire supprimé avec succès.' 
        });

    } catch (error) {
        console.error('Erreur suppression commentaire:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la suppression du commentaire.' 
        });
    }
});

// GET /api/comments/stats - Statistiques des commentaires
router.get('/stats', authenticate, authorize('admin', 'moderateur'), async (req, res) => {
    try {
        const stats = await Comment.getStats();
        
        // Commentaires récents (7 derniers jours)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recentStats = await Comment.aggregate([
            {
                $match: {
                    date: { $gte: oneWeekAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json({
            ...stats,
            recentComments: recentStats
        });

    } catch (error) {
        console.error('Erreur récupération stats:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des statistiques.' 
        });
    }
});

export default router;