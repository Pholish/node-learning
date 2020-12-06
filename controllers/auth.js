const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("5bab316ce0a7c75f783cb8a8")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(
          "🚀 ~ file: auth.js ~ line 25 ~ req.session.save ~ err",
          err
        );
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log("🚀 ~ file: auth.js ~ line 30 ~ err", err);
    });
};

exports.postSignup = (req, res, next) => {};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(
      "🚀 ~ file: auth.js ~ line 41 ~ req.session.destroy ~ err",
      err
    );
    res.redirect("/");
  });
};
