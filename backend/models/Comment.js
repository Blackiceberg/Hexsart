import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    auteur: {
        type: String,
        required: [true, 'Le nom de l\'auteur est requis'],
        trim: true,
        maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },
    contenu: {
        type: String,
        required: [true, 'Le contenu du commentaire est requis'],
        trim: true,
        minlength: [5, 'Le commentaire doit contenir au moins 5 caractères'],
        maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
    },
    bdName: {
        type: String,
        required: [true, 'Le nom de la BD est requis'],
        trim: true
    },
    chapitreId: {
        type: String,
        required: [true, 'L\'ID du chapitre est requis'],
        trim: true
    },
    page: {
        type: Number,
        min: 0
    },
    approuve: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        select: false // Ne pas retourner par défaut
    },
    userAgent: {
        type: String,
        select: false
    }
}, {
    timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

// Index pour les performances
commentSchema.index({ bdName: 1, chapitreId: 1, date: -1 });
commentSchema.index({ approuve: 1, date: -1 });

// Méthode pour formater la date
commentSchema.methods.getFormattedDate = function() {
    return this.date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Méthode statique pour les stats
commentSchema.statics.getStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalComments: { $sum: 1 },
                pendingComments: { 
                    $sum: { $cond: [{ $eq: ['$approuve', false] }, 1, 0] } 
                },
                approvedComments: { 
                    $sum: { $cond: [{ $eq: ['$approuve', true] }, 1, 0] } 
                }
            }
        }
    ]);
    
    return stats[0] || { totalComments: 0, pendingComments: 0, approvedComments: 0 };
};

export default mongoose.model('Comment', commentSchema);