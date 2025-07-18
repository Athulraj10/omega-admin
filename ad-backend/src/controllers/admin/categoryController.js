const Category = require("../../models/category");
const Product = require("../../models/product");
const Response = require("../../services/Response");

// Get all categories with pagination and filters
const getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "", type = "all" } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (type === 'main') {
      filter.isMainCategory = true;
      filter.parentCategory = null;
    } else if (type === 'sub') {
      filter.parentCategory = { $ne: null };
    }

    // Get categories with pagination
    const categories = await Category.find(filter)
      .populate('parentCategory', 'name')
      .populate('subcategories', 'name status')
      .sort({ sortOrder: 1, createdAt: -1 })
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
          icon: category.icon,
          parentCategory: category.parentCategory,
          subcategories: category.subcategories,
          isMainCategory: category.isMainCategory,
          sortOrder: category.sortOrder,
          status: category.status === '1' ? 'active' : 'inactive',
          productCount,
          image: category.image,
          slug: category.slug,
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

// Get hierarchical categories (main categories with subcategories and products)
const getHierarchicalCategories = async (req, res) => {
  try {
    const mainCategories = await Category.find({ 
      isMainCategory: true, 
      status: '1',
      parentCategory: null 
    })
    .populate({
      path: 'subcategories',
      match: { status: '1' },
      select: 'name description icon slug productCount',
      populate: {
        path: 'productsCount',
        select: 'name'
      }
    })
    .sort({ sortOrder: 1, name: 1 });

    const hierarchicalData = await Promise.all(
      mainCategories.map(async (mainCategory) => {
        const productCount = await Product.countDocuments({ category: mainCategory._id });
        
        // Get subcategories with their products
        const subcategoriesWithProducts = await Promise.all(
          mainCategory.subcategories.map(async (sub) => {
            const products = await Product.find({ category: sub._id })
              .select('name description price')
              .limit(10) // Limit to 10 products per subcategory
              .sort({ createdAt: -1 });
            
            return {
              id: sub._id,
              name: sub.name,
              description: sub.description,
              icon: sub.icon,
              slug: sub.slug,
              productCount: sub.productsCount || 0,
              products: products.map(product => ({
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price
              }))
            };
          })
        );
        
        return {
          id: mainCategory._id,
          name: mainCategory.name,
          description: mainCategory.description,
          icon: mainCategory.icon,
          slug: mainCategory.slug,
          productCount,
          subcategories: subcategoriesWithProducts
        };
      })
    );

    return Response.success(res, hierarchicalData);

  } catch (error) {
    console.error('Error fetching hierarchical categories:', error);
    return Response.error(res, 'Failed to fetch hierarchical categories', 500);
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id)
      .populate('parentCategory', 'name')
      .populate('subcategories', 'name status');
      
    if (!category) {
      return Response.error(res, 'Category not found', 404);
    }

    // Get product count
    const productCount = await Product.countDocuments({ category: category._id });

    const categoryData = {
      id: category._id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      parentCategory: category.parentCategory,
      subcategories: category.subcategories,
      isMainCategory: category.isMainCategory,
      sortOrder: category.sortOrder,
      status: category.status === '1' ? 'active' : 'inactive',
      productCount,
      image: category.image,
      slug: category.slug,
      metaTitle: category.metaTitle,
      metaDescription: category.metaDescription,
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
    const { 
      name, 
      description, 
      icon = 'grid',
      parentCategory,
      isMainCategory = false,
      sortOrder = 0,
      status = '1',
      image,
      metaTitle,
      metaDescription
    } = req.body;

    // Validate required fields
    if (!name) {
      return Response.error(res, 'Category name is required', 400);
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return Response.error(res, 'Category with this name already exists', 400);
    }

    // Validate parent category if provided
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return Response.error(res, 'Parent category not found', 400);
      }
    }

    const category = new Category({
      name: name.trim(),
      description: description?.trim() || '',
      icon,
      parentCategory: parentCategory || null,
      isMainCategory,
      sortOrder,
      status,
      image,
      metaTitle,
      metaDescription,
      createdBy: req.user?.id
    });

    await category.save();

    const categoryData = {
      id: category._id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      parentCategory: category.parentCategory,
      isMainCategory: category.isMainCategory,
      sortOrder: category.sortOrder,
      status: category.status === '1' ? 'active' : 'inactive',
      productCount: 0,
      image: category.image,
      slug: category.slug,
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
    const { 
      name, 
      description, 
      icon,
      parentCategory,
      isMainCategory,
      sortOrder,
      status,
      image,
      metaTitle,
      metaDescription
    } = req.body;

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

    // Validate parent category if provided
    if (parentCategory && parentCategory !== category.parentCategory?.toString()) {
      if (parentCategory === id) {
        return Response.error(res, 'Category cannot be its own parent', 400);
      }
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return Response.error(res, 'Parent category not found', 400);
      }
    }

    // Update fields
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (icon !== undefined) updateData.icon = icon;
    if (parentCategory !== undefined) updateData.parentCategory = parentCategory;
    if (isMainCategory !== undefined) updateData.isMainCategory = isMainCategory;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (status !== undefined) updateData.status = status;
    if (image !== undefined) updateData.image = image;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    updateData.updatedBy = req.user?.id;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parentCategory', 'name');

    // Get product count
    const productCount = await Product.countDocuments({ category: updatedCategory._id });

    const categoryData = {
      id: updatedCategory._id,
      name: updatedCategory.name,
      description: updatedCategory.description,
      icon: updatedCategory.icon,
      parentCategory: updatedCategory.parentCategory,
      isMainCategory: updatedCategory.isMainCategory,
      sortOrder: updatedCategory.sortOrder,
      status: updatedCategory.status === '1' ? 'active' : 'inactive',
      productCount,
      image: updatedCategory.image,
      slug: updatedCategory.slug,
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

    // Check if category has subcategories
    const subcategoriesCount = await Category.countDocuments({ parentCategory: id });
    if (subcategoriesCount > 0) {
      return Response.error(res, `Cannot delete category. It has ${subcategoriesCount} subcategory(ies).`, 400);
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
      { status, updatedBy: req.user?.id },
      { new: true, runValidators: true }
    ).populate('parentCategory', 'name');

    if (!category) {
      return Response.error(res, 'Category not found', 404);
    }

    // Get product count
    const productCount = await Product.countDocuments({ category: category._id });

    const categoryData = {
      id: category._id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      parentCategory: category.parentCategory,
      isMainCategory: category.isMainCategory,
      sortOrder: category.sortOrder,
      status: category.status === '1' ? 'active' : 'inactive',
      productCount,
      image: category.image,
      slug: category.slug,
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
      .select('name description icon parentCategory isMainCategory')
      .populate('parentCategory', 'name')
      .sort({ sortOrder: 1, name: 1 });

    const categoryList = categories.map(category => ({
      id: category._id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      parentCategory: category.parentCategory,
      isMainCategory: category.isMainCategory
    }));

    return Response.success(res, categoryList);

  } catch (error) {
    console.error('Error fetching active categories:', error);
    return Response.error(res, 'Failed to fetch categories', 500);
  }
};

// Reorder categories
const reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return Response.error(res, 'Categories array is required', 400);
    }

    // Update sort order for each category
    const updatePromises = categories.map((category, index) => {
      return Category.findByIdAndUpdate(category.id, {
        sortOrder: index,
        updatedBy: req.user?.id
      });
    });

    await Promise.all(updatePromises);

    return Response.success(res, null, 'Categories reordered successfully');

  } catch (error) {
    console.error('Error reordering categories:', error);
    return Response.error(res, 'Failed to reorder categories', 500);
  }
};

module.exports = {
  getCategories,
  getHierarchicalCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  getActiveCategories,
  reorderCategories
}; 