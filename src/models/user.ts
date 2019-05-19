import { Schema, model, Document, Types } from "mongoose";
import { hash, compare } from "bcrypt";

export interface IUser {
  email: string;
  password: string;
}

export type TUserModel = IUser &
  Document & {
    comparePassword: (candidatePassword: string) => Promise<boolean>;
  };

const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre<TUserModel>("save", function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);

    // override the cleartext password with the hashed one
    this.password = passwordHash;
    next();
  });
});

userSchema.methods.comparePassword = function comparePassword(
  candidatePassword: string
) {
  return new Promise((resolve, reject) => {
    compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

const User = model<TUserModel>("User", userSchema);

export default User;
