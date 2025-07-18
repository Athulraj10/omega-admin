const Product = require("../../models/product");
const { User } = require("../../models/user");
const Order = require("../../models/order");
const Category = require("../../models/category");
const Response = require("../../services/Response");
const { ROLES } = require("../../services/Constants");

// Get dashboard overview data
const getDashboardOverview = async (req, res) => {
  try {
    console.log('🔄 Fetching dashboard overview...');
    
    // Get counts from database
    const [
      totalProducts,
      totalUsers,
      totalSellers,
      totalOrders,
      totalCategories,
      totalRevenue,
      lastMonthRevenue,
      lastMonthOrders
    ] = await Promise.all([
      Product.countDocuments({ status: '1' }),
      User.countDocuments({ status: '1', role: ROLES.USER.name }),
      User.countDocuments({ status: '1', role: ROLES.SELLER.name }),
      Order.countDocuments(),
      Category.countDocuments({ status: '1' }),
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { 
              $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
              $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({
        createdAt: { 
          $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      })
    ]);

    console.log('📊 Database counts:', {
      totalProducts,
      totalUsers,
      totalSellers,
      totalOrders,
      totalCategories
    });

    // Calculate growth rates
    const currentMonthOrders = await Order.countDocuments({
      createdAt: { 
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    const revenue = totalRevenue[0]?.total || 0;
    const lastMonthRev = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = lastMonthRev > 0 ? ((revenue - lastMonthRev) / lastMonthRev) * 100 : 0;
    const orderGrowth = lastMonthOrders > 0 ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0;

    const response = {
      views: {
        value: Math.floor(Math.random() * 10000) + 1000,
        growthRate: Math.random() * 10 - 5,
      },
      profit: {
        value: revenue,
        growthRate: revenueGrowth,
      },
      products: {
        value: totalProducts,
        growthRate: Math.random() * 10 - 5,
      },
      users: {
        value: totalUsers,
        growthRate: Math.random() * 10 - 5,
      },
      orders: {
        value: totalOrders,
        growthRate: orderGrowth,
      },
      categories: {
        value: totalCategories,
        growthRate: Math.random() * 10 - 5,
      },
      sellers: {
        value: totalSellers,
        growthRate: Math.random() * 10 - 5,
      }
    };

    console.log('✅ Dashboard overview response:', response);
    return Response.success(res, response);

  } catch (error) {
    console.error('❌ Error fetching dashboard overview:', error);
    return Response.error(res, 'Failed to fetch dashboard overview', 500);
  }
};

// Get recent users for chat/list
const getRecentUsers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const users = await User.find({ 
      status: '1',
      role: ROLES.USER.name
    })
      .select('first_name last_name email profile_pic last_login createdAt')
      .sort({ last_login: -1, createdAt: -1 })
      .limit(parseInt(limit));

    const userList = users.map(user => ({
      id: user._id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      profile: user.profile_pic || '/images/user/user-01.png',
      isActive: user.last_login && (new Date() - new Date(user.last_login)) < 5 * 60 * 1000,
      lastActive: user.last_login,
      joinedDate: user.createdAt,
      lastMessage: {
        content: "Welcome to our platform!",
        type: "text",
        timestamp: user.last_login || user.createdAt,
        isRead: true,
      },
      unreadCount: 0,
    }));

    return Response.success(res, userList);

  } catch (error) {
    console.error('Error fetching recent users:', error);
    return Response.error(res, 'Failed to fetch recent users', 500);
  }
};

// Get payments overview data for charts
const getPaymentsOverview = async (req, res) => {
  try {
    const { timeFrame = 'monthly' } = req.query;
    
    let groupBy, matchCondition;
    
    if (timeFrame === 'yearly') {
      groupBy = { year: { $year: '$createdAt' } };
      matchCondition = {
        createdAt: { $gte: new Date(new Date().getFullYear() - 4, 0, 1) }
      };
    } else {
      groupBy = { 
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
      matchCondition = {
        createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
      };
    }

    const receivedData = await Order.aggregate([
      { $match: { ...matchCondition, status: 'completed' } },
      { $group: { _id: groupBy, total: { $sum: '$totalAmount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const dueData = await Order.aggregate([
      { $match: { ...matchCondition, status: { $in: ['pending', 'processing'] } } },
      { $group: { _id: groupBy, total: { $sum: '$totalAmount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const formatChartData = (data, timeFrame) => {
      if (timeFrame === 'yearly') {
        return data.map(item => ({
          x: item._id.year.toString(),
          y: item.total
        }));
      } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return data.map(item => ({
          x: months[item._id.month - 1],
          y: item.total
        }));
      }
    };

    return Response.success(res, {
      received: formatChartData(receivedData, timeFrame),
      due: formatChartData(dueData, timeFrame)
    });

  } catch (error) {
    console.error('Error fetching payments overview:', error);
    return Response.error(res, 'Failed to fetch payments overview', 500);
  }
};

// Get weekly profit data
const getWeeklyProfit = async (req, res) => {
  try {
    const { timeFrame = 'this week' } = req.query;
    
    let startDate, endDate;
    const now = new Date();
    
    if (timeFrame === 'last week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = now;
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sales = days.map((day, index) => {
      const data = salesData.find(item => item._id === index + 1);
      return {
        x: day,
        y: data ? data.count : 0
      };
    });

    const revenue = days.map((day, index) => {
      const data = salesData.find(item => item._id === index + 1);
      return {
        x: day,
        y: data ? data.revenue : 0
      };
    });

    return Response.success(res, { sales, revenue });

  } catch (error) {
    console.error('Error fetching weekly profit:', error);
    return Response.error(res, 'Failed to fetch weekly profit', 500);
  }
};

// Get device usage data
const getDeviceUsage = async (req, res) => {
  try {
    const { timeFrame = 'monthly' } = req.query;
    
    const data = [
      {
        name: "Desktop",
        percentage: 0.65,
        amount: timeFrame === 'yearly' ? 19500 : 1625,
      },
      {
        name: "Tablet",
        percentage: 0.1,
        amount: timeFrame === 'yearly' ? 3000 : 250,
      },
      {
        name: "Mobile",
        percentage: 0.2,
        amount: timeFrame === 'yearly' ? 6000 : 500,
      },
      {
        name: "Unknown",
        percentage: 0.05,
        amount: timeFrame === 'yearly' ? 1500 : 125,
      },
    ];

    return Response.success(res, data);

  } catch (error) {
    console.error('Error fetching device usage:', error);
    return Response.error(res, 'Failed to fetch device usage', 500);
  }
};

// Get campaign visitors data
const getCampaignVisitors = async (req, res) => {
  try {
    const data = {
      total_visitors: Math.floor(Math.random() * 1000000) + 100000,
      performance: (Math.random() * 10) - 5,
      chart: [
        { x: "S", y: Math.floor(Math.random() * 400) + 100 },
        { x: "S", y: Math.floor(Math.random() * 400) + 100 },
        { x: "M", y: Math.floor(Math.random() * 400) + 100 },
        { x: "T", y: Math.floor(Math.random() * 400) + 100 },
        { x: "W", y: Math.floor(Math.random() * 400) + 100 },
        { x: "T", y: Math.floor(Math.random() * 400) + 100 },
        { x: "F", y: Math.floor(Math.random() * 400) + 100 },
      ],
    };

    return Response.success(res, data);

  } catch (error) {
    console.error('Error fetching campaign visitors:', error);
    return Response.error(res, 'Failed to fetch campaign visitors', 500);
  }
};

module.exports = {
  getDashboardOverview,
  getRecentUsers,
  getPaymentsOverview,
  getWeeklyProfit,
  getDeviceUsage,
  getCampaignVisitors
}; 