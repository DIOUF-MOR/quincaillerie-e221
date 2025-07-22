const BaseController = require('./BaseController');
const service        = require('../services/FournisseurService');
module.exports = new (class FournisseurController extends BaseController {
  constructor() { super(service); }
})(); 