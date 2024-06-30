const express = require("express")
const app = express()
const nunjucks = require("nunjucks")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const {user, findUser} = require("./user.js")

const session = {}

app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.set("view engine", "html")
nunjucks.configure("./views", {
    express: app,
    watch: true
})

app.use('/', express.static("./public"))

app.get("/", (req, res)=>{
    res.setHeader("Set-Cookie", "token=1")
    res.render("index3.html")
})

app.get("/login", (req, res)=>{
    if(req.headers.cookie){
        let data = req.headers.cookie
        let sessionId = data.split('=')[1]
        res.render('index_login.html', {
            sessionId
        })
    }
    else{
        res.render("index4.html")
    }
    
})

app.get("/user/login", (req, res)=>{
    let msg = req.query.msg
    res.render('./user/login.html', {
        msg
    })
})

app.post("/user/login", (req, res)=>{
    let { userid, userpw} = req.body
    let loginFlag = findUser(userid, userpw)

    if(loginFlag){
        const privateKey = parseInt(Math.random()*10000000000).toString()
        const item = user.find(v=>v.userid === userid)
        session[privateKey] = item

        res.setHeader('Set-Cookie', `connect.id=${privateKey}; path=/`)
        res.redirect('/login')
    }
    else{
        res.redirect('/user/login?msg=Id and password do not match.')
    }
})

app.get('/user/profile', (req, res)=>{
    let sessionId = req.cookies['connect.id']
    let userData = session[sessionId]

    console.log(userData)

    if(sessionId){
        res.render('./user/profile.html', {
            userData
        })
    }
})

app.get("/cookie", (req, res)=>{
    let cookie = req.headers.cookie;
    if(cookie === undefined){
        res.send("<h1> There are no more cookies.</h1>")
    }
    else{
        res.send(`<h1>Cookie: ${cookie}</h1>`)
    }
})

app.get("/hello", (req, res)=>{
    console.log(req.query)
    let name = req.query.name
    let height = req.query.height
    res.render("index2.html", {
        user: name,
        number: height
    })
})

app.post("/hello", (req, res)=>{
    res.send("<h1>post 방식의 요청입니다.</h1>")
})

app.get("/numjucks", (req, res)=>{
    let date = "2024.06.29"
    res.render("index.html", {
        today: date
    })
})

app.get("/express", (req, res)=>{
    res.send("<h1>Hello SSG</h1>")
})

app.listen(3000, ()=>{
    console.log("server onload")
})