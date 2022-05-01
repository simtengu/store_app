const express = require('express')
const router = express.Router();
const { searchProduct, fetchProducts, fetchRelatedProducts, fetchFilteredProducts, updateTrending } = require('../controllers/product');
const Product = require('../models/Product');
const upload = require("../utils/multer")
const cloudinary = require("../utils/cloudinary")

router.post('/image/upload', upload.single('picha'), async (req, res) => {
    let { productId } = req.body;
    
    const rs = await cloudinary.uploader.upload(req.file.path);
    const newImg = {
        image: rs.secure_url,
        image_id: rs.public_id
    }
    if (productId) {

        //updating the product(add image)............ 
        await Product.findOneAndUpdate({ _id: productId }, { $push: { images: newImg } })
    }

    res.status(200).json({ image:newImg });

});

router.get('/products', fetchProducts);
router.get('/products/filtered', fetchFilteredProducts);
router.get('/products/related/:productId', fetchRelatedProducts);
router.patch('/products/trendingUpdate/:productId', updateTrending);
router.get('/products/search', searchProduct);





module.exports = router;