import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: "no image available"
  },
  like: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel" 
    }
  ],
  comments : [
    {
      commentText: String,
      commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel"
      }
    }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId, //relaciona con el usuario registrado
    ref: "UserModel" //nombre de la tabla en la DB 
  },
}, {
  timestamps: true
});

const postModel = mongoose.model("PostModel", postSchema);

export default postModel;