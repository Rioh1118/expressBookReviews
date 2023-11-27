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

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  if (req.session.authorization) {
    // セッションからトークンを取得
    token = req.session.authorization["accessToken"];

    // トークンを検証
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        // トークンが正常であれば、ユーザーオブジェクトをリクエストに追加して次のミドルウェアへ制御を渡す
        req.user = user;
        next();
      } else {
        // トークンが無効な場合、エラーレスポンスを返す
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    // セッションに認証情報が存在しない場合、エラーレスポンスを返す
    return res.status(403).json({ message: "User not logged in" });
  }
});

const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
