const userModel = require('../lib/mysql.js');
const moment=require('moment');
const fs = require('fs');
const xlsx = require('node-xlsx').default;
module.exports = {
    async list( ctx ) {

        let { page, size, barCode, keyWords, shop, searchCategory } = ctx.request.body //当前页
        let total = 0
        let data = null
        
        let first = (page-1)*size

        await userModel.findGoodsPage({first, size, barCode, keyWords, shop, searchCategory})
        .then(async (result) => {

            for(let i=0;i<result.length;i++){
                result[i].goods_image = 'http://pgt-img.oss-cn-hangzhou.aliyuncs.com/images'+result[i].goods_image
            }

            data = result
            await userModel.findGoodsList({barCode, keyWords, shop, searchCategory})
                  .then(async (result) => {
                    
                    total = result.length
                    ctx.body = {
                        code: 0,
                        data:{
                            list:data,
                            total: total
                        },
                        msg: ''
                    }
                })
            
        })

    },
    // lv3
    async getGoodsCategory (ctx) {
        let category = []
        await userModel.getCategoryL1()
        .then(async (result) => {
            if(result.length>0){
                category = result
                for(let i=0;i<category.length;i++){
                    category.children = []
                    await userModel.getCategoryL2(category[i].cat_id)
                    .then(async (result) => {
                        category[i].children = result
                        for(let j=0;j<category[i].children.length;j++){
                            category[i].children[j].children = []
                            await userModel.getCategoryL2(category[i].children[j].cat_id)
                            .then(async (result) => {
                                category[i].children[j].children = result
                            })
                        }
                    })
                }
                
                
                ctx.body = {
                    code: 0,
                    data: category,
                    msg: ''
                }
            }
            
        })
        
    },
    async shelf (ctx) { // 上架 下架
        let { shelf, goodsId } = ctx.request.body

        await userModel.updateShelf(shelf, goodsId)
        .then(async (result) => {
            if(result.affectedRows>0){
                ctx.body = {
                    code: 0,
                    data: {
                        shelf: shelf
                    },
                    msg: '操作成功'
                }
            }else{
                ctx.body = {
                    code: 1,
                    data: {
                        shelf: shelf
                    },
                    msg: '操作失败'
                }
            }
        })
        
    },
    async goodsExport (ctx) {


        let { barCode, keyWords, shop, searchCategory } = ctx.request.body //当前页
        
        let data = [['编号','商品名称','商品图片','本店价','库存','状态','商品重量','发布时间','排序']];
        
        

        await userModel.findGoodsExprot({ barCode, keyWords, shop, searchCategory })
        .then(async (result) => {

            for(let i=0;i<result.length;i++){
                result[i].goods_image = 'http://pgt-img.oss-cn-hangzhou.aliyuncs.com/images'+result[i].goods_image
                let arr = []
                for(let attr in result[i]){
                    arr.push(result[i][attr])
                }
                data.push(arr)
            }

        })


        const buffer = xlsx.build([{name: "mySheetName", data: data}]);
        let url = '/public/xlsx/璞谷塘商品列表'+moment().format("YYYY-MM-DD")+'.xlsx';

        function writeFile () {
            return new Promise((resolve) => {
                
                fs.writeFile('.'+url, buffer, function(err){  
                    if(err){
                        throw err
                    }
                    resolve()
                }); 
            });
        }

        await writeFile().then(()=>{
            ctx.body = {
                code: 0,
                data: {
                    // url: 'http://localhost:8888'+url  // 本地
                    url: 'http://118.24.33.215:8090'+url
                    //返回路径 提供下载
                },
                msg: ''
            }
        })
       
        
        
    },
    async category (ctx) {
        let category = []
        await userModel.getCategoryL1()
        .then(async (result) => {
            if(result.length>0){
                category = result
                for(let i=0;i<category.length;i++){
                    category.children = []
                    await userModel.queryCategoryGoods(category[i].cat_level, category[i].cat_id)
                    .then(async (result) => {
                        category[i].cateLen = result.length
                    })

                    category[i].cat_image ? category[i].cat_image = 'http://pgt-img.oss-cn-hangzhou.aliyuncs.com/images'+category[i].cat_image : category[i].cat_image = null

                    await userModel.getCategoryL2(category[i].cat_id)
                    .then(async (result) => {
                        category[i].children = result

                        for(let j=0;j<category[i].children.length;j++){

                            await userModel.queryCategoryGoods(category[i].children[j].cat_level, category[i].children[j].cat_id)
                            .then(async (result) => {
                                category[i].children[j].cateLen = result.length
                            })

                            category[i].children[j].cat_image ? category[i].children[j].cat_image = 'http://pgt-img.oss-cn-hangzhou.aliyuncs.com/images'+category[i].children[j].cat_image : category[i].children[j].cat_image = null

                            category[i].children[j].children = []
                            await userModel.getCategoryL2(category[i].children[j].cat_id)
                            .then(async (result) => {
                                category[i].children[j].children = result
                                for(let s=0;s<result.length;s++){

                                    category[i].children[j].children[s].cat_image ? category[i].children[j].children[s].cat_image = 'http://pgt-img.oss-cn-hangzhou.aliyuncs.com/images'+category[i].children[j].children[s].cat_image : category[i].children[j].children[s].cat_image = null

                                    await userModel.queryCategoryGoods(category[i].children[j].children[s].cat_level, category[i].children[j].children[s].cat_id)
                                    .then(async (result) => {
                                        category[i].children[j].children[s].cateLen = result.length
                                    })
                                }
                            })
                        }
                    })
                }

                
                
                ctx.body = {
                    code: 0,
                    data: category,
                    msg: ''
                }
            }
            
        })

    },
    async categoryIsShow (ctx) {
        
        let { catId, status } = ctx.request.body
        
        await userModel.updateCategoryIsshow(catId,status)
        .then(async (result) => {
            ctx.body = {
                code: 0,
                data: '',
                msg: '修改成功'
            }
        })
        
    },
    async addCategory (ctx) {

        let { cat_name, parent_id, cat_image, cat_level, cat_sort } = ctx.request.body

        await userModel.selectOrderCategory()
        .then(async (result) => {
            let cat_id = result[0].cat_id + 3
          

            await userModel.addCategory(cat_id, `'${cat_name}'`, `'${cat_image}'`, parent_id, cat_level, cat_sort)
            .then(async (result) => {
                if(result.affectedRows >= 1){
                    ctx.body = {
                        code: 0,
                        data: '',
                        msg: '添加分类成功'
                    }
                }
            })
        })

    }

}
