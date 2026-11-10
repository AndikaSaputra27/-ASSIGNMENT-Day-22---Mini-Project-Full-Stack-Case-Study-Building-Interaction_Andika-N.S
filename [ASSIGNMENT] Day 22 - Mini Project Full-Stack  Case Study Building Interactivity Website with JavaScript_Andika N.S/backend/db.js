const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const databaseDirectory = path.join(__dirname, "database");

if (!fs.existsSync(databaseDirectory)) {
    fs.mkdirSync(databaseDirectory, { recursive: true });
}

const databasePath = path.join(databaseDirectory, "shop.db");

const db = new sqlite3.Database(databasePath, (error) => {
    if (error) {
        console.error("Gagal membuka database:", error.message);
    } else {
        console.log("SQLite database terhubung.");
    }
});

function initializeDatabase() {
    const schemaPath = path.join(databaseDirectory, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    return new Promise((resolve, reject) => {
        db.exec(schema, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    db,
    initializeDatabase
};