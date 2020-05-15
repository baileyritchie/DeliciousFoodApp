const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const {catchErrors} = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add', 
    storeController.upload, 
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore));
router.post('/add/:id', 
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

router.get('/store/:slug',
catchErrors(storeController.getStorebySlug)
);

router.get('/tags',catchErrors(storeController.getStoresbyTag));
router.get('/tags/:tag',catchErrors(storeController.getStoresbyTag));

router.get('/login',userController.loginForm);
router.get('/register',userController.registerForm);
//1.validate regis data
//2. actually register user
//3. log them in

router.post('/register',
    userController.validateRegister,
    userController.register,
    authController.login);

module.exports = router;
