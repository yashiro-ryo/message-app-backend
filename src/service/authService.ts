import jwtUtil from "@util/jwt-util";
import mysql from "mysql2/promise";
import config from "../config/dbConfig";

/**
 * Login()
 */
async function login(email: string, password: string) {
  const con = await mysql.createConnection(config);
  // Fetch user
  // TODO 型をどうにかする
  const [user]: any = await con.query(
    `select id, name, password from user where email = "${email}"`
  );
  if (user.length == 0 || user.length >= 2) {
    throw console.log("cannot find user");
    // TODO send login.html
  }
  // Check password
  if (password === user[0].password) {
    con.end();
    // return signed jwt
    return {
      id: user[0].id,
      name: user[0].name,
      token: jwtUtil.sign({
        id: user[0].id,
        email: user[0].name,
        name: user[0].name,
      }),
    };
  } else {
    con.end();
    throw console.log("unmatch password");
    // TODO send login.html
  }
}

// Export default
export default {
  login,
} as const;
