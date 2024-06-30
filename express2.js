const express = require("express")
const app = express()

let middle = (req, res, next) => {
    console.log('next')
    next()
}

app.get/('/express', middle,  (req, res)=>{
    res.send('<h1> Hello server!!</h1>')
})

app.get('/:ingoo', (req, res) =>{
    let name = req.params.ingoo
    res.send(`<h1>Hello ${name}<h1>`)
})

app.listen(3000, ()=>{
    console.log('server onload')
})