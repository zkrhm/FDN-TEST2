import Express from 'express'
import {Pool, Client} from 'pg'
import QueryFactory from './query_lib'
const app = Express()
const pool = Pool()

require('dotenv').config()

app.get('/v1/api',(req, res) => {
    let mode = req.query.mode
    if(typeof(mode) == 'undefined'){
        mode = 'normal'
    }

    console.log('mode'+mode)

    if(mode != 'normal' && mode != 'pivot'){
        res.status(422)
        res.json({type:"Wrong Parameter for query mode, available mode : normal xor pivot"})
    }

    let dataHeader = {
        'normal': ['id','Full Name',"Email",'Item','Qty','Total Harga'], 
        'pivot': ['Full Name','Email',"Barang 0","Barang 1","Barang 2","Barang 3","Barang 4","Barang 5","Barang 6","Barang 7","Barang 8","Barang 9"]
    }[mode]

    pool.query(QueryFactory.getQuery(mode)).then((payload)=>{
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            header : dataHeader,
            payload : payload.rows
        })
    }).catch((err)=>{
        console.log(`error : ${err}`)
    })
    
})

app.listen(process.env.API_PORT,() => {
    console.log(`"running on port ${process.env.API_PORT}"`)
})