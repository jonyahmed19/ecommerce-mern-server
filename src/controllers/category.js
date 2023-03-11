const CategoryModel = require('../models/category');
const ProductModel = require('../models/product');
const slugify = require('slugify');


exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name.trim()) {
            return res.status(400).json({
                status: 'fail',
                data: "Category Name is required"
            })
        }
        const existingCategory = await CategoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                status: 'fail',
                data: "Category Name already exists"
            })
        }

        const category = await CategoryModel.create({ name, slug: slugify(name) });

        return res.status(200).json({
            status: 'success',
            data: category
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
        const { name } = req.body;
        const {categoryId} = req.params;

        if (!name.trim()) {
            return res.status(400).json({
                status: 'fail',
                data: "Category Name is required"
            })
        }
        const category = await CategoryModel.findByIdAndUpdate(categoryId,
            {
                name,
                slug: slugify(name)
                },
            { new: true }
            );
            return res.status(200).json({
                status: 'success',
                data: category
            })

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.list = async (req, res) => {
    try {
        const categories  = await CategoryModel.find({})

        return res.status(200).json({
            status: 'success',
            data: categories
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

        const category  = await CategoryModel.aggregate([
            {$match: {slug: req.params.slug}}
        ])

        if(category){
            return res.status(200).json({
                status: 'success',
                data: category
            })
        }

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.readbyId = async (req, res) => {
    try {

        const category  = await CategoryModel.findById(req.params.id)

        if(category){
            return res.status(200).json({
                status: 'success',
                data: category
            })
        }

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.remove = async (req, res) => {
    try {
        const removed  = await CategoryModel.findByIdAndDelete(req.params.categoryId)

        if(removed){
            return res.status(200).json({
                status: 'success',
                data: removed
            })
        }else {
            res.status(400).json({
                status: 'fail',
                data: "failed to delete"
            })
        }

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
exports.productsByCategory = async (req, res) => {
    try {
        const category  = await CategoryModel.aggregate([
            {$match: {slug: req.params.slug}}
        ]);
        const products  = await ProductModel.find({category}).populate('category')

        return res.status(200).json({
            status: 'success',
            data: {
                category,
                products
            }
        })

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data: err
        })
    }
};
