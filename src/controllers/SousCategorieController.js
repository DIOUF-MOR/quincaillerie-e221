const BaseController = require('./BaseController');
const service        = require('../services/SousCategorieService');
module.exports = new (class SousCategorieController extends BaseController {
  constructor() { super(service); }
})();


// module.exports = new SousCategorieService();
