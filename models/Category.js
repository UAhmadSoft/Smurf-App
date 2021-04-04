const mongoose = require('mongoose');
const validator = require('validator');

const subCategorySchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true,
    trim: true,
  },

});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subCategories: [{ type: mongoose.Schema.Objectid, ref: 'SubCategory' }],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
