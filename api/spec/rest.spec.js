const request = require('supertest')
const app = require('../app')

describe('REST access test', () => {

    test('normal mode, returning success & check fields', async () => {
        const res = await request(app).get('/v1/api')
        expect(res.status).toBe(200)
        let obj = res.body.payload[0]
        expect(Object.keys(obj)).toEqual(['key', 'fullname', 'email', 'item', 'qty', 'totalprice'])
    })

    test('pivot mode, check fields', async () => {
        const res = await request(app).get('/v1/api?mode=pivot')
        let obj = res.body.payload[0]
        expect(res.status).toBe(200)
        expect(Object.keys(obj)).toEqual([
            'fullname', 'email', 'barang_0', 'barang_1', 'barang_2',
            'barang_3', 'barang_4', 'barang_5', 'barang_6', 'barang_7', 'barang_8', 'barang_9', 'key'])
    })

    test('counting synchronization between normal and pivot', async () => {
        const res1 = await request(app).get('/v1/api')
        const res2 = await request(app).get('/v1/api?mode=pivot')

        let trData = res1.body.payload
        let mapper = x => {
            let o = {
                'fullname': x.fullname,
                'email': x.email
            }
            for (let i = 0; i < 10; i++)
                o[`barang_${i}`] = 0

            o[x.item.replace(' ', '_').toLowerCase()] = x.qty
            return o
        }
        let reducer = (prev, current) => {
            if (typeof (prev) === 'undefined' && typeof (current) !== 'undefined') {
                return current
            } else if (typeof (prev) !== 'undefined' && typeof (current) === 'undefined') {
                return prev
            } else if (typeof (prev) !== 'undefined' && typeof (current) !== 'undefined') {
                let o = {
                    email: prev.email,
                    fullname: prev.fullname
                }
                for (let i = 0; i < 10; i++) {
                    o[`barang_${i}`] = prev[`barang_${i}`] + current[`barang_${i}`]
                }
                return o
            }
        }
        
        let mailAddrs = ['joko@mail.com','jusuf@mail.com','robert@mail.com','tommy@mail.com']
        let trJournalData = []

        const sortFn = (a,b)=>{
            if (a.email < b.email)
                return -1
            if (b.email > a.email)
                return 1
            return 0
        }

        for (let email of mailAddrs){
            trJournalData.push(trData.filter(x => x.email == email).map(mapper).reduce(reducer)) 
        }

        trJournalData = trJournalData.sort(sortFn)

        let pivotData = res2.body.payload.map(x => {
            delete x['key']
            for(let i = 0; i < 10; i++){
                x[`barang_${i}`] = parseInt(x[`barang_${i}`])
            }
            return x
        }).sort(sortFn)

        for (let i = 0 ;i < 4; i++){
            expect(trJournalData[i]).toEqual(pivotData[i])
        }

    })
})