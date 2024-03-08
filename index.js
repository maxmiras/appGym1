const express = require('express')
const db = require('./db.js')
const router1 = require('./routes/usuarios.js');
const cors=require('cors');

let app = express()
db.obtenerDB('./Gym.db')



app.use(cors())
app.use(express.json())


app.use(router1)


app.get('/',(req,res)=>{
    res.send('esta es la pagina del server')
})

app.set('port', process.env.PORT || 3000)


app.listen(app.get('port'), ()=>{
    console.log('server on port', app.get( 'port' ))
})