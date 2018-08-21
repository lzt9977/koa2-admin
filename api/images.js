const userModel = require('../lib/mysql.js')
module.exports = {
    async upload ( ctx, next ) {

        ctx.body = {
            code: 0,
            data: 'http://118.24.33.215:8090/'+ctx.request.files.file.path.split('/home/pgt/')[1],
            msg: '上传成功'
        }

    }
}