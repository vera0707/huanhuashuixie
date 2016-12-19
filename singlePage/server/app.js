/**
 * Created by sundongzhi on 16/7/8.
 */
let http = require("http");
let util = require("util");
let path = require("path");              // 路径处理的中间件解决不同操作系统的路径问题
let koa = require("koa");                // koa 类似express服务器更高效
let router = require("koa-router")();      // koa 路由
let serveStatic = require("koa-static"); //koa 静态文件托管
let open = require("open");              // 用于启动服务打开默认浏览器

let pkg = require("../package.json");


//定义静态文件路径 debug模式默认是针对src文件进行操作,所以debug时托管src
// path.resolve 会根据第一个参数为当前路径 ,接相对路径,将最终得到的路径字符串返回
let staticDir = path.resolve(__dirname, '../public/dist');

let routes = require('./routes');
let apiRoutes = require('./apiRoutes');

let app = koa();


app.keys = [pkg.name, pkg.description];

app.proxy = true;


// global events listen
app.on('error', (err, ctx) => {
    err.url = err.url || ctx.request.url
    console.error(err, ctx)
})

// handle favicon.ico
app.use(function*(next) {
    if (this.url.match(/favicon\.ico$/)) this.body = ''
    yield next
})

// logger
app.use(function*(next) {
    console.log(this.method, this.url)
    yield next
})




routes(router, app, staticDir);
apiRoutes(router, app, staticDir);



app.use(router.routes());


app.use(serveStatic(staticDir, {
    maxage: 0
}));

app = http.createServer(app.callback());

app.listen(pkg.localServer.port, '127.0.0.1', () => {
    "use strict";
    let url = util.format('http://%s:%s', 'localhost',pkg.localServer.port);
    
    console.log('local debug server listening at %s', url);
    
    open(url);
})


