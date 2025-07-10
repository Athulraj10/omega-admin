const { User, UserLoginHistory } = require("../../models/user");
const Order = require("../../models/order");
const Response = require("../../services/Response");

// Get all users with pagination and filters
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (search) {
      filter.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } }
      ];
    }
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Get users with pagination
    const users = await User.find(filter)
      .select('-password -password_text -token')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);

    // Get order statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orderStats = await Order.aggregate([
          { $match: { user: user._id } },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalSpent: { $sum: "$totalAmount" },
              averageOrderValue: { $avg: "$totalAmount" }
            }
          }
        ]);

        const lastOrder = await Order.findOne({ user: user._id })
          .sort({ createdAt: -1 })
          .select('createdAt totalAmount');

        return {
          id: user._id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.userName,
          email: user.email,
          phone: user.mobile_no ? `+${user.mobile_no}` : 'N/A',
          status: user.status === '1' ? 'active' : user.status === '0' ? 'inactive' : 'blocked',
          registrationDate: user.createdAt,
          lastLogin: user.last_login || user.createdAt,
          totalOrders: orderStats[0]?.totalOrders || 0,
          totalSpent: orderStats[0]?.totalSpent || 0,
          averageOrderValue: orderStats[0]?.averageOrderValue || 0,
          lastOrder: lastOrder ? {
            date: lastOrder.createdAt,
            amount: lastOrder.totalAmount
          } : null,
          avatar: user.profile_pic || null
        };
      })
    );

    return Response.success(res, {
      users: usersWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNextPage: skip + users.length < totalUsers,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.error(res, 'Failed to fetch users', 500);
  }
};

// Get user details by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password -password_text -token');
    if (!user) {
      return Response.error(res, 'User not found', 404);
    }

    // Get user statistics
    const orderStats = await Order.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          averageOrderValue: { $avg: "$totalAmount" }
        }
      }
    ]);

    const userData = {
      id: user._id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.userName,
      email: user.email,
      phone: user.mobile_no ? `+${user.mobile_no}` : 'N/A',
      status: user.status === '1' ? 'active' : user.status === '0' ? 'inactive' : 'blocked',
      registrationDate: user.createdAt,
      lastLogin: user.last_login || user.createdAt,
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalSpent: orderStats[0]?.totalSpent || 0,
      averageOrderValue: orderStats[0]?.averageOrderValue || 0,
      avatar: user.profile_pic || null,
      companyName: user.companyName,
      address: user.address
    };

    return Response.success(res, userData);

  } catch (error) {
    console.error('Error fetching user:', error);
    return Response.error(res, 'Failed to fetch user details', 500);
  }
};

// Get user orders with pagination
const getUserOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, status = "" } = req.query;
    const skip = (page - 1) * limit;

    // Verify user exists
    const user = await User.findById(id);
    if (!user) {
      return Response.error(res, 'User not found', 404);
    }

    // Build filter
    const filter = { user: id };
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Get orders with pagination
    const orders = await Order.find(filter)
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalOrders = await Order.countDocuments(filter);

    // Format orders
    const formattedOrders = orders.map(order => ({
      id: order._id,
      orderNumber: order._id.toString().slice(-8).toUpperCase(),
      status: order.status,
      total: order.totalAmount,
      items: order.items.length,
      date: order.createdAt,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      items: order.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.priceAtPurchase
      }))
    }));

    return Response.success(res, {
      orders: formattedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: skip + orders.length < totalOrders,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    return Response.error(res, 'Failed to fetch user orders', 500);
  }
};

// Get user order reports/analytics
const getUserReports = async (req, res) => {
  try {
    const { id } = req.params;
    const { period = '30' } = req.query; // days

    // Verify user exists
    const user = await User.findById(id);
    if (!user) {
      return Response.error(res, 'User not found', 404);
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Get order statistics for the period
    const orderStats = await Order.aggregate([
      { 
        $match: { 
          user: user._id,
          createdAt: { $gte: daysAgo }
        } 
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          averageOrderValue: { $avg: "$totalAmount" },
          minOrderValue: { $min: "$totalAmount" },
          maxOrderValue: { $max: "$totalAmount" }
        }
      }
    ]);

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      { 
        $match: { 
          user: user._id,
          createdAt: { $gte: daysAgo }
        } 
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Get monthly order trends
    const monthlyTrends = await Order.aggregate([
      { 
        $match: { 
          user: user._id,
          createdAt: { $gte: daysAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          orders: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Get recent orders
    const recentOrders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('status totalAmount createdAt');

    const reports = {
      period: `${period} days`,
      summary: {
        totalOrders: orderStats[0]?.totalOrders || 0,
        totalSpent: orderStats[0]?.totalSpent || 0,
        averageOrderValue: orderStats[0]?.averageOrderValue || 0,
        minOrderValue: orderStats[0]?.minOrderValue || 0,
        maxOrderValue: orderStats[0]?.maxOrderValue || 0
      },
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = { count: item.count, totalAmount: item.totalAmount };
        return acc;
      }, {}),
      monthlyTrends: monthlyTrends.map(item => ({
        month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
        orders: item.orders,
        totalAmount: item.totalAmount
      })),
      recentOrders: recentOrders.map(order => ({
        id: order._id,
        status: order.status,
        totalAmount: order.totalAmount,
        date: order.createdAt
      }))
    };

    return Response.success(res, reports);

  } catch (error) {
    console.error('Error fetching user reports:', error);
    return Response.error(res, 'Failed to fetch user reports', 500);
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['0', '1', '2']; // inactive, active, blocked
    if (!validStatuses.includes(status)) {
      return Response.error(res, 'Invalid status', 400);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password -password_text -token');

    if (!user) {
      return Response.error(res, 'User not found', 404);
    }

    return Response.success(res, {
      message: 'User status updated successfully',
      user: {
        id: user._id,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.userName,
        email: user.email,
        status: user.status === '1' ? 'active' : user.status === '0' ? 'inactive' : 'blocked'
      }
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    return Response.error(res, 'Failed to update user status', 500);
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return Response.error(res, 'User not found', 404);
    }

    // Also delete associated orders (optional - you might want to keep them for records)
    // await Order.deleteMany({ user: id });

    return Response.success(res, { message: 'User deleted successfully' });

  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.error(res, 'Failed to delete user', 500);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserOrders,
  getUserReports,
  updateUserStatus,
  deleteUser
}; 