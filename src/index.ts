import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import cron from "node-cron";
import "./config/passport";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

dotenv.config();
//const PORT = process.env.PORT;
const PORT = process.env.PORT || 5000;

import userRoute from "./routes/user.route";
import vendorRoute from "./routes/vendor.route";
import swaggerRoute from "./config/SwaggerConfig";
import productRoute from "./routes/product.route";
import adminRoute from "./routes/roles.route";
import forgotPassword from "./routes/forget.password.router";
import authRoute from "./routes/auth.router";
import roleRoute from "./routes/roles.route";
import checkoutRoute from "./routes/checkout.router";
import googleAuthRoute from "./routes/googleAuth.route";
import cartroute from "./routes/cart.route";
import TwoFaRoute from "./routes/2fa.route";
import orderRoute from "./routes/order.route";
import wishlistroute from "./routes/wishlist.route";
import statistics from "./routes/statistics.route";
import {
  checkExpiredProducts,
  checkExpiringProducts,
} from "./helpers/expiring";
import subscriptionRoute from "./routes/subscription.route";
import notificationRoute from "./routes/notifications.route";

const app = express();
const httpServer = http.createServer(app);
const ioServer = new SocketIOServer(httpServer);

const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true,
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "crafters1234",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use("/", userRoute);
app.use("/", authRoute);
app.use("/", productRoute);
app.use("/", forgotPassword);
app.use("/", productRoute);
app.use("/", vendorRoute);
app.use("/", roleRoute);
app.use("/", orderRoute);
app.use("/", checkoutRoute);
app.use("/", googleAuthRoute);
app.use("/", subscriptionRoute);
app.use("/", notificationRoute);
app.use("/api-docs", swaggerRoute);
app.use("/admin", adminRoute);
app.use("/", cartroute);
app.use("/", wishlistroute);
app.use("/", TwoFaRoute);
app.use("/", statistics);

cron.schedule("0 0 * * *", () => {
  checkExpiredProducts();
});
cron.schedule("0 0 1 * *", () => {
  checkExpiringProducts();
});

const server = httpServer.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
  checkExpiringProducts();
  checkExpiredProducts();
});

export { app, server, ioServer };
