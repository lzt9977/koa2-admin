const userModel = require('../lib/mysql.js')
const md5 = require("md5")
const jwt = require('jsonwebtoken');
const moment = require('moment');
module.exports = {
    async login( ctx ) {
        let { phone, password } = ctx.request.body

        await userModel.findUserByPhone( phone )
        .then(async (result) => {

            if(result.length==0){
                ctx.body = {
                    code: 102,
                    msg: '不存在的用户'
                }
            }else{

                let str = md5(password)
                if(str === result[0].password){

                    let token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
                        mobile: result[0].mobile
                    }, 'pgt');

                    ctx.body = {
                        code: 0,
                        data: {
                            token: token
                        },
                        msg: '登录成功'
                    }

                }else{
                    ctx.body = {
                        code: 103,
                        msg: '密码错误'
                    }
                }

            }
            
        })
    }
}