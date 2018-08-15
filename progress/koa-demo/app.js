const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const app = new Koa();

const CONFIG = {
    key: 'koa:sess',
    maxAge: 1296000,   //有效期一星期
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false
};

app.use(bodyParser());   //调用中间件koa-bodyparser
app.keys = ['some secret hurr'];
app.use(session(CONFIG, app));


app.use(router.routes())
    .use(router.allowedMethods());

app.use('/user',require("./controller/user"))
    .use('/',require("./controller/main"));


app.listen(3000);
console.log('app started at port 3000...');