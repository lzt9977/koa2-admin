const Koa=require('koa');
const path=require('path');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const config = require('./config/default.js');
const app = new Koa();
const routers = require('./routers/index');
const koaStatic = require('koa-static');
const moment = require('moment');


const log4js = require('log4js');

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: 'logs/important.log',
      maxLogSize: 10 * 1024 * 1024, // = 10Mb
      numBackups: 5, // keep five backup files
      compress: true, // compress the backups
      encoding: 'utf-8',
      mode: 0o0640,
      flags: 'w+'
    },
    dateFile: {
      type: 'dateFile',
      filename: 'logs/more-important.log',
      pattern: 'yyyy-MM-dd-hh',
      compress: true
    },
    // out: {
    //   type: 'stdout'
    // }
  },
  categories: {
    default: { appenders: ['file', 'dateFile'], level: 'trace' }
  }
});






// cors
app.use(cors({
  origin: function (ctx) {
      // if (ctx.url === '/test') {
          return "*"; // 允许来自所有域名请求
      // }
      // return 'http://localhost:8080';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'token'],
}))




// 配置静态资源加载中间件
app.use(koaStatic(
  path.join(__dirname , './public')
  // 指向 public 使用不必带public
  // http://localhost:8888/images/6nv34yd86n1524107871669.png
))


app.use(koaBody({
  multipart:true, // 支持文件上传
  formidable:{
    uploadDir:path.join(__dirname,'public/upload/'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
    onFileBegin:(name,file) => { // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
    },
  }
}));






app
  .use(routers.routes())
  .use(routers.allowedMethods());

app.listen(config.port)

console.log(`当前端口: ${config.port}  服务器时间: `+moment().format("YYYY-MM-DD h:mm:ss"))
