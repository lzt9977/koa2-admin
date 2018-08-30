const router = require('koa-router')()
const user = require('../api/user')
const login = require('../api/login')
const goods = require('../api/goods')
const images = require('../api/images')
const gateway = require('../middlewares/gateway.js');
const tokenRequired = require('../middlewares/tokenRequired.js')();


router.use(gateway())  // 启用网关中心


const routers = router.post('/user',  tokenRequired, user.route)
                .post('/user/getUserInfo',tokenRequired, user.getUserInfo)
                .post('/goods/ListPage',  tokenRequired, goods.list) // 商品列表 筛选
                .post('/goods/listCategory',  tokenRequired, goods.getGoodsCategory) // 商品获取分类筛选
                .post('/goods/shelf',  tokenRequired, goods.shelf) // 商品上下架
                .post('/goods/exports', tokenRequired,  goods.goodsExport) // 导出商品列表
                .post('/goods/category',  tokenRequired, goods.category) // 分类列表
                .post('/goods/categoryIsShow', tokenRequired,  goods.categoryIsShow) // 分类是否显示
                .post('/goods/addCategory', tokenRequired, goods.addCategory)    // 添加分类



                .post('/images/upload', tokenRequired, images.upload)  //图片上传



                .post('/login', login.login) // 登录



                .get('/test', tokenRequired, async (ctx)=>{
                    console.log('test router')
                    ctx.body="test router"
                })
module.exports = routers