const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

const authenticatedUser = (username, password) => {
  let validusers = users.filter(
    (user) => user.name === username && user.passeord === password
  );
  return validusers.length > 0;
};

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !passeord) {
    return res.status(404).json({ message: "Error log in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };

    return next();
  }
});

const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
