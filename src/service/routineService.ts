import { Socket } from "socket.io";
import usersService from "./usersService";
import talkpageService from "./talkpageService";

function routine(socket: Socket, userId: number) {
  /* routine */
  usersService.getAllUsers(userId).then((value) => {
    socket.emit("update-client-users", value);
  });
  talkpageService.getTalkrooms(userId).then((value) => {
    socket.emit("update-client-talkrooms", value);
  });
}

export default {
  routine,
} as const;
