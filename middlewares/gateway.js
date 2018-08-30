
const log4js = require('log4js');
const logger = log4js.getLogger();

module.exports = function gate () {
  
    return async function gateway(ctx, next) {
        // 网关
        // console.log(`请求的URL${ctx.request.url}`)
        logger.info(`${ctx.request.url} - ${JSON.stringify(ctx)}`);
        try {
            await next();
        } catch (err) {
            throw err;
        }
    }

}

