const fs = require('fs')
const express = require('express')
const bodyParser=require('body-parser')
const app =express()
const port = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true}))

const data = fs.readFileSync('./database.json')
const conf = JSON.parse(data)
const mysql = require('mysql')

const connection= mysql.createConnection({
    host:conf.host,
    user:conf.user,
    password:conf.password,
    port:conf.port,
    database:conf.database
})

app.get('/api/memo',(req,res)=>{
    connection.query(
        "SELECT * FROM MEMO WHERE isDeleted = 0",
        (err,rows,fields)=>{
            res.send(rows)
        }
    )
})

app.get('/api/STUDY',(req,res)=>{
    connection.query(
        "SELECT * FROM STUDY  WHERE isDeleted = 0",
        (err,rows,fields)=>{
            res.send(rows)
        }
    )
})


app.post('/api/memo',(req,res)=>{
    let sql= 'INSERT INTO MEMO VALUES (null, ? ,?, now() ,0,?)'
    let memoTitle=req.body.memoTitle
    let memoContent=req.body.memoContent
    let today= req.body.today
    let params =[memoTitle,memoContent,today]
    connection.query(sql,params,(err,rows,fields)=>{
        res.send(rows)
    })
    console.log(today)
})


app.post('/api/STUDY',(req,res)=>{
    let sql= 'INSERT INTO STUDY VALUES (null,0,?,0,0)'
    let studyContent=req.body.studyContent
    let params =[studyContent]
    connection.query(sql,params,(err,rows,fields)=>{
        res.send(rows)
    })
})


app.delete('/api/memo/:id',(req,res)=>{
    let sql ='UPDATE MEMO SET isDeleted = 1 WHERE id = ?';
    let params = [req.params.id]
    connection.query(sql,params,(err,rows,fields)=>{
        res.send(rows)
    })
})

app.delete('/api/STUDY/:id',(req,res)=>{
    let sql ='UPDATE STUDY SET isDeleted = 1 WHERE id = ?'
    let params = [req.params.id]
    connection.query(sql,params,(err,rows,fields)=>{
        res.send(rows)
    })
})

app.put('/api/STUDY',(req,res)=>{
    let sql = 'UPDATE STUDY SET checked = 1 WHERE id = ?    '
    let id= req.body.id
    let checked=req.body.checked
    let params =[id,checked]
    connection.query(sql,params,(err,rows,fields)=>{
        res.send(rows)
    })
})

app.put('/api/STUDY/change/:id',(req,res)=>{
    let sql = `UPDATE STUDY SET studyContent = ? WHERE id = ?`
    let studyContent= req.body.studyContent
    let id = req.body.id
    let url = req.body.url
    // let params =[id,studyContent]
    let params =[studyContent,id]
    console.log(url)
    console.log(studyContent)
    // console.log(id)

    connection.query(sql,params,(err,rows,fields)=>{
        res.send(rows)
    }
    )
})






/*checked = 1 WHERE id = ?  */
//checked 가 1이면 0으로바꾸고 0이면 1로 바꾸는 
//checked 0인 것과 1인 것
//select
app.listen(port,()=>console.log(`Listening on port ${port}`))

