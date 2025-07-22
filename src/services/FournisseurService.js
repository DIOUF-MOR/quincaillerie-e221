const prisma = require('../config/database');
const BaseService = require('./BaseService');

class FournisseurService extends BaseService {
  constructor() { super(prisma.user); }

  async getAll() {
    return this.model.findMany({ where: { role: 'fournisseur', deletedAt: null } });
  }

  async getById(id) {
    return this.model.findUnique({ where: { id, role: 'fournisseur' } });
  }

  async create(data) {
    // On force le rôle fournisseur
    data.role = 'fournisseur';
    // Ici, il faudrait hasher le mot de passe comme dans AuthService
    const bcrypt = require('bcrypt');
    data.password = await bcrypt.hash(data.password, 10);
    return this.model.create({ data });
  }

  // async update(id, data) {
  //   if (data.password) {
  //     const bcrypt = require('bcrypt');
  //     data.password = await bcrypt.hash(data.password, 10);
  //   }
  //   return this.model.update({ where: { id, role: 'fournisseur' }, data });
  // }

  async update(id, data) {
    if (data.password) {
      const bcrypt = require('bcrypt');
      data.password = await bcrypt.hash(data.password, 10);
    }
  
    const fournisseur = await this.model.findUnique({ where: { id } });
    if (!fournisseur || fournisseur.role !== 'fournisseur') {
      throw new Error("Fournisseur introuvable");
    }
  
    return this.model.update({ where: { id }, data });
  }
  

  async softDelete(id) {
    return this.model.update({
      where: { id, role: 'fournisseur' },
      data: { deletedAt: new Date() }
    });
  }
}

module.exports = new FournisseurService(); 