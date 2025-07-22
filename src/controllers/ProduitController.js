const BaseController = require('./BaseController');
const service        = require('../services/ProduitService');
module.exports = new (class ProduitController extends BaseController 


    {
        
  constructor() { super(service); }
})();


// module.exports = new ProduitService();
