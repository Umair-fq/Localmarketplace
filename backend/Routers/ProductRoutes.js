const express = require('express');
const { authenticateToken } = require('../Middlewares/Auth');
const { createAd, productsByTags, myProducts, editProduct, deleteProduct, getProduct, getProducts, searchAds } = require('../Controllers/ProductController');
const router = express.Router();

router.post('/create', authenticateToken, createAd);
// router.get('/all', getAllBlogs)
router.get('/search', searchAds)
router.get('/allads', getProducts)
router.get('/bytags', productsByTags)
router.get('/myproducts', authenticateToken, myProducts)
router.get('/details/:id', getProduct);
router.put('/update/:adId', authenticateToken, editProduct)
router.delete('/delete/:adId', authenticateToken, deleteProduct)
module.exports = router;