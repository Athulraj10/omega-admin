import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../modules/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const userModel = app.get<Model<User>>(getModelToken(User.name));
    
    // Default admin credentials
    const adminData = {
      first_name: process.env.ADMIN_FIRST_NAME || 'admin',
      last_name: process.env.ADMIN_LAST_NAME || '123',
      email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
      userName: process.env.ADMIN_USERNAME || 'admin123',
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin@123', 10),
      passwordText: process.env.ADMIN_PASSWORD || 'admin@123',
      role: 'admin',
      roleLevel: 1,
      status: 'active',
      mobile_no: process.env.ADMIN_MOBILE_NO || '8877445511',
      email_verify: new Date(),
      device_code: 'device_xyz',
    };

    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const admin = new userModel(adminData);
    await admin.save();
    
    console.log('✅ Admin user created successfully');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.passwordText);
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  } finally {
    await app.close();
  }
}

seed(); 