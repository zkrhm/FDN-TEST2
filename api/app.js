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

    if(mode == 'normal' || mode == 'pivot'){
        pool.query(QueryFactory.getQuery(mode)).then((payload)=>{
            res.header("Access-Control-Allow-Origin", "*");
            res.json({
                payload : payload.rows
            })
        }).catch((err)=>{
            console.log(`error : ${err}`)
        })

        
    }else{
        res.status(422)
        res.json({type:"Wrong Parameter for query mode, available mode : normal xor pivot"})
    }

    
})

app.get('/', (req,res)=>{
    const url = require('url')
    res.redirect(url.format({
        pathname: '/v1/api',
        query: req.query
    }))
})

module.exports = app