const express =  require('express');
const router = express.Router();
const { getProducts, deleteProduct, deleteSingleImage, updateProduct,saveProduct}  = require('../controllers/admin');

router.get('/admin/products',getProducts);
router.post('/product/store', saveProduct);
router.route('/admin/products/:productId').delete(deleteProduct).patch(updateProduct);
router.route('/admin/product_image_delete/:productId').patch(deleteSingleImage);
module.exports = router;