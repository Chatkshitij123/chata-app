//video 19
const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");
const filterObj = require("../utils/filterObj");

exports.updateMe = async (req, res, next) => {
  //in order to fetch the user profile we need to fetch the user here
  const { user } = req;
  //user-document or record //User- this is a model-//document-it is a like a single record//model-it is like the blueprint of the model

  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "about",
    "avatar"
  );
  const updated_user = await User.findByIdAndUpdate(user._id, filteredBody, {
    new: true,
    validateModifiedOnly: true,
  });

  res.status(200).json({
    status: "success",
    data: updated_user,
    message: "Profile updated successfully",
  });
};

//video 25
exports.getUsers = async (req, res, next) => {
  const all_users = await User.find({
    verified: true,
  }).select("firstName lastName _id");

  const this_user = req.user; //it goes through protected api

  const remaining_users = all_users.filter(
    (user) =>
      !this_user.friends.includes(user._id) &&
      user._id.toString() !== req.user._id.toString()
  );

  res.status(200).json({
    status: "success",
    data: remaining_users,
    message: "Users found successfully",
  });
};

//video 26
exports.getRequests = async (req, res, next) => {
  const requests = await FriendRequest.find({
    recipient: req.user._id,
  }).populate("sender", "_id firstName lastName");

  res.status(200).json({
    status: "success",
    data: requests,
    message: "Friends requests found successfully",
  });
};
exports.getFriends = async (req, res, next) => {
  const this_user = await User.findById(req.user._id).populate(
    "friends",
    "_id firstName lastName"
  );

  res.status(200).json({
    status: "success",
    data: this_user.friends,//Now this is going to return an array to our client side
    message: "Friends found successfully",
  });
};
