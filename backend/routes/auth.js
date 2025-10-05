import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/login - Connexion
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Le nom d\'utilisateur et le mot de passe sont requis.'
            });
        }

        // Recherche de l'utilisateur avec le mot de passe
        const user = await User.findOne({ username }).select('+password');
        
        if (!user || !user.actif) {
            return res.status(401).json({
                error: 'Identifiants incorrects.'
            });
        }

        // Vérification du mot de passe
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Identifiants incorrects.'
            });
        }

        // Mise à jour de la dernière connexion
        user.lastLogin = new Date();
        await user.save();

        // Génération du token JWT
        const token = jwt.sign(
            { 
                userId: user._id, 
                username: user.username,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Connexion réussie.',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erreur connexion:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la connexion.' 
        });
    }
});

// GET /api/auth/me - Récupérer l'utilisateur connecté
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Non authentifié.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user || !user.actif) {
            return res.status(401).json({ 
                error: 'Utilisateur non trouvé ou désactivé.' 
            });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('Erreur vérification auth:', error);
        res.status(401).json({ 
            error: 'Token invalide.' 
        });
    }
});

export default router;