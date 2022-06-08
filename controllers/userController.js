import user_model from "../models/user_model.js";
import postModel from "../models/postModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//register user
const register = async (req, res) => {
  //object destructuring
  const {fullName, email, password, profilePicUrl} = req.body;
  //validate blank fields
  if (!fullName || !password || !email) {
    return res.status(400).json({error: "One or more mandatory field is empty"});
  } 
  //avoid duplicate user
  const userExist = await user_model.findOne({email});
  if(userExist) {
    return res.status(500).json({ error: "User with this email already exist"});
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 16)
    const user = new user_model({fullName, email, password: hashedPassword, profilePicUrl: profilePicUrl});
    await user.save();
    res.status(201).json({result: "User Registered successfully"});
  } catch (error) {
    return res.status(404).json({error: "Failed to register user, please try again"})
  }
};

//login
const login = async (req, res) => {
  const {email, password} = req.body;
  if(!email || !password) {
    return res.status(400).json({error: "One or more mandatory field is empty"});
  }
  //avoid duplicate user
  const userExist = await user_model.findOne({email});
  if(!userExist) {
    return res.status(404).json({ error: "User does not exist!"});
  }
  const didMatch = bcrypt.compareSync(password, userExist.password);
  if(didMatch) {
    //res.status(200).json({result: "User Logged In successfully"});
    //create and send a token
    const jwtToken = jwt.sign({_id: userExist._id}, process.env.JWT_SECRET);
    const {_id, fullName, email, followers, following, profilePicUrl} = userExist;
    res.json({token: jwtToken, userInfo: {_id, fullName, email, followers, following, profilePicUrl}});
  } else {
    return res.status(400).json({ error: "Invalid credentials!"});
  }
  
}

//get user by ID
const getUser = (req, res) => {
  //to find specific user
  user_model.findOne({_id: req.params.userId})
  .select("-password") //fetche everything except password
  .then(userFound => {
    //fetch all post of this found user
    postModel.find({author: req.params.userId})
    .populate("author", "_id fullName")
    .exec((error, allPosts) => {
      if(error) {
        return res.status(400).json({error: error});
      }
      res.json({user: userFound, posts: allPosts});
    })
  })
  .catch(err => {
    return res.status(400).json({err: "User was not found!"});
  })
};

//insert follows
const insertFollow = (req, res) => {
  //scenario: Loggedin user is trying to follow a non-loggedin user
  //req.body.followId = userId o not loggedin user
  user_model.findByIdAndUpdate(req.body.followId, {
    $push: {followers: req.dbUser._id} //push the userID of loggedin user
  }, {
    new: true
  }, (error, result) => {
    if(error) {
      return res.status(400).json({error: error});
    }
    //req.dbUser_.id = userId of loggedin user
    user_model.findByIdAndUpdate(req.dbUser._id, {
      $push: {following: req.body.followId} //push the userid of not loggedin user
    }, {
      new: true
    }).select("-password")
    .then(result => res.json({result}))
    .catch(error => {
      return res.status(400).json({error: error})
    })
  })
};

//update follows
const updateFollow = (req, res) => {
  //scenario: Loggedin user is trying to follow a non-loggedin user
  //req.body.followId = userId o not loggedin user
  user_model.findByIdAndUpdate(req.body.unfollowId, {
    $pull: {followers: req.dbUser._id} //push the userID of loggedin user
  }, {
    new: true
  }, (error, result) => {
    if(error) {
      return res.status(400).json({error: error});
    }
    //req.dbUser_.id = userId of loggedin user
    user_model.findByIdAndUpdate(req.dbUser._id, {
      $pull: {following: req.body.unfollowId} //push the userid of not loggedin user
    }, {
      new: true
    }).select("-password")
    .then(result => res.json({result}))
    .catch(error => {
      return res.status(400).json({error: error})
    })
  })
}

export {
  register,
  login,
  getUser,
  insertFollow,
  updateFollow
}