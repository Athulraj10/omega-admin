const mongoose = require("mongoose");
const dashboardController = require("./src/controllers/admin/dashboardController");

// Test the dashboard controller functions
async function testDashboardController() {
  try {
    console.log("🧪 Testing dashboard controller functions...");
    
    // Test if all functions exist
    const functions = [
      'getDashboardOverview',
      'getRecentUsers', 
      'getPaymentsOverview',
      'getWeeklyProfit',
      'getDeviceUsage',
      'getCampaignVisitors'
    ];
    
    functions.forEach(funcName => {
      if (typeof dashboardController[funcName] === 'function') {
        console.log(`✅ ${funcName}: Function exists`);
      } else {
        console.log(`❌ ${funcName}: Function is undefined`);
      }
    });
    
    console.log("\n📋 Dashboard controller exports:", Object.keys(dashboardController));
    
  } catch (error) {
    console.error("❌ Error testing dashboard controller:", error);
  }
}

testDashboardController(); 