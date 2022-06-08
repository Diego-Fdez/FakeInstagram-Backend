import express from "express";
const router = express.Router();

import {
  privateRoute,
} from "../middleware/protectedResource.js";

import {
  register, 
  login,
  getUser,
  insertFollow,
  updateFollow
} from "../controllers/userController.js";

router.post('/register', register);

router.post('/login', login)

router.get('/:userId', privateRoute, getUser);

router.put('/follow', privateRoute, insertFollow)

router.put('/unfollow', privateRoute, updateFollow)

export default router;