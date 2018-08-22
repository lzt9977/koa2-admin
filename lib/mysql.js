var mysql = require('mysql');
var config = require('../config/default.js')

var pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE,
  port     : config.database.PORT
});

let query = ( sql, values ) => {

  return new Promise(( resolve, reject ) => {
    pool.getConnection( (err, connection) => {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            console.log(err)
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })

}




// 手机号查找用户
let findUserByPhone = ( phone ) => {
  let _sql = `select * from szy_user where mobile="${phone}";`
  return query( _sql )
}
// 根据用户名字查找密码
let findUserPass = ( phone ) => {
  let _sql = `select * from szy_user where mobile="${phone}";`
  return query( _sql )
}

// 查询商品列表
let findGoodsPage = (data) => {
  return new Promise(( resolve, reject ) => {
    let params = data
    let where = []
    
    for(i in data){
      if(params[i]){
        switch(i)
        {
        case 'barCode':
          where.push(`goods_barcode LIKE '%${params.barCode}%'`)
          break;
        case 'keyWords':
          where.push(`(goods_name LIKE '%${params.keyWords}%' OR goods_id LIKE '%${params.keyWords}%')`)
          break;
        case 'searchCategory':
          where.push(`cat_id${params[i].cat_level} = ${params[i].cat_id}`)
          break;
        case 'shop':
          let _sql_shop = `select shop_id from szy_shop WHERE shop_id = '${params.shop}' OR shop_name LIKE '%${params.shop}%'`
          query(_sql_shop).then(async (result) => {
            let shopId = []
            for(let i=0;i<result.length;i++){
              shopId.push(result[i].shop_id)
            }
            shopId.join(',')
            where.push(`shop_id in (${shopId})`)

            let str = ''
            for(let i=0;i<where.length;i++){
              if(i==0){
                str += 'where '
              }
              str += where[i]
              if(where.length>0 && i<where.length-1){
                str += ' AND '
              }
            }
            let _sql = `select goods_id,goods_name,goods_image,goods_price,goods_number,goods_status,goods_weight,add_time,goods_sort from szy_goods ${str} limit ${params.first},${params.size};`
            resolve(query( _sql ))
          })
          break;
        }
      }
    }

    if(!params.shop){
      let str = ''
      for(let i=0;i<where.length;i++){
        if(i==0){
          str += 'where '
        }
        str += where[i]
        if(where.length>0 && i<where.length-1){
          str += ' AND '
        }
      }

      let _sql = `select goods_id,goods_name,goods_image,goods_price,goods_number,goods_status,goods_weight,add_time,goods_sort from szy_goods ${str} limit ${params.first},${params.size};`
      resolve(query( _sql ))
    }

  })
}



// 查询商品列表
let findGoodsList = (data) => {
  return new Promise(( resolve, reject ) => {
    let params = data
    let where = []
   
    for(i in data){
      if(params[i]){
        switch(i)
        {
        case 'barCode':
          where.push(`goods_barcode LIKE '%${params.barCode}%'`)
          break;
        case 'keyWords':
          where.push(`(goods_name LIKE '%${params.keyWords}%' OR goods_id LIKE '%${params.keyWords}%')`)
          break;
        case 'searchCategory':
          where.push(`cat_id${params[i].cat_level} = ${params[i].cat_id}`)
          break;
        case 'shop':
          let _sql_shop = `select shop_id from szy_shop WHERE shop_id = '${params.shop}' OR shop_name LIKE '%${params.shop}%'`
          query(_sql_shop).then(async (result) => {
            let shopId = []
            for(let i=0;i<result.length;i++){
              shopId.push(result[i].shop_id)
            }
            shopId.join(',')
            where.push(`shop_id in (${shopId})`)

            let str = ''
            for(let i=0;i<where.length;i++){
              if(i==0){
                str += 'where '
              }
              str += where[i]
              if(where.length>0 && i<where.length-1){
                str += ' AND '
              }
            }
            let _sql = `select goods_id from szy_goods ${str};`
            resolve(query( _sql ))
          })
          break;
        }
      }
    }

    if(!params.shop){
      let str = ''
      for(let i=0;i<where.length;i++){
        if(i==0){
          str += 'where '
        }
        str += where[i]
        if(where.length>0 && i<where.length-1){
          str += ' AND '
        }
      }

      let _sql = `select goods_id from szy_goods ${str};`
      resolve(query( _sql ))
    }
    

  })
}

 
// 查询一级分类
let getCategoryL1 = () => {
  let _sql = `select cat_id,cat_name,cat_image,cat_sort,is_show,parent_id,cat_level from szy_category where parent_id=0;`
  return query( _sql )
}
// 查询子集分类
let getCategoryL2 = (parent_id) => {
  let _sql = `select cat_id,cat_name,cat_image,cat_sort,is_show,parent_id,cat_level from szy_category where parent_id=${parent_id};`
  return query( _sql )
}
// 查询分类下商品
let queryCategoryGoods = (level, uid) => {
  let _sql = `select goods_id from szy_goods where cat_id${level} = ${uid}`
  return query( _sql )
}
// 修改分类显示
let updateCategoryIsshow = (catId,status) => {
  let _sql = `update szy_category SET is_show=${status} where cat_id in (${catId})`
  return query( _sql )
}


// 上下架
let updateShelf = (shelf, goodsId) => {
  let _sql = null
  if(shelf == 'down'){
    _sql = `update szy_goods SET goods_status=0 where goods_id in (${goodsId})`
  }else{
    _sql = `update szy_goods SET goods_status=1 where goods_id in (${goodsId})`
  }
  return query( _sql )
}

// 导出数据
let findGoodsExprot = (data) => {
  return new Promise(( resolve, reject ) => {
    let params = data
    let where = []
    
    for(i in data){
      if(params[i]){
        switch(i)
        {
        case 'barCode':
          where.push(`goods_barcode LIKE '%${params.barCode}%'`)
          break;
        case 'keyWords':
          where.push(`(goods_name LIKE '%${params.keyWords}%' OR goods_id LIKE '%${params.keyWords}%')`)
          break;
        case 'searchCategory':
          where.push(`cat_id${params[i].cat_level} = ${params[i].cat_id}`)
          break;
        case 'shop':
          let _sql_shop = `select shop_id from szy_shop WHERE shop_id = '${params.shop}' OR shop_name LIKE '%${params.shop}%'`
          query(_sql_shop).then(async (result) => {
            let shopId = []
            for(let i=0;i<result.length;i++){
              shopId.push(result[i].shop_id)
            }
            shopId.join(',')
            where.push(`shop_id in (${shopId})`)

            let str = ''
            for(let i=0;i<where.length;i++){
              if(i==0){
                str += 'where '
              }
              str += where[i]
              if(where.length>0 && i<where.length-1){
                str += ' AND '
              }
            }
            let _sql = `select goods_id,goods_name,goods_image,goods_price,goods_number,goods_status,goods_weight,add_time,goods_sort from szy_goods ${str};`
            resolve(query( _sql ))
          })
          break;
        }
      }
    }

    if(!params.shop){
      let str = ''
      for(let i=0;i<where.length;i++){
        if(i==0){
          str += 'where '
        }
        str += where[i]
        if(where.length>0 && i<where.length-1){
          str += ' AND '
        }
      }

      let _sql = `select goods_id,goods_name,goods_image,goods_price,goods_number,goods_status,goods_weight,add_time,goods_sort from szy_goods ${str};`
      resolve(query( _sql ))
    }

  })
}

// 查询分类列表cat_id最大数
let selectOrderCategory = () => {
  let  _sql = `select cat_id from szy_category ORDER BY cat_id DESC limit 0,1`
  return query( _sql )
}


// 添加分类
let addCategory = (cat_id, cat_name, cat_image, parent_id, cat_level, cat_sort) => {
  let  _sql = `INSERT INTO szy_category (cat_id, cat_name, parent_id, cat_image, cat_level ,cat_sort) VALUES (${cat_id}, ${cat_name}, ${parent_id}, ${cat_image}, ${cat_level}, ${cat_sort})`
  return query( _sql )
}


module.exports = {
	query,
  findUserByPhone,
  findGoodsPage,
  findGoodsList,
  getCategoryL1,
  getCategoryL2,
  updateShelf,
  findGoodsExprot,
  queryCategoryGoods,
  updateCategoryIsshow,
  selectOrderCategory,
  addCategory
}

