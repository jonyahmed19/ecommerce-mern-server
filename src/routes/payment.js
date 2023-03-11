const express = require('express');
const {requireSignin, isAdmin} = require("../middlewares/auth");
const {getToken, processPayment, orderStatus} = require("../controllers/payment");
const router = express.Router();


router.get("/braintree/token", getToken);
router.post("/braintree/payment", requireSignin, processPayment);
router.post("/order-status/:orderId", requireSignin, isAdmin, orderStatus);



module.exports = router;