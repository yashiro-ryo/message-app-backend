import { StatusCodes } from 'http-status-codes';
import mysql from 'mysql2/promise'
import config from '../config/dbConfig'

/**
 * トークルーム取得
 * @param userId :number
 * @returns Array<{talkroomId: number, talkroomName: string}>
 */
async function getTalkrooms(userId: number) {
  try {
    const con = await mysql.createConnection(config);
    const [talkrooms] = await con.query(
      "select talkroomId, talkroomName from talkroom where userId=" + userId
    );
    console.log(talkrooms);
    con.end;
    return talkrooms;
  } catch (e) {
    console.error(e);
  }
}

/**
 * トーク取得
 * @param talkroomId :number
 * @returns Array<{}>
 */
async function getTalk(talkroomId: number) {
  try {
    const con = await mysql.createConnection(config);
    const [result] = await con.query(
      `select talkroomId, sentUserId, msgBody, sentTime from message where talkroomId = ${talkroomId}`
    );
    console.log(result);
    con.end();
    return result;
  } catch (e) {
    console.error(e);
  }
}

/**
 * メッセージ送信
 * @param {talkroomId: number, userId: number, msgBody: string, sentTime: number}
 * @returns { StatusCodes : number} // okで200
 */
async function submitMessage(talkroomId: number, userId: number, msgBody: string, sentTime: number): Promise<number>{
  try{
    const con = await mysql.createConnection(config);
    con.query(`insert into message value (null, ${talkroomId}, ${userId}, '${msgBody}', ${sentTime})`);
    return 200;
  }catch(e){
    console.log('msg-send failed code= 400')
    return 500;
  }
}

export default {
  getTalkrooms,
  getTalk,
  submitMessage
} as const