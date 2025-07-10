const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/omega_admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./ad-backend/src/models/user');

async function checkUsersPassword() {
  try {
    console.log('🔍 Checking users for password issues...\n');

    // Find all users
    const users = await User.find({});
    console.log(`📊 Total users found: ${users.length}\n`);

    // Check for users without passwords
    const usersWithoutPassword = users.filter(user => !user.password || user.password === '');
    console.log(`❌ Users without password: ${usersWithoutPassword.length}`);
    
    if (usersWithoutPassword.length > 0) {
      console.log('\nUsers without passwords:');
      usersWithoutPassword.forEach(user => {
        console.log(`- ID: ${user._id}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Name: ${user.first_name} ${user.last_name}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Status: ${user.status}`);
        console.log('---');
      });
    }

    // Check for users with empty passwords
    const usersWithEmptyPassword = users.filter(user => user.password === '');
    console.log(`\n⚠️ Users with empty password string: ${usersWithEmptyPassword.length}`);

    // Check for users with plain text passwords (not hashed)
    const usersWithPlainPassword = users.filter(user => 
      user.password && 
      user.password.length < 20 && 
      !user.password.startsWith('$2b$') && 
      !user.password.startsWith('$2a$')
    );
    console.log(`\n⚠️ Users with potentially plain text passwords: ${usersWithPlainPassword.length}`);
    
    if (usersWithPlainPassword.length > 0) {
      console.log('\nUsers with potentially plain text passwords:');
      usersWithPlainPassword.forEach(user => {
        console.log(`- ID: ${user._id}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Password length: ${user.password?.length || 0}`);
        console.log(`  Password starts with: ${user.password?.substring(0, 10)}...`);
        console.log('---');
      });
    }

    // Show admin users specifically
    const adminUsers = users.filter(user => user.role !== 'user');
    console.log(`\n👑 Admin users: ${adminUsers.length}`);
    adminUsers.forEach(user => {
      console.log(`- Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Has password: ${!!user.password}`);
      console.log(`  Password length: ${user.password?.length || 0}`);
      console.log('---');
    });

    console.log('\n✅ Password check completed!');

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUsersPassword(); 