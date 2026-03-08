import mongoose from "mongoose";

const {Schema} = mongoose;

const UserSchema = new Schema({
  username: {type: String, unique: true, required: true},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;

