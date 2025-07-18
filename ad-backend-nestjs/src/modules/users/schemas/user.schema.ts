import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  passwordText: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  roleLevel: number;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  mobile_no: string;

  @Prop()
  email_verify: Date;

  @Prop()
  device_code: string;

  @Prop()
  token: string;

  @Prop()
  last_login: Date;

  @Prop({
    type: {
      system_ip: String,
      browser_ip: String,
    },
  })
  ip_address: {
    system_ip: string;
    browser_ip: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'UserLoginHistory' })
  loginHistory: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User); 