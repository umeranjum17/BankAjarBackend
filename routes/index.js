const { Router } =require ('express');

const IbanController =require("../controller/IbanController");
const StaticController = require("../controller/StaticController")

const routes = new Router();

// routes
routes.get('/balance', IbanController.getBalance);
routes.get('/bank/:iban', IbanController.getIbanDetails);
routes.post('/transfer/:iban', IbanController.makeTransfer);

routes.get('/static/data-lookup/:country', StaticController.currencyLookUp);


module.exports = routes;
