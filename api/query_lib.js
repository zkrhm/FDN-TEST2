

class QueryFactory{

    static getQuery(mode='normal'){

        if (mode == 'normal'){
            return "SELECT id as key, full_name as fullName, email , item, quantity as qty, total_price as totalPrice from transactions"
        }else if(mode=='pivot'){
            return `SELECT 
                        full_name as fullname,
                        email,
                        sum(CASE item WHEN 'Barang 0' THEN 
                                quantity ELSE 0 end) BARANG_0,
                        sum(CASE item WHEN 'Barang 1' THEN 
                                quantity ELSE 0 end) BARANG_1,
                        sum(CASE item WHEN 'Barang 2' THEN 
                                quantity ELSE 0 end) BARANG_2,
                        sum(CASE item WHEN 'Barang 3' THEN 
                                quantity ELSE 0 end) BARANG_3,
                        sum(CASE item WHEN 'Barang 4' THEN 
                                quantity ELSE 0 end) BARANG_4,
                
                        sum(CASE item WHEN 'Barang 5' THEN 
                                quantity ELSE 0 end) BARANG_5,
                        sum(CASE item WHEN 'Barang 6' THEN 
                                quantity ELSE 0 end) BARANG_6,
                        sum(CASE item WHEN 'Barang 7' THEN 
                                quantity ELSE 0 end) BARANG_7,
                        sum(CASE item WHEN 'Barang 8' THEN 
                                quantity ELSE 0 end) BARANG_8,
                        sum(CASE item WHEN 'Barang 9' THEN 
                                quantity ELSE 0 end) BARANG_9,
                        row_number() OVER (ORDER BY email) AS key
                FROM transactions 
                GROUP BY full_name, email
                ORDER BY full_name, email
                `
        }else
            new Error("mode not recognized, only accept : normal xor pivot")
    }
}

export {QueryFactory as default}