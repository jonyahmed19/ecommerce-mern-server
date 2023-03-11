const express = require("express");
const router = express.Router();
const AuthController = require('../controllers/user');
const {requireSignin, isAdmin} = require('../middlewares/auth');



/**
 * Health Check
 */
router.get("/health", AuthController.healthCheck);


/**
 * User Authentication
 */

router.post('/register', AuthController.registration)
router.post('/login', AuthController.login);
router.get("/auth-check", requireSignin, (req, res) => {
    res.json({ ok: true });
});
router.get("/admin-check", requireSignin, isAdmin, (req, res) => {
    res.json({ ok: true });
});
router.put('/profile', requireSignin , AuthController.profileUpdate);
router.get('/profileDetails', requireSignin , AuthController.profileDetails);
router.get("/secret", requireSignin, isAdmin, AuthController.secret);


/***
 * Reset Password
 */
router.get('/recoverVerifyEmail/:email', AuthController.recoverVerifyEmail)
router.get('/recoverVerifyOTP/:email/:otp', AuthController.recoverVerifyOTP)
router.post('/recoverResetPass', AuthController.recoverResetPass)


module.exports = router;
