const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");
const User = require("../models/user");

exports.createPost = async (req, res) => {
  const { postImage, postDescription } = req.body;

  const newPost = new Post({ _user: req.user._id, postImage, postDescription });

  // console.log(newPost);

  console.log(req.user._id);

  try {
    await newPost.save();
    await User.findByIdAndUpdate(req.user._id, { $inc: { postCount: 1 } });
    res.status(201).json(newPost);
    console.log("Post created");
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.fetchUserPosts = async (req, res) => {
  const { id } = req.params;

  const posts = await Post.find({ _user: id })
    .populate({ path: "_user", select: "_id name picture" })
    .populate({ path: "_comments", populate: [{ path: "_user" }] });

  res.status(201).json(posts);
};

exports.fetchPosts = async (req, res) => {
  const posts = await Post.find()
    .populate({
      path: "_user",
      select: "_id name picture",
    })
    .populate({ path: "_comments", populate: [{ path: "_user" }] });
  // console.log(posts[0]._comments[0]);
  res.status(201).json(posts);
};

exports.updatePost = async (req, res) => {
  const post = req.body;
  const { id } = req.params;

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    // console.log(updatedPost.comments);
    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.fetchPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const fetchedPost = await Post.findById(id)
      .populate({
        path: "_user",
        select: "_id name picture",
      })
      .populate({ path: "_comments", populate: [{ path: "_user" }] });
    // console.log(fetchedPost.postDescription);
    res.status(201).json(fetchedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.createComment = async (req, res) => {
  const { id } = req.params;
  const _user = req.user._id;
  const { commentDetail } = req.body;
  const newCommentData = new Comment({ _user, commentDetail });

  try {
    await newCommentData.save();
    const commentedPost = await Post.findByIdAndUpdate(
      id,
      {
        $push: { _comments: newCommentData._id },
      },
      { new: true }
    )
      .populate({
        path: "_user",
        select: "_id name picture",
      })
      .populate({ path: "_comments", populate: [{ path: "_user" }] });
    res.status(201).json(commentedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  const { commentId } = req.body;
  // console.log(req.body);

  try {
    await Comment.findByIdAndDelete(commentId);
    const deletedCommentPost = await Post.findByIdAndUpdate(
      id,
      {
        $pull: { _comments: commentId },
      },
      { new: true }
    )
      .populate({
        path: "_user",
        select: "_id name picture",
      })
      .populate({ path: "_comments", populate: [{ path: "_user" }] });
    res.status(201).json(deletedCommentPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.fetchComments = async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await Comment.find({ _post: id }).populate({
      path: "_user",
      select: "_id name picture",
    });
    // console.log(comments);
    res.status(201).json(comments);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  const { id } = req.params;
  const _user = req.user._id;
  const like = { _user: _user, _post: id };
  const newLike = new Like(like);

  try {
    const likedPost = await Post.findByIdAndUpdate(
      id,
      {
        $inc: { likesCount: 1 },
      },
      { new: true }
    )
      .populate({
        path: "_user",
        select: "_id name picture",
      })
      .populate({ path: "_comments", populate: [{ path: "_user" }] });
    await newLike.save();
    // console.log(likedPost);
    res.status(201).json(likedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  const { id } = req.params;
  const _user = req.user._id;

  try {
    const unlikedPost = await Post.findByIdAndUpdate(
      id,
      {
        $inc: { likesCount: -1 },
      },
      { new: true }
    )
      .populate({
        path: "_user",
        select: "_id name picture",
      })
      .populate({ path: "_comments", populate: [{ path: "_user" }] });
    await Like.findOneAndDelete({ _user, _post: id });
    // console.log("unliked");
    res.status(201).json(unlikedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.getLike = async (req, res) => {
  const { id } = req.params;
  const _user = req.user._id;
  try {
    const checkLike = await Like.exists({ _post: id, _user });
    // console.log(checkLike);
    res.status(200).json(checkLike);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
