import QueryFactory from './query_lib'
describe('test query library',()=>{
    test('check returning query string if mode known',()=>{
        const query1 = QueryFactory.getQuery('normal')
        expect(query1).toContain("SELECT")

        const query2 = QueryFactory.getQuery('pivot')
        expect(query2.toUpperCase()).toContain("BARANG_0")
    })
    test('throw exception if mode not known',()=>{
        expect(()=>{
            QueryFactory.getQuery('notknownmode')
        }).toThrowError()
    })
})