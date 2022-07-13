const User = require("../models/user");
const Follow = require("../models/follow");

exports.getUser = (req, res) => {
  res.status(200).json(req.user);
};

exports.fetchUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  console.log(user.name + " is fetched");

  res.status(201);
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const { picture, name, profileDescription } = req.body;
  const { id } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { picture, name, profileDescription },
      { new: true }
    );
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.followUser = async (req, res) => {
  const { id } = req.params;
  const _user = req.user._id;

  try {
    const newFollow = new Follow({ followee: id, follower: _user });
    await newFollow.save();
    const newProfile = await User.findByIdAndUpdate(
      id,
      { $inc: { followerCount: 1 } },
      { new: true }
    );
    await User.findByIdAndUpdate(_user, { $inc: { followingCount: 1 } });
    res.status(200).json(newProfile);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  const { id } = req.params;
  const _user = req.user._id;
  try {
    await Follow.findOneAndDelete({ followee: id, follower: _user });
    const newProfile = await User.findByIdAndUpdate(
      id,
      { $inc: { followerCount: -1 } },
      { new: true }
    );
    await User.findByIdAndUpdate(_user, { $inc: { followingCount: -1 } });
    res.status(200).json(newProfile);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.getFollow = async (req, res) => {
  const { id } = req.params;
  const _user = req.user._id;
  try {
    const checkFollow = await Follow.exists({ followee: id, follower: _user });
    res.status(200).json(checkFollow);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
