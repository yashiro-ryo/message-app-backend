import mysql from "mysql2/promise";
import jwtUtil from '@util/jwt-util';

// db config
const config = {
  host: "localhost",
  user: "root",
  password: "LTDEXPuzushio22@",
  database: "message-app",
};

// login
async function login(email: string, password: string) {
  try {
    const con = await mysql.createConnection(config);
    const [result]: any = await con.query(
      `select id, password, name from user where email='${email}'`
    );
    console.log(result);
    con.end;
  } catch (e) {
    console.error(e);
  }
}

// get-users
// memo 
// friendIdからuserId, userNameを指定して返却しなければならない
async function getUsers(userId: number) {
  try {
    // name: string, id: number
    const con = await mysql.createConnection(config);
    const [users]: any = await con.query(
      `select id, name from user where id in (select friendId from friends where userId = ${userId})`
    );
    console.log(users);
    con.end();
    return users;
  } catch (e) {
    console.error(e);
  }
}

// get-talkroom
async function getTalkrooms(userId: number) {
  try {
    const con = await mysql.createConnection(config);
    const [talkrooms] = await con.query(
      "select talkroomId, talkroomName from talkroom where userId=" + userId
    );
    console.log("talkroom :" + talkrooms);
    con.end;
    return talkrooms;
  } catch (e) {
    console.error(e);
  }
}

// get-talk
async function getTalk(talkroomId: number) {
  try {
    const con = await mysql.createConnection(config);
    const [result] = await con.query(
      "select password from user where email=" + talkroomId
    );
    console.log(result);
    con.end();
    return result;
  } catch (e) {
    console.error(e);
  }
}

export default {
  login,
  getUsers,
  getTalkrooms,
  getTalk,
} as const;
