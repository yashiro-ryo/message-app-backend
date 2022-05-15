import { Socket } from "socket.io";
import talkpageService from "src/service/talkpageService";
import usersService from "src/service/usersService";
import Log from "../Tools/Log";

function setupEventHandler(socket: Socket) {
  /* talkpage */
  // トーク更新
  socket.on("update-talk", (talkroomId: number) => {
    talkpageService.getTalk(talkroomId).then((talk) => {
      socket.emit("update-client-talk", talk);
    });
  });

  // メッセージ送信
  socket.on(
    "submit-message",
    (
      talkroomId: number,
      sentUserId: number,
      msgBody: string,
      sentTime: string
    ) => {
      // TODO 時刻型の修正
      talkpageService
        .submitMessage(talkroomId, sentUserId, msgBody, Number(sentTime))
        .then((statusCode) => {
          socket.emit("send-client-submit-status-code", statusCode);
        });
    }
  );

  /* talkroom */
  // トークルーム更新
  socket.on("update-talkrooms", (userId: number) => {
    talkpageService.getTalkrooms(userId).then((talkrooms) => {
      socket.emit("update-client-talkroom", talkrooms);
    });
  });

  // トークルーム作成
  socket.on("create-talkroom", (name: string, userIds: Array<number>) => {
    Log.v("called create talkroom ;" + name + ", " + userIds);
  });

  /* users */
  // 連絡先更新
  socket.on("update-users", (userId: number) => {
    usersService.getAllUsers(userId).then((users) => {
      socket.emit("update-client-users", users);
    });
  });

  // ユーザー検索
  socket.on("search-user", (email: string, name: string) => {
    Log.v("called serach user :" + email + ", " + name);
  });

  // ユーザー削除
  socket.on("delete-user", (userId: number) => {
    Log.v("called delete user :" + userId);
  });
}

export default {
  setupEventHandler,
} as const;
