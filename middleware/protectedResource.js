import jwt from "jsonwebtoken";
import user_model from "../models/user_model.js";

const privateRoute = async (req, res, next) => {
  //authorization -> Bearer
  const {authorization} = req.headers;
  if(!authorization) {
    return res.status(401).json({error: "User not logged in"});
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
    if(error) {
      return res.status(401).json({error: "User not logged in"});
    }
    const {_id} = payload;
    user_model.findById(_id)
    .then(dbUser => {
      req.dbUser = dbUser;
      //forward the request to the next middleware or the next route
      next();
    });
    
  })
}

export {
  privateRoute
}