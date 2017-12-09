/**
 * Created by lishuxia on 2017/11/24.
 */
'use strict';
/*
 * 小型游戏引擎
 */
if(!Date.now()){
    Date.now = function(){
        return new Date().getTime();  //兼容旧环境
    }
}

(function() {
    'use strict';
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame'] || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());

function Game(id,params){
    var _ = this;
    var settings = {
        width : 960,
        height : 640
    };
    var _extend = function(target,settings,params){
        params = params || {};
        for(var i in settings){
            target[i] = params[i] || settings[i];
        }
        return target;
    }

    _extend(_,settings,params);
    var $canvas = document.getElementById(id);
    $canvas.width = _.width;
    $canvas.height = _.height;
    var _context = $canvas.getContext("2d");  //画布上下文环境
    var _stages = [];     // 布景对象队列
    var _events = {};     // 事件集合
    var _index = 0,       // 当前画布索引
        _hander;           // //帧动画控制

    //活动对象构造
    var Item = function(params){
        this._params = params  || {};
        this._id = 0;
        this._stage = null;
        this._settings = {
            x: 0,   //横坐标位置
            y: 0,   //纵坐标位置
            width: 20,   //宽
            height: 20,  //高
            type: 0,  //对象类型,0表示普通对象(不与地图绑定),1表示玩家控制对象,2表示程序控制对象
            color: '#F00',  //标识颜色
            status: 1,      //对象状态,0表示未激活/结束,1表示正常,2表示暂停,3表示临时,4表示异常
            orientation: 0,  //当前定位方向,0表示右,1表示下,2表示左,3表示上
            speed:0,       //移动速度
                // 地图相关
            location: null,    //定位地图,Map对象
            coord:null,        //如果对象与地图绑定,需设置地图坐标;若不绑定,则设置位置坐标
            path:[],           //NPC自动行走的路径
            vector:null,       //目标坐标
                //布局相关
            frames: 1,         //速度等级,内部计算器times多少帧变化一次
            times: 0,

        }

    }
}