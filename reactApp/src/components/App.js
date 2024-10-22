'use strict';


import React from 'react';
import ReactDom from 'react-dom';

import { Router, Route, hashHistory } from 'react-router';


var App = React.createClass({
    getInitialState:function(){
        return {
            liked: false
        }
    },
    handleClick:function(){
        console.log(this.state.liked);
        console.log("asd");
    },
    render: function(){
        return(
            <div>
                <h5 className="title">hello, yeoman app!</h5>
                <div>React Router: </div>
                <div><a href="#/list">list page</a></div>
                <div><a href="#/detail">detail page</a></div>
                <div onClick={this.handleClick}>It is  嗯嗯</div>
            </div>
        )}
});

var List = React.createClass({
    render: function() {
        return (
            <div>
                <h5 className="title">!嗯哼 list</h5>
                <div><a href="#/">返回首页</a></div>
                <div>这是列表页</div>
            </div>
        );
    }
});

var Detail = React.createClass({
    render: function() {
        return (
            <div>
                <h5 className="title">hello, yeoman app!</h5>
                <div><a href="#/">返回首页</a></div>
                <div><a href="#/detail">detail page</a></div>
                <div>这是详情页</div>
            </div>
        );
    }
});

let props = {
    status : "打开"
};
//最终渲染
ReactDom.render((
    <Router history={hashHistory}>
        <Route path='/' component={App} {...props} date="get"></Route>
        <Route path='/list' component={List} />
        <Route path='/detail' component={Detail} />
    </Router>
), document.getElementById('app'));
