const axios = require('axios')

const currencyFormatter = require('currency-formatter');
const currencySetting = {
    symbol: 'IDR',
    decimal: ',',
    thousand: '.',
    precision: 2,
    format: '%v %s'
}
const sorterFunction = (a, b) => {
    console.log(`a : ${JSON.stringify(a)},b : ${JSON.stringify(b)}`)
    if (a < b)
        return -1
    else if (b > a)
        return 1
    else
        return 0
}
class Store {
    static fetchNormal() {
        return new Promise((resolve, reject) => {
            axios('http://localhost:3001/v1/api')
                .then((res) => {
                    var o = {
                        header: [
                            { title: 'ID', dataIndex: 'key', key: 'key', sorter: (a,b)=>{if(a.key<b.key){return -1} else if(a.key>b.key){ return 1 }else return 0 } },
                            { title: 'Full Name', dataIndex: 'fullname', key: 'fullname', sorter: (a,b)=>{if(a.fullname<b.fullname){return -1} else if(a.fullname>b.fullname){ return 1 }else return 0 } },
                            { title: 'Email', dataIndex: 'email', key: 'email' },
                            { title: 'Item', dataIndex: 'item', key: 'item', sorter: sorterFunction },
                            { title: 'Quantity', dataIndex: 'qty', key: 'qty', align: 'right' },
                            { title: 'Total Price', dataIndex: 'totalprice', key: 'totalprice', align: 'right' }
                        ],
                        payload: res.data.payload.map((record) => {
                            record.totalprice = currencyFormatter.format(record.totalprice, currencySetting)
                            return record
                        })
                    }
                    resolve(o)
                }).catch((err) => {
                    reject(err)
                })
        })
    }

    static fetchPivot() {
        return new Promise((resolve, reject) => {
            axios('http://localhost:3001/v1/api?mode=pivot')
                .then((res) => {
                    resolve({
                        header: [
                            { title: 'Full Name', dataIndex: 'fullname', key: 'fullname', sorter: sorterFunction },
                            { title: 'Email', dataIndex: 'email', key: 'email' },
                            { title: 'Barang 0', dataIndex: 'barang_0', key: 'barang_0' },
                            { title: 'Barang 1', dataIndex: 'barang_1', key: 'barang_1' },
                            { title: 'Barang 2', dataIndex: 'barang_2', key: 'barang_2' },
                            { title: 'Barang 3', dataIndex: 'barang_3', key: 'barang_3' },
                            { title: 'Barang 4', dataIndex: 'barang_4', key: 'barang_4' },
                            { title: 'Barang 5', dataIndex: 'barang_5', key: 'barang_5' },
                            { title: 'Barang 6', dataIndex: 'barang_6', key: 'barang_6' },
                            { title: 'Barang 7', dataIndex: 'barang_7', key: 'barang_7' },
                            { title: 'Barang 8', dataIndex: 'barang_8', key: 'barang_8' },
                            { title: 'Barang 9', dataIndex: 'barang_9', key: 'barang_9' },
                        ],
                        payload: res.data.payload
                    })
                }).catch((err) => {
                    reject(err)
                })
        })
    }
}

export { Store as default }