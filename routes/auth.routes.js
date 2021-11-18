const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

/* SIGNUP page*/
router
  .route("/signup")
  .get((req, res) => {
    res.render("auth/signup");
  })
  .post(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        username,
        email,
        passwordHash,
      });
      console.log(newUser);
      res.redirect("/auth/login");
    } catch (err) {
      console.log;
    }
  });

/* LOGIN page*/
router
  .route("/login")
  .get((req, res) => res.render("auth/login"))
  .post(async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email === "" || password === "") {
        res.render("auth/login", {
          errorMessage: "Please enter both, email and password to login.",
        });
        return;
      }

      const user = await User.findOne({ email });
      if (!user)
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
      else if (await bcrypt.compare(password, user.passwordHash))
        res.render("index");
      else res.render("auth/login", { errorMessage: "Password incorrect" });
    } catch (err) {
      console.log;
    }
  });

module.exports = router;
