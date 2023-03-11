const express = require('express');
const formidable = require('express-formidable')
const {requireSignin, isAdmin} = require("../middlewares/auth");
const {
    create,
    read,
    list,
    update,
    remove,
    photo,
    productCount,
    search,
    relatedProducts,
    listProducts,
    filteredProducts,
    productbyId
} = require("../controllers/product");
const router = express.Router();

router.post('/createProduct', requireSignin, isAdmin, create);
router.get('/product/:slug', read);
router.get('/productbyId/:productId', productbyId);
router.get('/product/photo/:productId', photo);
router.get('/products', list);
router.post('/updateProducts/:productId', requireSignin, isAdmin, update);
router.delete('/product/:productId', requireSignin, isAdmin, remove);
router.get('/product-count', productCount);
router.get('/products/search/:keyword', search);
router.get('/related-products/:productId/:categoryId', relatedProducts);
router.get('/list-products/:page', listProducts);
router.post('/filtered-products', filteredProducts);





module.exports = router;