module.exports = function gate () {
  
    return async function gateway(ctx, next) {
        // 记录日志
        //   console.log(`请求的URL${ctx.request.url}`)
          try {
              await next();
          } catch (err) {
              throw err;
          }
    }

}

