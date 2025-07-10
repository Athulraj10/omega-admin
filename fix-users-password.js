const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/omega_admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./ad-backend/src/models/user');

async function fixUsersPassword() {
  try {
    console.log('🔧 Fixing users with password issues...\n');

    // Default password to set for users without passwords
    const defaultPassword = 'Admin@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Find users without passwords or with empty passwords
    const usersToFix = await User.find({
      $or: [
        { password: { $exists: false } },
        { password: null },
        { password: '' }
      ]
    });

    console.log(`📊 Users found without passwords: ${usersToFix.length}\n`);

    if (usersToFix.length === 0) {
      console.log('✅ No users need password fixes!');
      return;
    }

    // Show users that will be fixed
    console.log('Users that will be fixed:');
    usersToFix.forEach(user => {
      console.log(`- ID: ${user._id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Name: ${user.first_name} ${user.last_name}`);
      console.log(`  Role: ${user.role}`);
      console.log('---');
    });

    // Ask for confirmation
    console.log(`\n⚠️ This will set the password "${defaultPassword}" for ${usersToFix.length} users.`);
    console.log('⚠️ These users should change their passwords after first login.');
    console.log('\nTo proceed, run this script with the --fix flag:');
    console.log('node fix-users-password.js --fix');

    // Check if --fix flag is provided
    if (process.argv.includes('--fix')) {
      console.log('\n🔧 Proceeding with password fixes...\n');

      let fixedCount = 0;
      for (const user of usersToFix) {
        try {
          await User.findByIdAndUpdate(user._id, {
            $set: { password: hashedPassword }
          });
          console.log(`✅ Fixed password for: ${user.email}`);
          fixedCount++;
        } catch (error) {
          console.error(`❌ Failed to fix password for ${user.email}:`, error.message);
        }
      }

      console.log(`\n🎉 Successfully fixed passwords for ${fixedCount} users!`);
      console.log(`\n📝 Default password set: "${defaultPassword}"`);
      console.log('⚠️ Please inform these users to change their passwords after login.');
    } else {
      console.log('\n💡 Run with --fix flag to actually apply the changes.');
    }

  } catch (error) {
    console.error('❌ Error fixing users:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixUsersPassword(); 