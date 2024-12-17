const User = require("../models/userModel");
const File = require("../models/fileModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOverview = async (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  if (!req.user)
    return res.status(404).json({
      status: "success",
      message: "shit",
    });
  const files = await File.find({ user: req.user._id });

  res.status(200).render("overview", {
    files,
  });
};

exports.getLogin = (req, res, next) => {
  res.status(200).render("login");
};

exports.getSignUp = (req, res, next) => {
  res.status(200).render("signUp");
};
