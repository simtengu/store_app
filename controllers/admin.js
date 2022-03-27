const Product = require('../models/Product')
const User = require('../models/User')
const fs = require('fs')
const {
    UnAuthenticatedError, NotFoundError
} = require('../errors');

//fetch all products ............................... 
const getProducts = async (req, res) => {
    const user_id = req.user.userId;
    //authenticated user 
    const user = await User.findById(user_id);

    if (!user.isAdmin === true) {
        throw new UnAuthenticatedError("Authorization error...the resource is only for admins")
    }


    const products = await Product.find({});
    res.status(200).json({ products });

}

const saveProduct = async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
}

const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findOne({ _id: productId })
    if (!product) {
         throw new NotFoundError('the product was not found');
        return;
    }
    const images = product.images;
    //deleting product images................
    if (images.length > 0) {
        
        images.forEach(img => {
            let imgArray = img.split('/');
            let path = imgArray[imgArray.length - 1];
    
            fs.unlink(path, (err => {
                if (err) { throw err } 
            }))
    
        });
    }
    //deleting the product............ 
    await Product.findOneAndRemove({_id:productId})
    res.status(200).json({ status: 'deleted' })
}

const deleteSingleImage = async (req, res) => {
    const { productId } = req.params;
    const {image} = req.body;
    console.log(image);
    const product = await Product.findOne({ _id: productId })
    if (!product) {
        throw new NotFoundError('the product was not found');
        return;
    }
    const images = product.images;
    //deleting product image................
    if (images.length > 0) {
      
            let imgArray = image.split('/');
            let path = imgArray[imgArray.length - 1];

            fs.unlink(path, (err => {
                if (err) { throw err }
            }))
     
    }
    let newImagesList = images.filter(img=> img !== image);

    //updating the product(rm deleted image)............ 
   let updatedProduct = await Product.findOneAndUpdate({ _id: productId },{images:newImagesList},{returnDocument:"after"})
    res.status(200).json({ status: 'updated',product:updatedProduct })
}

const updateProduct = async (req,res)=>{

    const {productId} = req.params;
    const updatedItem = await Product.findOneAndUpdate({_id:productId},req.body,{returnDocument:"after"});
   if (!updatedItem) {
       
       throw new NotFoundError("The product wasn't found")
    }
res.status(200).json({ status: 'updated',product:updatedItem });

 
}
module.exports = {
    getProducts, saveProduct, deleteProduct, deleteSingleImage, updateProduct
}