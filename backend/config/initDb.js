const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL server');

    // Create database
    db.query('CREATE DATABASE IF NOT EXISTS mrs_db', (err) => {
        if (err) {
            console.error('Error creating database:', err);
            process.exit(1);
        }
        console.log('Database created or already exists');

        // Use the database
        db.query('USE mrs_db', (err) => {
            if (err) {
                console.error('Error using database:', err);
                process.exit(1);
            }
            console.log('Using mrs_db database');

            // Create users table
            const createUsersTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    username VARCHAR(255) NOT NULL UNIQUE,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    role ENUM('user', 'admin', 'maintenance') DEFAULT 'user',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            db.query(createUsersTable, (err) => {
                if (err) {
                    console.error('Error creating users table:', err);
                    process.exit(1);
                }
                console.log('Users table created or already exists');

                // Create maintenance_requests table
                const createMaintenanceRequestsTable = `
                    CREATE TABLE IF NOT EXISTS maintenance_requests (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        description TEXT NOT NULL,
                        status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
                        priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
                        user_id INT,
                        assigned_to INT,
                        date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id),
                        FOREIGN KEY (assigned_to) REFERENCES users(id)
                    )
                `;

                db.query(createMaintenanceRequestsTable, (err) => {
                    if (err) {
                        console.error('Error creating maintenance_requests table:', err);
                        process.exit(1);
                    }
                    console.log('Maintenance requests table created or already exists');

                    // Create announcements table
                    const createAnnouncementsTable = `
                        CREATE TABLE IF NOT EXISTS announcements (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            title VARCHAR(255) NOT NULL,
                            content TEXT NOT NULL,
                            priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
                            created_by INT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (created_by) REFERENCES users(id)
                        )
                    `;

                    db.query(createAnnouncementsTable, (err) => {
                        if (err) {
                            console.error('Error creating announcements table:', err);
                            process.exit(1);
                        }
                        console.log('Announcements table created or already exists');
                        console.log('Database setup completed successfully');
                        process.exit(0);
                    });
                });
            });
        });
    });
}); 