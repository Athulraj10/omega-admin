const Category = require("../../models/category");
const Product = require("../../models/product");
const Response = require("../../services/Response");

// Get all categories with pagination and filters
const getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Get categories with pagination
    const categories = await Category.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalCategories = await Category.countDocuments(filter);

    // Get product count for each category
    const categoriesWithProductCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ category: category._id });
        
        return {
          id: category._id,
          name: category.name,
          description: category.description,
          status: category.status === '1' ? 'active' : 'inactive',
          productCount,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        };
      })
    );

    return Response.success(res, {
      categories: categoriesWithProductCount,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCategories / limit),
        totalCategories,
        hasNextPage: skip + categories.length < totalCategories,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.error(res, 'Failed to fetch categories', 500);
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    if (!category) {
      return Response.error(res, 'Category not found', 404);
    }

    // Get product count
    const productCount = await Product.countDocuments({ category: category._id });

    const categoryData = {
      id: category._id,
      name: category.name,
      description: category.description,
      status: category.status === '1' ? 'active' : 'inactive',
      productCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };

    return Response.success(res, categoryData);

  } catch (error) {
    console.error('Error fetching category:', error);
    return Response.error(res, 'Failed to fetch category details', 500);
  }
};

// Create new category
const createCategory = async (req, res) => {
  try {
    const { name, description, status = '1' } = req.body;

    // Validate required fields
    if (!name) {
      return Response.error(res, 'Category name is required', 400);
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return Response.error(res, 'Category with this name already exists', 400);
    }

    const category = new Category({
      name: name.trim(),
      description: description?.trim() || '',
      status
    });

    await category.save();

    const categoryData = {
      id: category._id,
      name: category.name,
      description: category.description,
      status: category.status === '1' ? 'active' : 'inactive',
      productCount: 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };

    return Response.success(res, categoryData, 'Category created successfully', 201);

  } catch (error) {
    console.error('Error creating category:', error);
    return Response.error(res, 'Failed to create category', 500);
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return Response.error(res, 'Category not found', 404);
    }

    // Check if name is being changed and if it already exists
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: id }
      });
      if (existingCategory) {
        return Response.error(res, 'Category with this name already exists', 400);
      }
    }

    // Update fields
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Get product count
    const productCount = await Product.countDocuments({ category: updatedCategory._id });

    const categoryData = {
      id: updatedCategory._id,
      name: updatedCategory.name,
      description: updatedCategory.description,
      status: updatedCategory.status === '1' ? 'active' : 'inactive',
      productCount,
      createdAt: updatedCategory.createdAt,
      updatedAt: updatedCategory.updatedAt
    };

    return Response.success(res, categoryData, 'Category updated successfully');

  } catch (error) {
    console.error('Error updating category:', error);
    return Response.error(res, 'Failed to update category', 500);
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return Response.error(res, 'Category not found', 404);
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return Response.error(res, `Cannot delete category. It has ${productCount} product(s) associated with it.`, 400);
    }

    await Category.findByIdAndDelete(id);

    return Response.success(res, null, 'Category deleted successfully');

  } catch (error) {
    console.error('Error deleting category:', error);
    return Response.error(res, 'Failed to delete category', 500);
  }
};

// Update category status
const updateCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['0', '1'].includes(status)) {
      return Response.error(res, 'Invalid status value', 400);
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!category) {
      return Response.error(res, 'Category not found', 404);
    }

    // Get product count
    const productCount = await Product.countDocuments({ category: category._id });

    const categoryData = {
      id: category._id,
      name: category.name,
      description: category.description,
      status: category.status === '1' ? 'active' : 'inactive',
      productCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };

    return Response.success(res, categoryData, 'Category status updated successfully');

  } catch (error) {
    console.error('Error updating category status:', error);
    return Response.error(res, 'Failed to update category status', 500);
  }
};

// Get all active categories (for dropdowns)
const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: '1' })
      .select('name description')
      .sort({ name: 1 });

    const categoryList = categories.map(category => ({
      id: category._id,
      name: category.name,
      description: category.description
    }));

    return Response.success(res, categoryList);

  } catch (error) {
    console.error('Error fetching active categories:', error);
    return Response.error(res, 'Failed to fetch categories', 500);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  getActiveCategories
}; 