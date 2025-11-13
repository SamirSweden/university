const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('university.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('[+] ✅Connected to Database');
    }
});

function createTables() {
    const queries = [
        `CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            faculty TEXT,
            year INTEGER
        )`,
        
        `CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            teacher TEXT
        )`,
        
        `CREATE TABLE IF NOT EXISTS student_courses (
            student_id INTEGER,
            course_id INTEGER,
            grade INTEGER,
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (course_id) REFERENCES courses(id)
        )`,

        `CREATE TABLE IF NOT EXISTS users (
            id       INTEGER PRIMARY KEY,
            username TEXT NOT NULL ,
            email    TEXT UNIQUE NOT NULL ,
            role     TEXT NOT NULL
        )`,

    ];
    
    queries.forEach(query => {
        db.run(query, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            }
        });
    });
    
    console.log('[+] ✅Tables created');
}

function insertData() {
    db.run('DELETE FROM students');
    db.run('DELETE FROM courses');
    db.run('DELETE FROM student_courses');
    
    const students = [
        [1, 'John Smith', 'Computer Science', 2],
        [2, 'Maria Garcia', 'Mathematics', 1],
        [3, 'Alex Johnson', 'Computer Science', 3]
    ];
    
    students.forEach(student => {
        db.run('INSERT INTO students VALUES (?, ?, ?, ?)', student);
    });
    
    const courses = [
        [101, 'Database Systems', 'Prof. Smith'],
        [102, 'Programming', 'Prof. Johnson'],
        [103, 'Algebra', 'Prof. Davis']
    ];
    
    courses.forEach(course => {
        db.run('INSERT INTO courses VALUES (?, ?, ?)', course);
    });
    
    const enrollments = [
        [1, 101, 85],
        [1, 102, 90],
        [2, 103, 78],
        [3, 101, 92],
        [3, 102, 88]
    ];
    
    enrollments.forEach(enrollment => {
        db.run('INSERT INTO student_courses VALUES (?, ?, ?)', enrollment);
    });


    const users = [
        [1,'admin', 'admin@university.com', 'Administrator'],
        [2, 'john_doe', 'john@university.com', 'Student'],
        [3, 'maria_g', 'maria@university.com', 'Student'],
        [4, 'prof_smith', 'smith@university.com', 'Teacher']
    ];

    users.forEach(user => {
        db.run('INSERT INTO users VALUES (?,?,?,?)' , user)
    })
    
    console.log('[+] ✅Data for users added successfully ');
}





function showStudents(callback) {
    console.log('\n=== Student List ===');
    db.all('SELECT * FROM students', (err, rows) => {
        if (err) {
            console.error('Error:', err);
        } else {
            rows.forEach(row => {
                console.log(`${row.id}. ${row.name} - ${row.faculty}, Year ${row.year}`);
            });
        }
        if (callback) callback();
    });
}

function showGrades(callback) {
    console.log('\n=== Student Grades ===');
    const query = `
        SELECT s.name, c.title, sc.grade 
        FROM students s
        JOIN student_courses sc ON s.id = sc.student_id
        JOIN courses c ON sc.course_id = c.id
    `;
    
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error:', err);
        } else {
            rows.forEach(row => {
                console.log(`${row.name} - ${row.title}: ${row.grade}`);
            });
        }
        if (callback) callback();
    });
}

function showAverageGrades(callback) {
    console.log('\n=== Average Grades by Course ===');
    const query = `
        SELECT c.title, AVG(sc.grade) as average_grade
        FROM courses c
        JOIN student_courses sc ON c.id = sc.course_id
        GROUP BY c.title
    `;
    
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error:', err);
        } else {
            rows.forEach(row => {
                console.log(`${row.title}: ${row.average_grade.toFixed(1)}`);
            });
        }
        if (callback) callback();
    });
}

function showStudentsByFaculty(faculty, callback) {
    console.log(`\n=== Students in ${faculty} ===`);
    const query = `
        SELECT * FROM students 
        WHERE faculty = ?
    `;
    
    db.all(query, [faculty], (err, rows) => {
        if (err) {
            console.error('Error:', err);
        } else {
            if (rows.length === 0) {
                console.log('[-] No students found in this faculty');
            } else {
                rows.forEach(row => {
                    console.log(`${row.id}. ${row.name} - Year ${row.year}`);
                });
            }
        }
        if (callback) callback();
    });
}


function UsersDb(callback){
    console.log('\n=== Users List ===');

    db.all('SELECT * FROM users ' , (err,rows) => {
        if(err) console.log('[+] Error ' + err);
        else {
            rows.forEach(row => {
                console.log(`${row.id}. ${row.username} - ${row.email} [${row.role}]`);
            })
        }

        if (callback) callback();
    })
}


module.exports = {
    db,
    createTables,
    insertData,
    showStudents,
    showGrades,
    showAverageGrades,
    showStudentsByFaculty,
    UsersDb
};
