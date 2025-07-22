const BaseController = require('./BaseController');

const service        = require('../services/CategorieService');
module.exports = new (class CategorieController extends BaseController 


    {
        


  constructor() { super(service); }
})();

// module.exports = new CategorieController();
