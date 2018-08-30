
const jwt = require('jsonwebtoken');
module.exports = function () {
  
  return async function (ctx, next) {

      let token = ctx.request.header.token

      await jwt.verify(token, 'pgt',async (err, decoded) => {
          if(err){
            ctx.body = {
              code: 204,
              msg:'请登录'
            }
          }else{
            await next()
          }
      });
  }

}