import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicUrl: {
    type: String,
    default: "https://res.cloudinary.com/diegofedez7/image/upload/v1654564305/s0drzeprcnjwazupact5.jpg"
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId, //relaciona con el usuario registrado
      ref: "UserModel" //nombre de la tabla en la DB 
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId, //relaciona con el usuario registrado
      ref: "UserModel" //nombre de la tabla en la DB 
    }
  ],
}, {
  timestamps: true
});

const user_model = mongoose.model("UserModel", userSchema);

export default user_model;