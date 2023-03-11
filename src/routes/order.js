const express = require('express');
const {requireSignin, isAdmin} = require("../middlewares/auth");
const {getOrders, allOrders} = require("../controllers/order");
const router = express.Router();

router.get('/orders', requireSignin, getOrders )
router.get('/all-orders', requireSignin, isAdmin, allOrders )






module.exports = router;