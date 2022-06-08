import express from "express";
const router = express.Router();

import {
  privateRoute,
} from "../middleware/protectedResource.js";

import {
  createPost, 
  getAllPosts, 
  getAllMyPosts,
  giveALike,
  unLike,
  addComment,
  deleteComment,
  getFollowingsPosts
} from "../controllers/postController.js";

router.post('/', privateRoute, createPost);

router.get('/all', privateRoute, getAllPosts);

router.get('/myposts', privateRoute, getAllMyPosts);

router.put('/like', privateRoute, giveALike);

router.put('/unlike', privateRoute, unLike);

router.put('/comment', privateRoute, addComment);

router.delete('/:postId', privateRoute, deleteComment);

router.get('/following-posts', privateRoute, getFollowingsPosts);

export default router;