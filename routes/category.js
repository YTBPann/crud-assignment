const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// CREATE
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ (danh sách)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ (theo ID)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.isDeleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category || category.isDeleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.isDeleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    category.isDeleted = true;
    await category.save();
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;