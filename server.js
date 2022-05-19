const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// ใส่ค่าตามที่เราตั้งไว้ใน mysql
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
})

con.connect(err => {
    if (err) throw (err);
    else {
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve, reject) => {
        // query method
        con.query(sql, (err, result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post('/regisDB', async (req, res) => {
    let sql = "CREATE TABLE IF NOT EXISTS tableregis (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(45), email VARCHAR(45),password VARCHAR(45),tel VARCHAR(45))";
    let result = await queryDB(sql);
    sql = `INSERT INTO tableregis (name, email, password,tel) VALUES ("${req.body.name}", "${req.body.email}", "${req.body.password}","${req.body.tel}")`;
    result = await queryDB(sql);

    // let sql_msg = "CREATE TABLE IF NOT EXISTS msgInfo (msg_id INT AUTO_INCREMENT PRIMARY KEY, user VARCHAR(255), message VARCHAR(100))";
    // result = await queryDB(sql_msg);

    console.log("New record created successfullyone");
    return res.redirect('login.html');
})



let tablename = "tableregis";
//ทำให้สมบูรณ์
app.post('/checkLogin', async (req, res) => {
    // ถ้าเช็คแล้ว username และ password ถูกต้อง
    // return res.redirect('feed.html');
    // ถ้าเช็คแล้ว username และ password ไม่ถูกต้อง
    // return res.redirect('login.html?error=1')
    let sql = `SELECT email, password FROM tableregis`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    console.log(result);
    // เอามาจากหน้าlogin
    const username = req.body.username;
    const password = req.body.password;

    let obj = Object.keys(result);
    var isCorrect = false;
    // temp.name มาจากดาต้า
    for (var i = 0; i < obj.length; i++) {
        var temp = result[obj[i]];
        var dataUsername = temp.name;
        var dataPassword = temp.password;
        if (dataUsername == username && dataPassword == password) {
            isCorrect = true;
            res.cookie("name", username)
        }
    }
    if(isCorrect == true){
        console.log("ooo")
        res.cookie("name",username)
        return res.redirect("index.html")
    }
    else
    {
        console.log("wrong")
        return res.redirect("login.html?error=1")
    }


})



app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/register.html`);
});
