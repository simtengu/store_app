const User = require('../models/User')
const {
    BadRequestError,
    NotFoundError,
    UnAuthenticatedError
} = require('../errors');
const Wishlist = require('../models/Wishlist');

//fetch all users ............................... 
const getUsers = async (req, res) => {
    const user_id = req.user.userId;
    //authenticated user 
    const user = await User.findById(user_id);

    if (!user.isAdmin === true) {
        throw new UnAuthenticatedError("Authorization error...the resource is only for admins")
    }

    try {
        const users = await User.find({}).select("-password");
        res.status(200).json({ usersCount: users.length, users });
    } catch (error) {
        throw new Error('something went wrong....')
    }
}

//fetch auth user................. 
const getAuthUser = async (req, res) => {
    const user_id = req.user.userId;
    //authenticated user 
    try {
        const user = await User.findById(user_id).select('-password');
        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json({ user });


    } catch (error) {
        throw new Error("something went wrong")

    }
}

const updateUserDetails = async (req, res) => {
    //userid from  request params
    const { id } = req.params;
    //userid from  auth middleware
    const auth_user_id = req.user.userId;
    if (id !== auth_user_id) {
        throw new UnAuthenticatedError('authentication error .. you can only update your details')
    }
    

        const user = await User.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json({ status: 'success', user });
       
    
}

const addWishlist = async (req,res)=>{
    const user_id = req.user.userId;
    const data = await Wishlist.findOne({owner:user_id}); 
    if(data){
        let wishlist = data.wishlist;
        wishlist.push(req.body);
        await Wishlist.findOneAndUpdate({owner:user_id},{wishlist})
    }else{
        await Wishlist.create({owner:user_id,wishlist:[req.body]})
    }

    const rsData = await Wishlist.findOne({owner:user_id}); 

    res.status(201).json({status:'item saved in wishlist',wishlist:rsData})
}

const removeWishlistItem = async (req, res) => {
    const user_id = req.user.userId;
    const item_id = req.params.productId;
    const data = await Wishlist.findOne({owner:user_id});
    let wishlist = data.wishlist;
    let updatedWishlist = wishlist.filter(item=>item._id !== item_id)
   let updatedData =  await Wishlist.findOneAndUpdate({ owner: user_id }, { wishlist:updatedWishlist },{new:true});
    res.status(200).json({ wishlist: updatedData });
}

const getWishlist = async(req,res)=>{
    const user_id = req.user.userId;
    const data = await Wishlist.findOne({owner:user_id});
    res.status(200).json({wishlist:data});
}

module.exports = {
    getUsers, updateUserDetails, getAuthUser, getWishlist,addWishlist,removeWishlistItem
}