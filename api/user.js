const userModel = require('../lib/mysql.js')
const jwt = require('jsonwebtoken');
module.exports = {
    async route( ctx ) {

        let phone = ctx.request.body.phone

        await userModel.findUserByPhone( phone )
        .then(async (result) => {
            ctx.body = {
                code: 0,
                data: result[0],
                msg: ''
            }
        })

    },
    async getUserInfo (ctx) {
        let token = ctx.request.header.token

        await jwt.verify(token, 'pgt',async (err, decoded) => {
            if(err){
              ctx.body = {
                code: 204,
                msg:'请登录'
              }
            }else{
                await userModel.findUserByPhone( decoded.mobile )
                    .then(async (result) => {
                        ctx.body = {
                            code: 0,
                            data: result[0],
                            msg: ''
                        }
                    })
            }
        });
    }
}