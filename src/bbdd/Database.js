const mysql = require('mysql');

/**
 * Clase que gestiona la conexion con la base de datos y el lanzamiento de las querys
 */
class Database {
    /**
     * Constructor de la clase Database 
     * host: host, // replace with your database host
     * user: user, // replace with your database username
     * password: password, // replace with your database password
     * database: 'selectddbb'
     */
    constructor(host = 'localhost', user = 'root', password = '', database = 'luabot') {
        this.connection = mysql.createConnection({
            host: host,
            user: user, // replace with your database username
            password: password, // replace with your database password
            database: database // replace with your database name
        });
        this.connection.connect(error => {
            if (error) {
                console.error('Error connecting to the database: ' + error.stack);
                return;
            }
            console.log('Connected to database with ID ' + this.connection.threadId);
        });
    }
    /**
     * Lanza una query a la base de datos
     * @param {*} sql 
     * @param {*} args 
     * @returns 
     */
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
    /**
     * Cierra la conexion con la base de datos
     * @returns 
     */
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(error => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });
    }
}

module.exports = Database;