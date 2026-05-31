const { USE_DB } = require('./config');

// ── DB MODE ───────────────────────────────────────────────────────────────────
// Active when USE_DB=true (default).
// Requires MySQL + back-end/lscustoms_create.sql / lscustoms_insert.sql
// const pool = USE_DB ? require(__dirname + "\\db.include.js") : null; // original (Windows-only path, breaks on Linux/Vercel)
const pool = USE_DB ? require('./db.include') : null;

// ── JSON MODE ─────────────────────────────────────────────────────────────────
// Active when USE_DB=false. Passwords in data/users.json are plain-text demo
// passwords (not hashed). Do NOT use JSON mode for production.
const WRITE_DISABLED = 'Write operations require a database (set USE_DB=true and configure MySQL).';
const usersData = !USE_DB ? require('../data/users.json') : null;

// TODO (everyone): Registration...
// user_id, user_created, user_name, user_email, user_role, user_pass
// INSERT INTO users VALUES (NULL, now(), 'bill', 'bill@bill.bill', 'USER', sha2(concat(now(), 'billpass'), 224) );

// TODO (optional): Edit user... Change Password...

// TODO  (not now): Email verification... User activation... Better hash (bcrypt, pbkdf2, argon2)... Password rules...

module.exports = {
    async getOneUser(userName) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                let conn = await pool.getConnection();
                let sql = "SELECT user_id,user_created,user_name,user_email,user_role FROM users WHERE user_name = ? ";
                // must leave out the password+hash info from result!
                const [rows, fields] = await pool.execute(sql, [userName]);
                if (rows.length == 1) {
                    return rows[0];
                } else {
                    return false;
                }
            } catch (err) {
                console.log(err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            const user = usersData.find(u => u.user_name === userName);
            if (!user) return false;
            // Return without password (same behaviour as DB query above)
            const { user_pass, ...userWithoutPass } = user;
            return userWithoutPass;
        }
        // Note: DB query also returns user_created; keep JSON parity via users.json fields
    },

    async areValidCredentials(username, password) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
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
            // ─────────────────────────────────────────────────────────────────
        } else {
            // JSON mode: plain-text password comparison (demo only, not for production)
            const user = usersData.find(u => u.user_name === username && u.user_pass === password);
            return !!user;
        }
    },

    async registerNewUser(user) {
        if (USE_DB) {
            // ── original DB code ──────────────────────────────────────────────
            try {
                console.log('Adding user: ', user);
                let sql = `
                    INSERT INTO users (
                        user_role,
                        user_created,
                        user_name,
                        user_pass,
                        user_email
                    ) VALUES ("USER", now(), ?, sha2(concat(now(), ?), 224), ?)
                `;
                const [result] = await pool.execute(sql, [
                    user.username,
                    user.password,
                    user.email
                ]);
                return result.insertId;
            } catch (err) {
                console.error("Error in registerNewUser:", err);
                throw err;
            }
            // ─────────────────────────────────────────────────────────────────
        } else {
            throw new Error(WRITE_DISABLED);
        }
    },
};
