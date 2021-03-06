/** User class for message.ly */
const bcrypt = require("bcrypt");
const db = require("../db");
const { SECRET_KEY, BCRYPT_WORK_ROUNDS } = require("../config")

/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {
    // hash password
    const hashedPW = await bcrypt.hash(password, BCRYPT_WORK_ROUNDS);

    // insert into database
    const result = await db.query(`
      INSERT INTO users (username, password, first_name, last_name, phone, join_at)
        VALUES ($1, $2, $3, $4, $5, current_timestamp)
        RETURNING username, password, first_name, last_name, phone`, 
      [username, hashedPW, first_name, last_name, phone]);

    // return {username, hashedpassword, first_name, last_name, phone}
    return result.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    // check if username exists
    const result = await db.query(`
      SELECT password FROM users
        WHERE username = $1`,
      [username]
    );
    
    // get hashed password
    const hashedPW = result.rows[0].password;

    // return boolean
    return await bcrypt.compare(password, hashedPW);
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { 

  }

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() { }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}


module.exports = User;