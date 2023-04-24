import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  authId: string;
  name: string;
  role: string;
  created: Date;
}

const UserSchema = new Schema({
  authId: String,
  name: String,
  role: String,
  created: Date,
});

const User = model<IUser>("User", UserSchema);

export { User, IUser };
