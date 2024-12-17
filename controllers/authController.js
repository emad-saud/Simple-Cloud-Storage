const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24
    ),
    httpOnly: true,
  };

  console.log(token);
  console.log("slfkjslfj");

  res.cookie("jwt", token, cookieOptions);
  user = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const verify = async (token) =>
  new Promise((res, rej) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, val) => {
      if (val) {
        res(val);
      }
      if (err) {
        rej(err);
      }
    });
  });

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.create({ name, email, password, passwordConfirm });
  createSendToken(user, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new AppError("Incorrect email or password", 401));

  if (!(await user.checkPassword(password, user.password)))
    return next(new AppError("Incorrect email or password", 401));

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    [, token] = req.headers.authorization.split(" ");
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verify the token
  const decoded = await verify(token);
  if (!decoded) {
    return next(new AppError("token verification failed!"));
  }
  // // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        403
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await verify(req.cookies.jwt);
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) return next();

      if (currentUser.changedPasswordAfter(decoded.iat)) return next();

      res.locals.user = currentUser;
      req.user = currentUser;
    } catch (err) {
      return next();
    }
  }
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError("You dont have permission to perform this aciton!", 403)
      );
    }
    next();
  };
};
