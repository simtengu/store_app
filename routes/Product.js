const express = require('express')
const router = express.Router();
const multer = require('multer');
const { searchProduct,fetchProducts, fetchRelatedProducts, fetchFilteredProducts, updateTrending } = require('../controllers/product');
const Product = require('../models/Product');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Math.round(Math.random() * 1000000) + file.originalname);
    }
})
const fileFilter = function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null, true)
    } else {
        cb(new Error("file type is invalid..(use .jpg, .png or .jpeg file) "))
    }

}
const upload = multer({ storage: storage, fileFilter: fileFilter , limits: { fileSize: 1024 * 1024 * 3 }});

router.post('/image/upload', upload.single('picha'), async (req, res) => {
    let { productId} = req.body;
    const product = await Product.findOne({ _id: productId })
    if (productId && product){

        const images = product.images;
        let newImg = "http://localhost:5000/"+req.file.path;
        let newImagesList = images.concat([newImg]);

        //updating the product(add image)............ 
        await Product.findOneAndUpdate({ _id: productId }, { images: newImagesList })
    }
    
    res.status(200).json({ path:req.file.path });

});

router.get('/products',fetchProducts);
router.get('/products/filtered', fetchFilteredProducts);
router.get('/products/related/:productId', fetchRelatedProducts);
router.patch('/products/trendingUpdate/:productId', updateTrending);
router.get('/products/search',searchProduct);





module.exports = router;