const userModel = require('../lib/mysql.js')
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

    }
}