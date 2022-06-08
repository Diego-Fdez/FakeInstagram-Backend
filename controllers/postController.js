import postModel from "../models/postModel.js";

//create a new post
const createPost = async (req, res) => {
  const {title, body, image} = req.body;
  if(!title || !body || !image) {
    return res.status(400).json({error: "One or more mandatory field is empty"});
  };
  req.dbUser.password = undefined;
  const post = new postModel({title, body, image, author: req.dbUser});
  
  try {
    const postStored = await post.save()
    res.status(201).json({postStored});
  } catch (error) {
    return res.status(404).json({error: "Your post could not be saved, please try again"})
  }
};

//get all posts
const getAllPosts = async (req, res) => {
  try {
    const dbPosts = await postModel.find()
    .populate("author", "_id fullName profilePicUrl")
    .populate('comments.commentedBy', "_id fullName profilePicUrl")
    res.status(200).json({posts: dbPosts});
  } catch (error) {
    return res.status(404).json({error: "There are no posts to display"});
  }
};

//get all my posts
const getAllMyPosts = async (req, res) => {
  try {
    const dbPosts = await postModel.find({author: req.dbUser._id})
    .populate("author", "_id fullName profilePicUrl")
    .populate('comments.commentedBy', "_id fullName profilePicUrl")
    res.status(200).json({posts: dbPosts});
  } catch (error) {
    return res.status(404).json({error: "There are no posts to display"});
  }
};

//get all posts
const getFollowingsPosts = async (req, res) => {
  try {
    const dbPosts = await postModel.find({author: {$in: req.dbUser.following}})
    .populate("author", "_id fullName")
    .populate('comments.commentedBy', "_id fullName profilePicUrl")
    res.status(200).json({posts: dbPosts});
  } catch (error) {
    return res.status(404).json({error: "There are no posts to display"});
  }
};

//modify one post
const giveALike = async (req, res) => {
  postModel.findByIdAndUpdate(req.body.postId, {
    $push: {like: req.dbUser._id}
  }, {
    new: true //return updated record
  }).populate("author", "_id fullName profilePicUrl")
  .exec((error, result) => {
    if(error) {
      return res.status(400).json({error});
    } else {
      res.json(result)
    }
  })
}

//modify one post
const unLike = async (req, res) => {
  postModel.findByIdAndUpdate(req.body.postId, {
    $pull: {like: req.dbUser._id}
  }, {
    new: true //return updated record
  }).populate("author", "_id fullName profilePicUrl")
  .exec((error, result) => {
    if(error) {
      return res.status(400).json({error});
    } else {
      res.json(result)
    }
  })
}

const addComment = async (req, res) => {
  const comment = {
    commentText: req.body.commentText,
    commentedBy: req.dbUser._id
  }
  postModel.findByIdAndUpdate(req.body.postId, {
    $push: {comments: comment}
  }, {
    new: true //return updated record
  }).populate('comments.commentedBy', "_id fullName profilePicUrl")
  .populate("author", "_id fullName")
  .exec((error, result) => {
    if(error) {
      return res.status(400).json({error});
    } else {
      res.json(result)
    }
  })
};

//delete one comment
const deleteComment = (req, res) => {
  postModel.findOne({_id: req.params.postId})
  .populate("author", "_id")
  .exec((error, post) => {
    if(error || !post) {
      return res.status(400).json({error: error})
    }
    //check if the post user is same is logged user
    if(post.author._id.toString() === req.dbUser._id.toString()) {
      post.remove()
      .then(data =>{
        res.json({result: data})
      })
      .catch(error => {
        console.log(error)
      })
    }
  })
}

export {
  createPost, 
  getAllPosts,
  getAllMyPosts,
  giveALike,
  unLike,
  addComment,
  deleteComment,
  getFollowingsPosts
}