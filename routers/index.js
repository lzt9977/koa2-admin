const router = require('koa-router')()
const user = require('../api/user')
const goods = require('../api/goods')
const images = require('../api/images')



const routers = router.post('/user', user.route)
                .post('/goods/ListPage', goods.list) // 商品列表 筛选
                .post('/goods/listCategory', goods.getGoodsCategory) // 商品获取分类筛选
                .post('/goods/shelf', goods.shelf) // 商品上下架
                .post('/goods/exports', goods.goodsExport) // 导出商品列表
                .post('/goods/category', goods.category) // 分类列表
                .post('/goods/categoryIsShow', goods.categoryIsShow) // 分类是否显示

                .post('/goods/addCategory', goods.addCategory)

                .post('/images/upload', images.upload)
               
module.exports = routers