const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/", postController.createPost);
router.get("/:id", postController.fetchUserPosts);
router.get("/", postController.fetchPosts);
router.patch("/:id", postController.updatePost);
router.get("/p/:id", postController.fetchPostById);

router.post("/p/:id/comment", postController.createComment);
router.get("/p/:id/comment", postController.fetchComments);
router.delete("/p/:id/comment", postController.deleteComment);

router.post("/p/:id/like", postController.likePost);
router.delete("/p/:id/like", postController.unlikePost);
router.get("/p/:id/like", postController.getLike);

module.exports = router;
