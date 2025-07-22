class BaseController {
    constructor(service) {
      this.service = service;
      this.getAll = this.getAll.bind(this);
      this.getById = this.getById.bind(this);
      this.create = this.create.bind(this);
      this.update = this.update.bind(this);
      this.delete = this.delete.bind(this);
    }
  
  
    async getAll(req, res, next) 
    {
      try { res.json(await this.service.getAll()); }
      catch (e) { next(e); }
    }
  
  
    async getById(req, res, next)
     {
      try {
        const item = await this.service.getById(+req.params.id);
        if (!item) return res.status(404).json({ error: 'Introuvable' });
        res.json(item);
      } catch (e) { next(e); }
    }
  
  
    async create(req, res, next) 
   
    {
      try { res.status(201).json(await this.service.create(req.body)); }
      catch (e) { next(e); }
    }
  
  
    async update(req, res, next) 
    {
      try { res.json(await this.service.update(+req.params.id, req.body)); }
      catch (e) { next(e); }
    }
  
  
    async delete(req, res, next) 
    {
      try {
        await this.service.softDelete(+req.params.id);
        res.status(204).send();
      } catch (e) { next(e); }
    }
  }
  
  
  module.exports = BaseController;
  