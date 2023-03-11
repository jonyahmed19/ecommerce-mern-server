const express = require('express');
const {requireSignin, isAdmin} = require("../middlewares/auth");
const {create, read, update, remove, list, productsByCategory, readbyId} = require("../controllers/category");
const router = express.Router();


router.post('/categoryCreate', requireSignin, isAdmin, create);
router.get('/category/:slug', read);
router.get('/categorybyId/:id', readbyId);
router.post('/categoryUpdate/:categoryId', requireSignin, isAdmin, update);
router.delete('/category/:categoryId', requireSignin, isAdmin, remove);
router.get('/categories', list);
router.get("/products-by-category/:slug", productsByCategory);







module.exports = router;