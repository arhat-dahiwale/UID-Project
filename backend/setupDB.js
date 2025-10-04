// setupDB.js

const mysql = require('mysql2/promise');

async function setup() {
    try {
        
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',     
            password: 'Sicap0ll0!',       
            multipleStatements: true
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS cinesphere_db;`);
        console.log('Database created or already exists.');

        
        await connection.query(`USE cinesphere_db;`);

        
        const createTablesSQL = `
        CREATE TABLE IF NOT EXISTS Movies (
            Movie_ID INT AUTO_INCREMENT PRIMARY KEY,
            Movie_Name VARCHAR(255) NOT NULL,
            Genre VARCHAR(50),
            isPremium BOOLEAN DEFAULT 0,
            Booking_Platform VARCHAR(255),
            OTTs VARCHAR(255),
            Details TEXT
        );

        CREATE TABLE IF NOT EXISTS Actors (
            Actor_ID INT AUTO_INCREMENT PRIMARY KEY,
            Actor_Name VARCHAR(255) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Admin (
            Admin_ID INT AUTO_INCREMENT PRIMARY KEY,
            Admin_Name VARCHAR(255) NOT NULL,
            Password VARCHAR(255) NOT NULL,
            Email_ID VARCHAR(255) UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Consumers (
            Consumer_ID INT AUTO_INCREMENT PRIMARY KEY,
            Email_ID VARCHAR(255) UNIQUE NOT NULL,
            Password VARCHAR(255) NOT NULL,
            DOB DATE,
            isPremium BOOLEAN DEFAULT 0
        );

        -- M–M tables
        CREATE TABLE IF NOT EXISTS Acts_in (
            Movie_ID INT,
            Actor_ID INT,
            PRIMARY KEY(Movie_ID, Actor_ID),
            FOREIGN KEY(Movie_ID) REFERENCES Movies(Movie_ID) ON DELETE CASCADE,
            FOREIGN KEY(Actor_ID) REFERENCES Actors(Actor_ID) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS Views (
            Movie_ID INT,
            Consumer_ID INT,
            PRIMARY KEY(Movie_ID, Consumer_ID),
            FOREIGN KEY(Movie_ID) REFERENCES Movies(Movie_ID) ON DELETE CASCADE,
            FOREIGN KEY(Consumer_ID) REFERENCES Consumers(Consumer_ID) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS Views_Actors (
            Actor_ID INT,
            Consumer_ID INT,
            PRIMARY KEY(Actor_ID, Consumer_ID),
            FOREIGN KEY(Actor_ID) REFERENCES Actors(Actor_ID) ON DELETE CASCADE,
            FOREIGN KEY(Consumer_ID) REFERENCES Consumers(Consumer_ID) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS Manages (
            Admin_ID INT,
            Movie_ID INT,
            PRIMARY KEY(Admin_ID, Movie_ID),
            FOREIGN KEY(Admin_ID) REFERENCES Admin(Admin_ID) ON DELETE CASCADE,
            FOREIGN KEY(Movie_ID) REFERENCES Movies(Movie_ID) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS Manages_details (
            Admin_ID INT,
            Actor_ID INT,
            PRIMARY KEY(Admin_ID, Actor_ID),
            FOREIGN KEY(Admin_ID) REFERENCES Admin(Admin_ID) ON DELETE CASCADE,
            FOREIGN KEY(Actor_ID) REFERENCES Actors(Actor_ID) ON DELETE CASCADE
        );
        `;

        await connection.query(createTablesSQL);
        console.log('Tables created successfully.');

        await connection.end();
        console.log('Setup complete. You can now connect your backend to this database.');
    } catch (err) {
        console.error('Error setting up database:', err);
    }
}


setup();
