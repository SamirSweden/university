// in order to create this project use Node.js 
// npm init -y
// npm install sqlite3 
// to run code use (  node app.js  )

// Node.js + SQL 


const { 
    createTables, 
    insertData, 
    showStudents, 
    showGrades, 
    showAverageGrades,
    showStudentsByFaculty,
    db 
} = require('./database');
// we need database.js so import the file database.js
async function main() {
    console.log('🎓 Student Database Management System\n');
    
    createTables();
    
    setTimeout(() => {
        insertData();
        
        setTimeout(() => {
            showStudents(() => {
                showGrades(() => {
                    showAverageGrades(() => {
                        showStudentsByFaculty('Computer Science', () => {
                            console.log('\n✅ Program completed');
                            db.close();
                        });
                    });
                });
            });
        }, 1000);
    }, 1000);
}

main();
