const Product = require('../models/Product');


const fetchProducts = async (req, res) => {
    const {page} = req.query;
    let limit = 16;
    let skip = (page - 1) * limit;
    const items = await Product.find({});
    const products = await Product.find({}).sort('-createdAt').skip(skip).limit(limit);
    res.status(200).json({ products,count:items.length });
}


const fetchRelatedProducts = async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    console.log(product);
    if (product) {
        const products = await Product.find({ _id: { $ne: productId }, category: product.category, brand: product.brand });
        const products1 = await Product.find({ brand: { $ne: product.brand }, category: product.category });
        let relatedProducts = products.concat(products1);
        res.status(200).json({ relatedProducts, product });
    }
}

const fetchFilteredProducts = async (req,res)=>{
    const {category,tag,sort,brand,range,greater,less} = req.query;
    //pagination information.... 
    let  filterObject = {};
    if (greater) {
        filterObject.price = {$gte:greater};
    }
    if (less) {
        filterObject.price = { $lte:less };
    }
    if (range) {
        let rangeArray = range.split(',');
        filterObject.price = { $gte: Number(rangeArray[0]),$lte: Number(rangeArray[1]) };
    }
    if(category){
        filterObject.category = category;
    }
    if (brand) {
        filterObject.brand = brand;
    }

    if (tag) {
        const allTags = tag.split(',');
        filterObject.tags = { $in: allTags };
    }

    let products;
    if (sort) {
        let sortBy;
        if(sort === "latest"){ sortBy = '-createdAt'}
        if(sort === "old"){ sortBy = 'createdAt'}
        if(sort === "cheap"){ sortBy = 'price'}
        if(sort === "expensive"){ sortBy = '-price'}
        if(sort === "category"){ sortBy = 'category'}
        if(sort === "brand"){
             sortBy = 'brand'
            }
        if (sort === "trending") {
            sortBy = '-monthlyViews';
          
            products = await Product.find({}).sort(sortBy).limit(5);
            res.status(200).json({ products });
            return;
        }
        
      
        products = await Product.find(filterObject).sort(sortBy);
         res.status(200).json({ products});
         
        }else{
            
            products = await Product.find(filterObject);
            res.status(200).json({ products});
            
        }
        
        
    }
    
    const updateTrending = async (req,res)=>{
        const {productId} = req.params;
        const product = await Product.findById(productId);
        await Product.findByIdAndUpdate(productId, { monthlyViews:product.monthlyViews+1});
        let products = await Product.find({}).sort("-monthlyViews").limit(5);
        res.status(200).json({products});

}



module.exports = { fetchProducts, fetchRelatedProducts, fetchFilteredProducts, updateTrending };