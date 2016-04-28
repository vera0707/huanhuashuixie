/**
 * Created by lishuxia on 16/3/29.
 */
//假数据
var remark = [
    {id:1,username:"阿达",text:"暗示法打算几点干哈高速大厦拔河比赛放哈不是吧四方达撒旦法沙发上大法师",imgSrc:"1",child:[
        {id:7,username:"阿达",text:"asdasd",imgSrc:"7",child:[]}]
    },
    {id:2,username:"大多梵蒂冈",text:"放哈算法哈市复活节卡号法师技能画法几何撒解放军暗示疗法和商家放哈放假啊浪费精力放假萨芬",imgSrc:"2",child:
        [{id:8,username:"大多梵蒂冈",text:"dfsadf",imgSrc:"2",child:[]},
            {id:9,username:"大多梵蒂冈",text:"dasaassssssssssssss",imgSrc:"3",child:[]}]
    },
    {id:3,username:"第三方干哈",text:"沙发上",imgSrc:"3",child:[
        {id:10,username:"第三范式",text:"asdasd",imgSrc:"6",child:[
            {id:11,username:"地方广东韶关",text:"asdasd",imgSrc:"1",child:[]},
            {id:12,username:"施工方",text:"asdasd",imgSrc:"3",child:[]},
            {id:13,username:"阿梵蒂冈电饭锅达",text:"asdasd",imgSrc:"7",child:[]}
            ]
        }
    ]},
    {id:4,username:"鞍山道",text:"发水电费",imgSrc:"4",child:[
        {id:14,username:"阿达",text:"asdasd",imgSrc:"5",child:[]},
        ]},
    {id:5,username:"格花豆腐阿莎",text:"gf阿语施工方何时放假哈市复活节安徽大厦房间里福建师范好舒服回家萨福克撒复活节萨芬回家啦沙发里",imgSrc:"5",child:[
        {id:15,username:"小花",text:"asdasd",imgSrc:"4",child:[
            {id:16,username:"春风",text:"asdasd",imgSrc:"5",child:[
                {id:17,username:"大作笑他",text:"asdasd",imgSrc:"3",child:[]}
            ]},
            {id:18,username:"萨达",text:"asdasd",imgSrc:"1",child:[]}
        ]}
    ]},
    {id:6,username:"土洋结合滚倒倒",text:"撒旦哈师大河坊街安徽省肺结核沙发客技术开发假按揭发",imgSrc:"6",child:[]},
];

var id=19;




//用深度遍历法遍历数据,为数据添加 hasChild和parentID
function allNode(str,i){
    str.forEach(function(value){
        value.parentID=i;

        if(value.child.length!=0){
            value.hasChild=true;
            allNode(value.child,value.id);
        }
        else{
            value.hasChild=false;
        }
    });
    return str;
}

var a=allNode(remark,0);


//定义基础评论组件nochils组件  ----依然是深度优先遍历思想
var RemarkNochild = React.createClass({
    render:function(){
        var str = this.props.remark;
        var remarkList = [];
        str.forEach(function(value){
            var imgSrc ='img/'+ value.imgSrc + '.jpg';

            remarkList.push(
                <div className="media">
                <div className="media-left">
                <a href="#">
                <img src={imgSrc} className="media-object img-size"/>
                </a>
                </div>
                <div className="media-body">
                <div>
                <h4 className="media-heading pull-left">{value.username}</h4>
                <input type="text" className="btn btn-primary pull-left isReplay" value="回复" data-id={value.id}/>
                <div className="clear">{value.text}</div>
                </div>
                <RemarkNochild remark={value.child} />
                </div>
                <div className="replay">
                <textarea className="replay-input"></textarea>
                <input type="text" className="btn btn-primary pull-right replay-button" value="确定回复" data-id={value.id}/>
                </div>
                </div>
            );
        })
        return (<div>{remarkList}</div>)
    },
});



//页面打印初始数据
ReactDOM.render(<RemarkNochild remark={remark}/>,
    document.getElementById('media-list')
);

//点击回复按钮 将显示对应的输入框
$(".media-list").on('click','.isReplay',function(){
    $(".replay").hide();
    $(this).parent().parent().parent().children(".replay").show();
});


//点击提交按钮,生成一级评论
$('#remark').on('click',function(){
    var imgSrc = parseInt(Math.random()*7+1);
    var currremark = {id:id++,username:"访客",text:$(".remark-input").val(),imgSrc:imgSrc,child:[],hasChild:false,parentID:0};
    remark.push(currremark);

    ReactDOM.render(<RemarkNochild remark={remark}/>,
        document.getElementById('media-list')
    );

    $(".remark-input").val("");

});

//点击确认回复按钮,生成N+1级评论
$(".media-list").on('click',".replay-button",function(){
    //要插入的数据信息
    var imgSrc = parseInt(Math.random()*7+1);
    var currremark = {id:id++,username:"访客",text:$(this).parent().find(".replay-input").val(),imgSrc:imgSrc,child:[],hasChild:false,parentID:index};

    var index=$(this).data('id');

    allNodeText(remark,index,currremark);

    ReactDOM.render(<RemarkNochild remark={remark}/>,
        document.getElementById('media-list')
    );

    console.log(index);
    console.log(remark);
    $(".replay-input").val("");
    $(".replay").hide();
});

//插入子集数据的遍历函数
function allNodeText(remark,index,currremark){
    remark.forEach(function(value){
        if(value.id==index){
            value.child.push(currremark);
            value.hasChild=true;
        }
        else{
            allNodeText(value.child,index,currremark)
        }
    })
}




