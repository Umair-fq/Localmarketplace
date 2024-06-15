const express = require('express');
const { loginUser, registerUser, addToFavorites, getUserFavoriteAds, removeFromFavorites } = require('../Controllers/UserController');
const { authenticateToken } = require('../Middlewares/Auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/addToFav/:adId', authenticateToken, addToFavorites)
router.put('/remFromFav/:adId', authenticateToken, removeFromFavorites)
router.get('/favAds', authenticateToken, getUserFavoriteAds)


module.exports = router;