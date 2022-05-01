const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/authentication')
const {getUsers, updateUserDetails,getAuthUser,getWishlist, removeWishlistItem, addWishlist } = require('../controllers/user');

router.get('/users', getUsers);
router.patch('/user/:id', updateUserDetails);
router.route('/user').get(getAuthUser);
router.route('/wishlist').get(getWishlist).post(addWishlist);
router.patch('/wishlist/:productId',removeWishlistItem);

module.exports = router;