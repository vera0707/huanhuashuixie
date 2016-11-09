/**
 * Created by lishuxia on 16/11/8.
 */
var sub = require('./sub');
var app = document.createElement('div');
app.innerHTTML = '<h1>Hello 熊猫大侠</h1>';
app.appendChild(sub());
document.body.appendChild(app);