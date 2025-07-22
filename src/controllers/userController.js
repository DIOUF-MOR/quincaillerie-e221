const UserModel = require('../models/userModel');

class UserController {
  // Créer un utilisateur
  static async createUser(req, res) {
    try {
      const { email, username, password, firstName, lastName } = req.body;

      // Validation basique
      if (!email || !username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email, nom d\'utilisateur et mot de passe requis'
        });
      }

      const newUser = await UserModel.create({
        email,
        username,
        password,
        firstName,
        lastName
      });

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: newUser
      });

    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      
      // Gestion des erreurs PostgreSQL
      if (error.code === '23505') { // Violation de contrainte unique
        return res.status(409).json({
          success: false,
          message: 'Email ou nom d\'utilisateur déjà existant'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir tous les utilisateurs
  static async getUsers(req, res) {
    try {
      const { page, limit, search } = req.query;
      
      const result = await UserModel.findAll({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search: search || ''
      });

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Erreur récupération utilisateurs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir un utilisateur par ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID utilisateur invalide'
        });
      }

      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID utilisateur invalide'
        });
      }

      // Retirer les champs non autorisés
      delete updates.id;
      delete updates.password_hash;
      delete updates.created_at;

      const updatedUser = await UserModel.update(id, updates);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: updatedUser
      });

    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID utilisateur invalide'
        });
      }

      const deletedUser = await UserModel.delete(id);

      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });

    } catch (error) {
      console.error('Erreur suppression utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}

module.exports = UserController;