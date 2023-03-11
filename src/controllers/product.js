const ProductModel = require('../models/product');
const CategoryModel = require("../models/category");
const slugify = require("slugify");
const fs = require("fs");

exports.create = async (req, res) => {
    try {
        const { title, description, price, category, quantity, shipping, photo, slug } = req.body;
        delete req.body._id;
        switch (true) {
            case !title.trim():
                return res.json({ error: "Product Title is required" });
            case !description.trim():
                return res.json({ error: "Description is required" });
            case !price.trim():
                return res.json({ error: "Price is required" });
            case !category.trim():
                return res.json({ error: "Category is required" });
            case !slug.trim():
                return res.json({ error: "Slug is required" });
            case !quantity:
                return res.json({ error: "Quantity is required" });
            case !photo:
                return res.json({ error: "Image should not be empty" });
        }

        const existingProduct = await ProductModel.findOne({ title });
        if (existingProduct) {
            return res.status(400).json({
                status: 'fail',
                data: "Product already exists"
            })
        }


        const product = new ProductModel({
            ...req.body,
            slug: slugify(slug || title)
        });
        // if (photo) {
        //     product.photo.data = fs.readFileSync(photo.path);
        //     product.photo.contentType = photo.type;
        // }
        await product.save();

        return res.status(200).json({
            status: 'success',
            data: product
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.read = async (req, res) => {
    try {
        const { slug } = req.params;



        const product = await ProductModel.findOne({ slug })
            .populate('category')

        return res.status(200).json({
            status: 'success',
            data: product
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.productbyId = async (req, res) => {
    try {

        const product = await ProductModel.findById(req.params.productId)
            .populate('category')

        return res.status(200).json({
            status: 'success',
            data: product
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.photo = async (req, res) => {
    try {
        const { productId } = req.params;

        const photo = await ProductModel.findOne({ _id: productId })
            .select('photo')

        return res.send(photo.photo)
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.list = async (req, res) => {
    try {
        const products = await ProductModel.find({  })
            .populate('category')
            .sort({createdAt: -1})

        return res.status(200).json({
            status: 'success',
            data: products
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.update = async (req, res) => {
    try {
        const { title, description, price, category, quantity, shipping, slug, photo } = req.body;
        delete req.body._id

        switch (true) {
            case !title.trim():
                return res.json({ error: "Product Title is required" });
            case !description.trim():
                return res.json({ error: "Description is required" });
            case !String(price):
                return res.json({ error: "Price is required" });
            case !category.trim():
                return res.json({ error: "Category is required" });
            case !String(quantity):
                return res.json({ error: "Quantity is required" });
            case !photo:
                return res.json({ error: "Photo is required" });
        }

        // update product
        const product = await ProductModel.findByIdAndUpdate(
            req.params.productId,
            {
                ...req.body,
                slug: slugify(slug || title),
            },
            { new: true }
        );

        await product.save()

       return  res.status(200).json({
            status: "success",
            data: product
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.remove = async (req, res) => {
    try {
        const productId = req.params.productId;

        const product = await ProductModel.findByIdAndDelete( productId )

        return res.status(200).json({
            status: 'success',
            data: product
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.productCount = async (req, res) => {
    try {
        const total = await ProductModel.find({} ).estimatedDocumentCount()
        return res.status(200).json({
            status: 'success',
            data: total
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.search = async (req, res) => {
    try {
        const {keyword} = req.params;

        const results = await ProductModel.find({
            $or: [
                {title: {$regex: keyword, $options: 'i'}},
                {description: { $regex: keyword, $options: 'i'}}
            ]
        }).select('-photo')

        return res.status(200).json({
            status: 'success',
            data: results
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.relatedProducts = async (req, res) => {
    try {
        const {productId, categoryId} = req.params;

        const products = await ProductModel.find({
            category: categoryId,
            _id: {$ne: productId}
        })
            .populate('category')
            .limit(4)

        return res.status(200).json({
            status: 'success',
            data: products
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.listProducts = async (req, res) => {
    try {
        console.log(req.params.page)
        const perPage = 12;
        const page = req.params.page ? req.params.page : 1;
        console.log('pageno', page )

        const products = await ProductModel.find({})
            .skip((page-1) * perPage)
            .limit(perPage)
            .sort({createdAt: -1})
        return res.status(200).json({
            status: 'success',
            data: products
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.filteredProducts = async (req, res) => {
    try {
        const {min, max} = req.body || {};

        const products = await ProductModel.aggregate([
             {$match:  { price: { $gte: min, $lte: max } }}
        ])


        return res.status(200).json({
            status: 'success',
            data: products
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};

