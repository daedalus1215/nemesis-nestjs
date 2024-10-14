// src/users/schemas/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true, // Automatically adds createdAt and updatedAt fields
})
export class User {
  @Prop({ required: true, unique: true, minlength: 4, maxlength: 20 })
  username: string;

  @Prop({ required: true, minlength: 6, maxlength: 100 })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
