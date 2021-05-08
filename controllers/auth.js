const bcryptjs = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");

  if (message.length) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    error: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");

  if (message.length) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    error: message,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email");
        return res.redirect("/login");
      }
      bcryptjs
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid password");
          res.redirect("/login");
        })
        .catch(() => res.redirect("/login"));
    })
    .catch((err) => {
      console.log("🚀 ~ file: auth.js ~ line 30 ~ err", err);
    });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email })
    .then((userDoc) => {
      console.log("🚀 ~ file: auth.js ~ line 42 ~ .then ~ userDoc", userDoc);
      if (userDoc) {
        req.flash("error", "Email already exist");
        return res.redirect("/signup");
      }

      return bcryptjs
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });

          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })

    .catch(console.log);
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(
      "🚀 ~ file: auth.js ~ line 41 ~ req.session.destroy ~ err",
      err
    );
    res.redirect("/");
  });
};
