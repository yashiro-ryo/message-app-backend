import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import http from "http";
import helmet from "helmet";
import { Server as SocketIo } from "socket.io";
import express, { Request, Response } from "express";
import cors from "cors";

import "express-async-errors";
import authService from "./service/authService";
import usersService from "./service/usersService";
import talkpageService from "./service/talkpageService";
import router from './router/router';
import routine from './service/routineService'
import Log from "./Tools/Log";
import routineService from "./service/routineService";

const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(
  cors({
    origin: "http://localhost:3000", //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Login page
app.get("/login", (req: Request, res: Response) => {
  return res.sendFile("login.html", { root: viewsDir });
});

// auth login
app.post("/login", (req: Request, res: Response) => {
  // check user and add token
  authService.login(req.body.email, req.body.password).then((value) => {
    res.send(value);
  });
});

/************************************************************************************
 *                                   Setup Socket.io
 * Tutorial used for this: https://www.valentinog.com/blog/socket-react/
 ***********************************************************************************/

const server = http.createServer(app);
const io = new SocketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  let handshake = socket.handshake;
  const token = handshake.query.token;
  if (token) {
    Log.v(token);
    return next();
  }
  return next(new Error("login failed"));
});

io.on("connect", (socket) => {
  router.setupEventHandler(socket);
  routineService.routine(socket, Number(socket.handshake.query.id))
  return app.set("socketio", io);
});

/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default server;
