//假数据

var remarkInformation = [
    {username:"阿达",text:"暗示法打算几点干哈高速大厦拔河比赛放哈不是吧四方达撒旦法沙发上大法师",imgSrc:"1"},
    {username:"大多梵蒂冈",text:"放哈算法哈市复活节卡号法师技能画法几何撒解放军暗示疗法和商家放哈放假啊浪费精力放假萨芬",imgSrc:"2"},
    {username:"安师大",text:"沙发上",imgSrc:"3"},
    {username:"鞍山道",text:"发水电费",imgSrc:"4"},
    {username:"格花豆腐阿莎",text:"gf阿语施工方何时放假哈市复活节安徽大厦房间里福建师范好舒服回家萨福克撒复活节萨芬回家啦沙发里",imgSrc:"5"},
    {username:"土洋结合滚倒倒",text:"撒旦哈师大河坊街安徽省肺结核沙发客技术开发假按揭发",imgSrc:"6"},
];


var CommentsApplication = React.createClass({
    componentWillMount:function(){
        //发送异步请求数据
        //低于render的执行顺序
    },
    render:function() {
        var str = [];
        var remark = this.props.remark;
        remark.forEach(function(value){
           var imgSrc = "img/"+value.imgSrc+".jpg";
            str.push(
            <div className="media">
                <div className="media-left">
                <a href="#">
                <img src={imgSrc} className="media-object img-size"/>
                </a>
                </div>
                <div className="media-body">
                <h4 className="media-heading">{value.username}</h4>
            <div>{value.text}</div>
            </div>
            <div className="replay">
                <textarea className="replay-input"></textarea>
                <input type="text" className="btn btn-primary pull-right" value="回复" id="replay" />
                </div>
                </div>
            )
        });
        console.log(str);
        return (<div>{str}</div>);
        //return 将会逐条解析数组元素
        //在这里,没有<div></dsiv>包围将会报错

    },
});

$("#remark").on('click',function(){

    var imgSrc=parseInt(Math.random()*7+1);
    var currremark={username:"访客",text:$(".remark-input").val(),imgSrc:imgSrc};
    remarkInformation.push(currremark);

    ReactDOM.render(<CommentsApplication remark={remarkInformation} />,
    document.getElementById('media-list')

);
$(".remark-input").val("");
});



ReactDOM.render(
    <CommentsApplication remark={remarkInformation} />,
    document.getElementById('media-list'))


$("#replay").on('click',function(){
    //console.log($(this).parent().parent().children(".media-body").append();
});







