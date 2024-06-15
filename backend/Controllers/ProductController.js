const Product = require('../Models/ProductModel')


const createAd = async (req, res) => {
    try {
        let { name, description, price, tags, images, location} = req.body;
        if (!name || !description || !price || !location) {
            return res.status(400).json({ message:"Fill all the fields"});
        }

        price = parseInt(price);
        // extract user id from req.user
        const userId = req.user.user._id;
        const product = await Product.create({
            name,
            description,
            price,
            seller: userId,
            tags,
            images,
            location
        });
        if(!product) {
            return res.status(404).json({message: "Error while storing product"});
        }
        return res.status(201).json(product);
    } catch (error) {
        console.error("Error in createAd:", error);
        return res.status(500).json({ message: "Server error", error: error.toString() });
    }

}

const getProduct = async (req, res) => {
    try {
        const ad = await Product.findById(req.params.id).populate('seller', 'username email phoneNo');
        if (!ad) {
        return res.status(404).json({ message: "Ad not found" });
        }
        res.json(ad);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

}

const searchProduct = async(req, res) => {
    try{
        const {query} = req.query;
        // construct query string
        const searchQuery = {
            title: { $regex: query, $options: 'i'} // Case-insensitive search
        }
        // execute the search query to find matching blogs
        const blogs = await Blog.find(searchQuery).populate('author', 'username');
        return res.status(200).json(blogs)
    }
    catch(error){
        return res.status(500).json({ message: "Server error", error: error.message})
    }
}

const searchAds = async (req, res) => {
    const { query } = req.query;
    try {
        const ads = await Product.find({ name: {$regex: query, $options: "i"}});
        res.status(200).json(ads);
    } catch (error) {
        res.status(500).json({ message: "Error accessing the database", error: error.message });
    }
}

const editProduct = async (req, res) => {
    const { adId } = req.params;
    const { name, description, price, images, location } = req.body;
    const userId = req.user.user._id;

    if (!name || !description || !price || !location || images.length === 0) {
        return res.status(400).json({ message: "All fields including images are required" });
    }

    const product = await Product.findById(adId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    if (userId.toString() !== product.seller.toString()) {
        return res.status(403).json({ message: "User not authorized to edit this product" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(adId, {
            name, description, price, images, location
        }, { new: true }).populate('seller', 'username');

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { adId } = req.params;
        const userId = req.user.user._id;
        const product = await Product.findById(adId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (userId.toString() !== product.seller.toString()) {
            return res.status(403).json({ message: "User not authorized to delete this product" });
        }
        await Product.findByIdAndDelete(adId);
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


//     const getProducts = async (req, res) => {
//     try {
//         // Extract tags from query parameters and prepare a query condition if tags are provided
//         const tags = req.query.tags ? req.query.tags.split(',') : [];
//         const query = tags.length ? { tags: { $in: tags } } : {};

//         // Find products based on the query condition
//         const products = await Product.find(query);

//         // Check if any products were found
//         if (products.length > 0) {
//             return res.status(200).json({ products });
//         } else {
//             return res.status(404).json({ message: "No product ads found" });
//         }
//     } catch (error) {
//         console.error('Failed to fetch products:', error);
//         return res.status(500).json({ message: "Server error", error: error.message });
//     }
// };


const getProducts = async (req, res) => {
    try {
        const tags = req.query.tags ? req.query.tags.split(',') : [];
        const query = tags.length ? { tags: { $in: tags } } : {};

        const products = await Product.find(query);
        
        if (products.length > 0) {
            return res.status(200).json({ products });
        } else {
            const message = tags.length ? "No ads found related to your filter" : "No product ads found";
            return res.status(404).json({ message });
        }
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


    
const productsByTags = async(req, res) => {
        try{
            let { tags, page, limit } = req.query;
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const startIndex = (page - 1) * limit;
            // const lastIndex = (page) * limit;
            
            

            // and $in operator is used to find documents where tags field matches any of tags in the array
            const query = tags ? {tags: { $in: tags.split(',')}} : {};

            const totalBlogs = await Blog.countDocuments(query);
            const blogs = await Blog.find(query)
            .populate('author', 'username')
            .skip(startIndex)
            .limit(limit);

            const results = {
                totalBlogs: totalBlogs,
                pageCount: Math.ceil(totalBlogs / limit),
                blogs: blogs
            }

            return res.json(results)
        } catch (error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    const myProducts = async (req, res) => {
        // try {
        //     const userId = req.user.user._id;
        //     let query = { seller: userId };
            
        //     const products = await Product.find(query)
        //         .populate('seller', 'username email phoneNo');

        //     if (products.length > 0) {
        //         return res.status(200).json(products);
        //     } else {
        //         return res.status(404).json({ message: "No ads found" });
        //     }
        // } catch (error) {
        //     return res.status(500).json({ message: "Server error", error: error.message });
        // }
        try {
        const userId = req.user.user._id;
        const tags = req.query.tags ? req.query.tags.split(',') : [];
        const query = { seller: userId, ...(tags.length > 0 && { tags: { $in: tags } }) };

        const products = await Product.find(query).populate('seller', 'username email');

        if (products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ message: "No ads found related to your filter" });
        }
    } catch (error) {
        console.error('Failed to fetch my products:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
    };

module.exports = { createAd, getProduct, getProducts, editProduct, deleteProduct, searchProduct, productsByTags, myProducts, searchAds}