import mysql from "mysql2/promise";
import config from "../config/dbConfig";

/**
 * 自分のユーザーidから友達を取得
 * @param id: number
 * @returns Array<{id: number, name: string}>
 */
async function getAllUsers(id: number) {
  try {
    // name: string, id: number
    const con = await mysql.createConnection(config);
    const [users]: any = await con.query(
      `select user_id, name from user where user_id in (select friend_user_id from user_friend where user_id = ${id})`
    );
    con.end();
    return users;
  } catch (e) {
    console.error(e);
  }
}

export default {
  getAllUsers,
} as const;
