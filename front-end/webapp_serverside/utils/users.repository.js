pool = require(__dirname + "\\db.include.js");

// TODO (everyone): Registration...
// user_id, user_created, user_name, user_email, user_role, user_pass
// INSERT INTO users VALUES (NULL, now(), 'bill', 'bill@bill.bill', 'USER', sha2(concat(now(), 'billpass'), 224) );

// TODO (optional): Edit user... Change Password...

// TODO  (not now): Email verification... User activation... Better hash (bcrypt, pbkdf2, argon2)... Password rules...

module.exports = {
  async getOneUser(userName) {
    try {
      let conn = await pool.getConnection();
      let sql = "SELECT user_id,user_name,user_email,user_role FROM users WHERE user_name = ? "; 
      // must leave out the password+hash info from result!
      const [rows, fields] = await pool.execute(sql, [ userName ]);
      if (rows.length == 1) {
        return rows[0];
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  
  async areValidCredentials(username, password) {
    try {
      let sql = "SELECT * FROM USERS WHERE user_name = ? AND user_pass COLLATE utf8mb4_general_ci  = sha2(concat(user_created, ?), 224) COLLATE utf8mb4_general_ci "; 
      // TODO: better salt + pw hash (bcrypt, pbkdf2, argon2)
      // COLLATE usually not needed (mariaDb compatibility)
      const [rows, fields] = await pool.execute(sql, [username, password]); 
      console.log(rows);
      if (rows.length == 1 && rows[0].user_name === username) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}; 