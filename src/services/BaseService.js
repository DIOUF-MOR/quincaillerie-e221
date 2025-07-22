class BaseService {
    constructor(model) { this.model = model; }
  
  //recuperer tous les donnees
    async getAll() {
      return this.model.findMany({ where: { deletedAt: null } });
    }
  
  //recuperer une donnee par id
    async getById(id) {
      return this.model.findUnique({ where: { id } });
    }
  
  
    async create(data) {
      return this.model.create({ data });
    }
  
    //modifier une donnee
    async update(id, data) {
      return this.model.update({ where: { id }, data });
    }
  
   
    async softDelete(id) {
      return this.model.update({
        where: { id },
        data: { deletedAt: new Date() }
      });
    }
  }
  
  
  module.exports = BaseService;
  