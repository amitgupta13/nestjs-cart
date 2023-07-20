import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomBytes, scrypt as _scrypt, createHash } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { promisify } from 'util';
const scrpyt = promisify(_scrypt);
import { regex, userRoles } from '../../constants';

type UserDocument = HydratedDocument<User>;

@Schema()
class User {
  @Prop({
    required: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 chars'],
  })
  firstName: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 chars'],
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    match: [regex.email, 'Please add a valid email'],
  })
  email: string;

  @Prop({
    maxlength: [20, 'Phone number can not be longer than 20 characters'],
  })
  mobile: string;

  @Prop({
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  })
  password: string;

  @Prop()
  resetPasswordToken: string;

  @Prop({ type: Date })
  resetPasswordExpire: Date;

  @Prop({
    type: [Number],
    required: true,
    default: [userRoles.admin],
    enum: userRoles,
  })
  roles: number[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = randomBytes(8).toString('hex');
  const hash = (await scrpyt(this.password, salt, 32)) as Buffer;
  const result = salt + '.' + hash.toString('hex');
  this.password = result;
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  const [salt, storedHash] = this.password.split('.');
  const hash = (await scrpyt(enteredPassword, salt, 32)) as Buffer;
  return hash.toString('hex') === storedHash;
};

UserSchema.methods.getPasswordResetToken = function () {
  const resetToken = randomBytes(20).toString('hex');
  this.resetPasswordToken = createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export { UserSchema, User, UserDocument };
