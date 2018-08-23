// import RandomInt from 'random-int'
const randomInt = require('random-int')

const users = [
    {
        name: "Tommy Bejo",
        email: "tommy@mail.com"
    },
    {
        name: "Joko Widodo",
        email: "joko@mail.com"
    },
    {
        name: "Jusuf Kalla",
        email: "jusuf@mail.com"
    },
    {
        name: "Robert Garcia",
        email: "robert@mail.com"
    }
]

class Goods{
    static get(){
        let res = []
        for (let i=0;i<10;i++){
            res.push({name: `Barang ${i}`, price : randomInt(1,999)*1000.})
        }

        return res
    }
}

let N = 100
let goods = Goods.get()
let n_goods = goods.length
let n_users = users.length

console.log(`users : ${users}`)
console.log(`goods : ${goods}`)



class DataGenerator{

    constructor(tableName){
        this.tableName = tableName
    }

    genData(mode = 'json'){
        let res = []
        for(let i=0;i<N;i++){
            let goodsIdx = randomInt(0,n_goods-1)
            let userIdx = randomInt(0,n_users-1)
            let qty = randomInt(1,100)
            let record = {
                fullName : users[userIdx].name,
                email:users[userIdx].email,
                item:goods[goodsIdx].name,
                quantity: qty,
                totalPrice:parseFloat(goods[goodsIdx].price * qty)
            }

            if(mode == 'sql'){
                let fields = Object.keys(record).join(',').toLocaleLowerCase()
                let values = Object.values(record).map((val)=>{
                    if (typeof val == 'string'){
                        return `'${val}'`
                    }else
                        return val
                }).join(',')
                let sql = `INSERT INTO ${this.tableName.toLowerCase()}(${fields}) VALUES (${values});`

                res.push(sql)
            }else{
                res.push(record)
            }

        }

        return res
    }

    asSQL(){
        let _obj = this
        return new Promise((resolve,reject)=>{
            let result = _obj.genData('sql')
            resolve(result)
        })
    }

    asJSON(){
        let _obj = this
        return new Promise((resolve,reject)=>{
            let result = _obj.genData('json')
            resolve(result)
        })
    }

    getSchema(){
        return `
            CREATE TABLE ${this.tableName.toLowerCase()} (
                id serial primary key,
                full_name varchar(255),
                email varchar(255),
                item varchar(255),
                quantity int,
                total_price float
            );
        `
    }
}

function writer(){
    return new DataGenerator('TRANSACTIONS')
}

writer().asSQL().then((data)=>{
    const path = require('path')
    const fs = require('fs')
    const filePath = path.join(__dirname,'data-input.sql')
    console.log(`writing to ${filePath}`)
    let ws = fs.createWriteStream(filePath)
    for (let datum of data){
        console.log(`'writing : ${datum}'`)
        ws.write(`${datum}\n`)
    }
    ws.end()
})