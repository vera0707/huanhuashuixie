/**
 * Created by zhangliyuan on 16/6/16.
 */

require("../../styles/report/realTimeData.css");

var $ = require("jquery");
var juicer = require('juicer');
var _ = require('underscore');
var d3 = require("../core/d3.min.js");
var d3Tip = require("../core/d3.tip.js")();
var chinaJson = require("../core/china.js").china;
var crownImage = require("../../images/report/realTimeData/crown.png");


var L = require('../core/core.js');

L.dialog = require('../core/dialog.js');

$(function(){

    function RealTimeData() {
        this.init();
    }
    $.extend(RealTimeData.prototype,{
        init : function () {
            var self = this;

            window.winWidth = $("body").width();

            var now = new Date(), year = now.getFullYear(), month = now.getMonth() + 1,date = now.getDate();

            if( month < 10){
                month = "0" + month;
            }
            if( date < 10){
                date = "0" + date;
            }

            $(".rel-data-time").text("更新时间：" + year + "." + month + "." + date);

            self.getDashboard();
            
            self.bindEvent();
            



        },
        bindEvent : function () {
            var self = this;

            var indexShowType = [0,0,0,0];
            
            $(".rel-data-title").on("click",function () {
                var $this = $(this),
                    indexNum = $this.data("index");
                
                if($this.hasClass("show")){
                    $this.removeClass("show");

                    $this.parents(".rel-data-li").removeClass("show");
                }else{
                    $this.addClass("show");

                    $this.parents(".rel-data-li").addClass("show");

                }
                if(indexNum == 1 && !indexShowType[0]){
                    indexShowType[0] = 1;
                    self.getPlatformOutline();
                }else if(indexNum == 2 && !indexShowType[1]){
                    indexShowType[1] = 1;

                    self.getRiskControl();
                }else if(indexNum == 3 && !indexShowType[2]){
                    indexShowType[2] = 1;

                    self.getProjectOverview();
                }else if(indexNum == 4 && !indexShowType[3]){
                    indexShowType[3] = 1;

                    self.getUserInfo();
                    self.getTotalInvestAmount();
                    // self.getStillAmount();
                }
                
            });
        },
        drawChinaMap : function (mapData) {//绘制中国地图
            var width  = 600,height = 400,bgColor;

            var fillColor = [
                "#ac96bf",
                "#fd7573",
                "#fcd77d",
                "#81e3c9",
                "#79c0f0"
            ];

            var gSouthSea = d3.select("#southsea");
            gSouthSea.attr("transform","translate(0,0)scale(0.3)")
                .selectAll("path")
                .on("mouseover",function(d,i){
                    bgColor = d3.select(this).attr("fill");
                    d3.select(this).attr("fill","#fc5856");
                })
                .on("mouseout",function(d,i){
                    d3.select(this).attr("fill",bgColor);
                });

            var svg = d3.select(".china-map-svg").insert("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(0,0)scale(0.55)");

            var projection = d3.geo.mercator()
                .center([107, 31])
                .scale(500)
                .translate([width/2, height*2/3]);

            var path = d3.geo.path()
                .projection(projection);



            var mapTip = d3.select("body")
                .append("div")
                .attr("class","d3-tip n mapTip")
                .style("opacity",0.0);




                _.each(chinaJson.features,function (v,k) {

                    _.each(mapData,function(val,key){
                        if(v.properties.id == val.id){
                            v.percentage = val.percentage;
                            v.index = val.index;
                        }
                    });
                });






                svg.selectAll("path")
                    .data( chinaJson.features )
                    .enter()
                    .append("path")
                    .attr("stroke","#fff")
                    .attr("stroke-width",2)
                    .attr("fill", function(d,i){
                        if( d.index < 6 ){
                            return fillColor[d.index-1];
                        }else{
                            return "#feefef";
                        }
                    })
                    .attr("d", path )
                    .on("mousemove",function(d,i){
                        var tipHtml;

                        if(!!d.percentage){
                            tipHtml = "<span style='color:#fff'>"+d.properties.name+",占比" + d.percentage + "%</span>";
                        }else{
                            tipHtml = "<span style='color:#fff'>"+d.properties.name+",占比0%</span>";
                        }

                        mapTip.style({
                            "opacity": 1.0
                        }).html(tipHtml);

                        mapTip.style({
                            "left": (d3.event.pageX - Number(mapTip.style("width").split("px")[0])/2 - 20) + "px",
                            "top": (d3.event.pageY - Number(mapTip.style("height").split("px")[0]) - 30) + "px"
                        });

                    })
                    .on("mouseover",function(d,i){
                        bgColor = d3.select(this).attr("fill");

                        d3.select(this).attr("fill","#fc5856");


                    })
                    .on("mouseout",function(d,i){
                        d3.select(this).attr("fill",bgColor);
                        mapTip.style({
                            "opacity": 0.0
                        });
                    });

        },
        drowCircle : function (cirRate) {
            var cirData = {
                conClassName : "risk-amount-used-svg",
                rate : cirRate,
                title : ['风险准备金','占待还金额的比例'],
                color : "#fd7573"
            };




            var margin = {top: 60, right: 30, bottom: 50, left: 30},
                width = window.winWidth*0.42 - margin.left - margin.right,
                height = window.winWidth*0.6 - margin.top - margin.bottom;

            var cirSvg = d3.select("."+cirData.conClassName).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            cirSvg.append('g')
                .attr('transform', 'translate(0,' + (height) + ')')
                .append('rect')
                .attr('class', 'bar')

                .attr('width', window.winWidth*0.1)
                .attr('height', height)
                .attr('x', width/2 - window.winWidth*0.1/2)
                .attr('y', 0 - height)
                .style('fill', '#ecf1f0');
            cirSvg.append('g')
                .attr('transform', 'translate(0,' + (height) + ')')
                .append('rect')
                .attr('class', 'bar')
                .attr('width', window.winWidth*0.1)
                .attr('x', width/2 - window.winWidth*0.1/2)
                .attr('y', 0 )
                .style('fill', '#fd7573')
                .attr("height", function(d){
                    return 0;
                })
                .transition()
                .delay(function(d,i){
                    return i * 200;
                })
                .duration(1000)
                .ease("linear")
                .attr('y', function (d) {
                    return 0 - height*cirData.rate/100;
                })
                .attr("height", function(d){
                    return height*cirData.rate/100;
                });
            cirSvg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (height) + ')')
                .append("line")
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', width)
                .attr('y2', 0);

            var text = cirSvg.append("g")
                .attr("width", width + margin.left + margin.right);

            cirSvg.selectAll(".inner-text")
                .data(cirData.title)
                .enter()
                .append('text')
                .attr('x', function (d,i) {
                    return (width + margin.left + margin.right - 70)/2;
                })
                .attr('y', function (d,i) {
                    return height + 20 + i*20;
                })
                .text(function (d,i) {
                    return d;
                })
                .style("text-anchor", "middle")
                .style("font-size", "14");
            cirSvg.append('text')
                .attr('x', function (d,i) {
                    return (width - 40)/2;
                })
                .attr('y', -36)
                .text(cirData.rate+"%")
                .style("font-size", "16");
        },
        drowBar : function (barData) {
            // 模拟数据


            var maxY = (Math.ceil(Number(d3.max(barData.data,function(d){return d.value;}))/(barData.step))+1)*barData.step;

            barData.xValue = barData.data.map(function(d) {
                return d.name;
            });

            // 创建一个分组用来组合要画的图表元素
            var barSvg = d3.select("."+barData.conClassName).append("svg")
                .attr("width", barData.width )
                .attr("height", barData.height)
                .append("g")
                .attr('transform', "translate(" + barData.padding.left + ',' + barData.padding.top + ')');

            // 定义x轴的比例尺(序数比例尺)
            var xScale = d3.scale.ordinal()
                .domain(barData.xValue)
                .rangeRoundBands([0, barData.width - barData.padding.left - barData.padding.right],0,0);
            // 定义y轴的比例尺(线性比例尺)
            var yScale = d3.scale.linear()
                .domain([0, maxY])
                .range([barData.height - barData.padding.top - barData.padding.bottom, 0]);
            // 定义x轴和y轴
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .innerTickSize([0])
                .outerTickSize([0]);
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .tickSize(barData.width - barData.padding.left - barData.padding.right)
                .orient('right')
                .tickValues(_.range(0, maxY, barData.step));


            var drowBarTip = $(".rel-data-tip"),drowBarTipArrow = $(".rel-data-tip-arrow");

            // 添加坐标轴元素

            barSvg.append('g')
                .attr('class', 'y axis hide-path fill-e4e4e4')
                .call(yAxis);


            barSvg.selectAll(".y.axis g")
                .filter(function(d) { return d;})
                .classed("minor", true);
            barSvg.selectAll(".y.axis .tick text")
                .attr("x", -10)
                .attr("dy", 6).style("text-anchor", "end");

            // 矩形之间的间距
            var rectMargin = 8,bgColor;
            // 添加矩形
            barSvg.selectAll('.bar')
                .data(barData.data)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', function(d, i) {
                    return xScale(barData.xValue[i]) + rectMargin;
                })
                .attr('width', xScale.rangeBand() - 2*rectMargin)
                .attr('fill', function(d, i) {
                    if(i%2 == 0){
                        return "#fd7573";
                    }else{
                        return "#81e3c9";
                    }
                })
                .on('mouseover', function (d,i) {
                    var $parSvg = $("."+barData.conClassName),
                        svgT = Number($parSvg.offset().top),
                        svgL = Number($parSvg.offset().left),
                        svgPdL = barData.padding.left,
                        thisSel = d3.select(this),
                        thisWidth = Number(thisSel.attr("width")),
                        xPos = svgL + Number(thisSel.attr("x")) + (thisWidth/2) + svgPdL,
                        yPos = svgT + Number(thisSel.attr("y")),
                        dateArr = barData.data[i].name,
                        bgColor = d3.select(this).attr("fill");


                    drowBarTip.css({
                        "display": "block",
                        "width" : barData.tipWidth
                    }).text(dateArr+"月:" + barData.data[i].value + barData.unit);

                    var tipConW = drowBarTip.width(),
                        tipConH = drowBarTip.height(),
                        tipConL = xPos - ((tipConW + 20)/2),
                        tipConT = yPos - tipConH - 8;


                    if( xPos + ((tipConW + 20)/2) > window.winWidth){
                        tipConL =  window.winWidth - (tipConW + 20);
                    }
                    drowBarTip.css({
                        "left": tipConL  + "px",
                        "top": tipConT + "px"
                    });


                    drowBarTipArrow.css({
                        "display": "inline-block",
                        "left": (xPos - 6) + "px",
                        "top": (yPos + 12) + "px"
                    });

                    d3.select(this).attr("fill",function () {

                        if(i%2 == 0){
                            return "#f65b54";
                        }else{
                            return "#2edeaf";
                        }
                    });
                    

                })
                .on('mouseout', function (d,i) {
                    drowBarTip.css({
                        "display": "none"
                    }).html("");
                    drowBarTipArrow.css({
                        "display": "none"
                    }).html("");

                    d3.select(this).attr("fill",function () {
                        if(i%2 == 0){
                            return "#fd7573";
                        }else{
                            return "#81e3c9";
                        }
                    });
                })
                .attr("y",function(d){
                    var min = yScale.domain()[0];
                    return yScale(min);
                })
                .attr("height", function(d){
                    return 0;
                })
                .transition()
                .delay(function(d,i){
                    return i * 200;
                })
                .duration(1000)
                .ease("linear")
                .attr("y",function(d){
                    return yScale(d.value);
                })
                .attr("height", function(d){
                    return barData.height - barData.padding.top - barData.padding.bottom - yScale(d.value);
                });
            barSvg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (barData.height - barData.padding.bottom - barData.padding.top) + ')')
                .call(xAxis);

            barSvg.selectAll(".x.axis .tick text")
                .attr("y", 10)
                .attr('fill', function(d, i) {
                    return "#333";
                });


        },
        drowLateralBar : function (pawnTotalValuation,readyRepayPrincipalInterest) {
            // 模拟数据
            var lateralBarData = [
                {
                    name : "总估价",
                    value : Number(pawnTotalValuation),
                    fillColor : "#fd7573"
                },
                {
                    name : "待还本息",
                    value : Number(readyRepayPrincipalInterest),
                    fillColor : "#81e3c9"

                }
            ];


            var maxValue = (Math.ceil(Number(d3.max(lateralBarData, function(d) {return d.value; }))/40)+1)*40;


            var margin = {top: 20, right: 20, bottom: 50, left: 40},
                width = window.winWidth*0.55 - margin.left - margin.right,
                height = window.winWidth*0.6 - margin.top - margin.bottom;

            var lateralBarSvg = d3.select(".mortgaging-building-svg").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // 定义x轴的比例尺(序数比例尺)
            var xScale = d3.scale.ordinal()
                .domain(lateralBarData.map(function(d) { return d.name; }))
                .rangeRoundBands([0, width],0,0);
            // 定义y轴的比例尺(线性比例尺)
            var yScale = d3.scale.linear()
                .domain([0, maxValue])
                .range([height, 0]);
            // 定义x轴和y轴
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .innerTickSize([0])
                .outerTickSize([0]);
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .tickSize(width)
                .orient('right')
                .tickValues(_.range(0, maxValue, 40));


            var drowLateralBarTip = $(".rel-data-tip"),drowLateralBarTipArrow = $(".rel-data-tip-arrow");


            // 添加坐标轴元素

            lateralBarSvg.append('g')
                .attr('class', 'y axis hide-path fill-e4e4e4')
                .call(yAxis);
            lateralBarSvg.selectAll(".y.axis g")
                .filter(function(d) { return d;})
                .classed("minor", true);
            lateralBarSvg.selectAll(".y.axis .tick text")
                .attr("x", -10)
                .attr("dy", 6).style("text-anchor", "end");

            // 矩形之间的间距
            var rectMargin = 15;
            // 添加矩形
            lateralBarSvg.selectAll('.bar')
                .data(lateralBarData)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', function(d, i) {
                    return xScale(d.name) + rectMargin;
                })
                .attr('width', xScale.rangeBand() - 2*rectMargin)
                .attr('fill', function(d, i) {
                    if(i%2 == 0){
                        return "#fd7573";
                    }else{
                        return "#81e3c9";
                    }
                })
                .on('mouseover', function (d,i) {
                    var $parSvg = $(".mortgaging-building-svg"),
                        svgT = Number($parSvg.offset().top),
                        svgL = Number($parSvg.offset().left),
                        svgPdL = margin.left,
                        svgPdT = margin.top,
                        thisSel = d3.select(this),
                        thisWidth = Number(thisSel.attr("width")),
                        xPos = svgL + Number(thisSel.attr("x")) + (thisWidth/2) + svgPdL,
                        yPos = svgT + Number(thisSel.attr("y")),
                        dateArr = lateralBarData[i].name + (lateralBarData[i].value*1000).toFixed(2);

                    drowLateralBarTip.css({
                        "display": "block",
                        "width" : 145 + "px"
                    }).text( dateArr + "万元");

                    var tipConW = drowLateralBarTip.width(),
                        tipConH = drowLateralBarTip.height(),
                        tipConL = xPos - (tipConW + 20)/2,
                        tipConT = yPos + svgPdT - tipConH - 8;

                    if(tipConL < 0){
                        tipConL = 0;
                    }
                    drowLateralBarTip.css({
                        "left": tipConL  + "px",
                        "top": tipConT + "px"
                    });


                    drowLateralBarTipArrow.css({
                        "display": "inline-block",
                        "left": (xPos - 6) + "px",
                        "top": (yPos + svgPdT + 12) + "px"
                    });
                    d3.select(this).attr("fill",function () {

                        if(i%2 == 0){
                            return "#f65b54";
                        }else{
                            return "#2edeaf";
                        }
                    });

                })
                .on('mouseout', function (d,i) {
                    drowLateralBarTip.css({
                        "display": "none"
                    }).html("");
                    drowLateralBarTipArrow.css({
                        "display": "none"
                    }).html("");
                    d3.select(this).attr("fill",function () {

                        if(i%2 == 0){
                            return "#fd7573";
                        }else{
                            return "#81e3c9";
                        }
                    });
                })
                .attr("y",function(d){
                    var min = yScale.domain()[0];
                    return yScale(min);
                })
                .attr("height", function(d){
                    return 0;
                })
                .transition()
                .delay(function(d,i){
                    return i * 200;
                })
                .duration(1000)
                .ease("linear")
                .attr("y",function(d){
                    return yScale(d.value);
                })
                .attr("height", function(d){
                    return height - yScale(d.value);
                });

            lateralBarSvg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (height) + ')')
                .call(xAxis);

            lateralBarSvg.selectAll(".x.axis .tick text")
                .attr("y", 10)
                .attr('fill', function(d, i) {
                    return "#333";
                });
            var legend = lateralBarSvg.selectAll('.legend')
                .data(["房产抵押项目"])
                .enter()
                .append('g');


            legend.append('text')
                .attr('x', -10)
                .attr('y', 0)
                .style('font-size', 15)
                .text(function (d) { return d; });

            legend.append('text')
                .attr('x', 75)
                .attr('y', 0)
                .style('font-size', 12)
                .style('fill', "#999")
                .text("（千万元）");
        },
        drowPolygonBar : function (polygonBarData) {
            // 模拟数据
            var polygonBarData = {
                width: window.winWidth,
                height : window.winWidth*0.8,
                padding : { top: 0, right: 20, bottom: 100, left: 40 },
                x : ["金额逾期率", "项目逾期率", "近三个月项目逾期率"],
                y : polygonBarData,
                fillColor : ["#ac96bf","#fd7573","#fcd77d","#81e3c9","#79c0f0"]
            };
            var maxY = (Math.ceil(Number(d3.max(polygonBarData.y))/2)+1)*2;

            // 创建一个分组用来组合要画的图表元素
            var polygonBarSvg = d3.select(".risk-control-svg").append("svg")
                .attr("width", polygonBarData.width )
                .attr("height", polygonBarData.height)
                .append("g")
                .attr('transform', "translate(" + polygonBarData.padding.left + ',' + polygonBarData.padding.top + ')');

            // 定义x轴的比例尺(序数比例尺)
            var xScale = d3.scale.ordinal()
                .domain(polygonBarData.x)
                .rangeRoundBands([0, polygonBarData.width - polygonBarData.padding.left - polygonBarData.padding.right],0,0);
            // 定义y轴的比例尺(线性比例尺)
            var yScale = d3.scale.linear()
                .domain([0, maxY])
                .range([polygonBarData.height - polygonBarData.padding.top - polygonBarData.padding.bottom, 0]);
            // 定义x轴和y轴
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .innerTickSize([0])
                .outerTickSize([0]);
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .tickSize(polygonBarData.width - polygonBarData.padding.left - polygonBarData.padding.right)
                .orient('right')
                .tickValues(_.range(0, maxY, 2))
                .tickFormat(function (d) {
                    if(d > 0){
                        return d + "%";
                    }else{
                        return d;
                    }

                    return (d > 0)? (d+ "%") : d;
                });

            var drowPolygonBarTip = d3Tip.attr('class', 'd3-tip n drowPolygonBarTip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<span style='color:#fff'>" + d + "%</span>";
                });
            polygonBarSvg.call(drowPolygonBarTip);

            var xTranslate = (polygonBarData.height - polygonBarData.padding.bottom - polygonBarData.padding.top);

            // 添加坐标轴元素
            polygonBarSvg.append('g')
                .attr('class', 'x axis')
                .attr('transform','translate(0,' + xTranslate + ')')
                .call(xAxis);
            polygonBarSvg.append('g')
                .attr('class', 'y axis hide-path fill-e4e4e4')
                .call(yAxis);

            polygonBarSvg.selectAll(".x.axis .tick text")
                .attr("y", 10)
                .attr("x", function(d, i) {
                    return -i*10;
                })
                .attr('fill', function(d, i) {
                    return "#333";
                })
                .style("display","none");
            polygonBarSvg.selectAll(".y.axis g")
                .filter(function(d) { return d;})
                .classed("minor", true);
            polygonBarSvg.selectAll(".y.axis .tick text")
                .attr("x", -10)
                .attr("dy", 6).style("text-anchor", "end");

            // 矩形之间的间距
            var rectMargin = 0;
            // 添加矩形
            polygonBarSvg.append('g')
                .attr('transform', "translate(20,0)")
                .selectAll('.triangle')
                .data(polygonBarData.y)
                .enter()
                .append('polygon')
                .attr('class', 'triangle')
                .attr('fill', function(d, i) {
                    return polygonBarData.fillColor[i];
                })
                .on('mouseover', drowPolygonBarTip.show)
                .on('mouseout', drowPolygonBarTip.hide)
                .attr('points', function (d,i) {
                    var pointsStr1 = (xScale(polygonBarData.x[i]) + rectMargin) + "," + xTranslate
                        +" "+(xScale(polygonBarData.x[i]) + xScale.rangeBand()/2)+ ","+xTranslate
                        +" "+(xScale(polygonBarData.x[i]) + xScale.rangeBand() - rectMargin)+ "," + xTranslate;

                    var pointsStr2 = (xScale(polygonBarData.x[i]) + rectMargin - i*10) + "," + xTranslate
                        +" "+(xScale(polygonBarData.x[i]) + xScale.rangeBand()/2 - i*10)+ ","+xTranslate
                        +" "+(xScale(polygonBarData.x[i]) + xScale.rangeBand() - rectMargin - i*10)+ "," + xTranslate;

                    if(i == 0){
                        return pointsStr1;
                    }else{
                        return pointsStr2;

                    }
                })
                .transition()
                .delay(function(d,i){
                    return i * 200;
                })
                .duration(1000)
                .ease("linear")
                .attr('points', function (d,i) {
                    var pointsStr1 = (xScale(polygonBarData.x[i]) + rectMargin) + "," + xTranslate
                        +" "+(xScale(polygonBarData.x[i]) + xScale.rangeBand()/2)+ "," + yScale(d)
                        +" "+(xScale(polygonBarData.x[i]) + xScale.rangeBand() - rectMargin)+ "," + xTranslate;

                    var pointsStr2 = (xScale(polygonBarData.x[i]) + rectMargin - i*10) + "," + xTranslate
                        +" "+(xScale(polygonBarData.x[i]) + xScale.rangeBand()/2 - i*10)+ "," + yScale(d)
                        +" "+(xScale(polygonBarData.x[i]) + xScale.rangeBand() - rectMargin - i*10)+ "," + xTranslate;

                    if(i == 0){
                        return pointsStr1;
                    }else{
                        return pointsStr2;

                    }
                });

            // Draw legend
            var legendRectSize = 12,
                legendSpacing  = 20;

            var legend = polygonBarSvg.selectAll('.legend')
                .data(polygonBarData.x)
                .enter()
                .append('g')
                .attr('transform', function (d, i) {
                    var height = legendRectSize + legendSpacing;
                    var horz = 0;
                    var vert = i * height + xTranslate + 20;

                    if( i > 1){
                        horz = horz + 120;
                        vert = (i-2) * height + xTranslate + 20;
                    }

                    return 'translate(' + horz + ',' + vert + ')';

                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', function (d, i) { return polygonBarData.fillColor[i]; });

            legend.append('text')
                .attr('class', 'legend')
                .attr('x', legendRectSize + 5)
                .attr('y', 12)
                .text(function (d) { return d; });
            
        },
        drowBarDoubleY : function (doubleYBar) {
            var doubleYData = {
                width: window.winWidth,
                height : window.winWidth*0.7,
                padding : { top: 50, right: 60, bottom: 40, left: 40 },
                conClassName : "project-overview",
                legend1 : ["产品类型笔数百分比"],
                legend2 : ["最近3个月的平均满标用时"]
            }

            var maxY0 = (Math.ceil(Number(d3.max(doubleYBar.borrowType,function (d,i) {
                        return Number(d);
                    }))/20)+1)*20;

            var copies = (_.range(0, maxY0, 20).length - 1)*10,
                copiesNum = Math.ceil(d3.max(doubleYBar.useTime)/copies)*10,
                maxY1 = copiesNum*(_.range(0, maxY0, 20).length);


            // 创建一个分组用来组合要画的图表元素
            var doubleYSvg = d3.select("."+doubleYData.conClassName).append("svg")
                .attr("width", doubleYData.width)
                .attr("height", doubleYData.height)
                .append("g")
                .attr('transform', "translate(" + doubleYData.padding.left + ',' + doubleYData.padding.top + ')');

            // 定义x轴的比例尺(序数比例尺)
            var xScale = d3.scale.ordinal()
                .domain(doubleYBar.name)
                .rangeRoundBands([0, doubleYData.width - doubleYData.padding.left - doubleYData.padding.right],0,0);
            // 定义y轴的比例尺(线性比例尺)
            var yScale0 = d3.scale.linear()
                .domain([0, maxY0])
                .range([doubleYData.height - doubleYData.padding.top - doubleYData.padding.bottom, 0]);
            // 定义y轴的比例尺(线性比例尺)
            var yScale1 = d3.scale.linear()
                .domain([0, maxY1])
                .range([doubleYData.height - doubleYData.padding.top - doubleYData.padding.bottom, 0]);
            // 定义x轴和y轴
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .innerTickSize([0])
                .outerTickSize([0]);
            var yAxis0 = d3.svg.axis()
                .scale(yScale0)
                .tickSize(doubleYData.width - doubleYData.padding.left - doubleYData.padding.right)
                .orient('right')
                .tickFormat(function (d) {
                    return (d > 0)? (d+ "%") : d;
                })
                .tickValues(_.range(0, maxY0, 20));
            var yAxis1 = d3.svg.axis()
                .scale(yScale1)
                .tickFormat(function (d) {
                    return (d > 0)? (d+ "min") : d;
                })
                .tickValues(_.range(0, maxY1, copiesNum))
                .orient('left')
                .innerTickSize([0])
                .outerTickSize([0]);


            var drowBarDoubleYTip = $(".rel-data-tip"),drowBarDoubleYTipArrow = $(".rel-data-tip-arrow");

            // 添加坐标轴元素

            doubleYSvg.append('g')
                .attr('class', 'y y0 axis hide-path fill-e4e4e4')
                .call(yAxis0);
            doubleYSvg.append('g')
                .attr('class', 'y y1 axis hide-path fill-e4e4e4')
                .attr("transform", "translate(" + (doubleYData.width - 60) + ",0)")
                .call(yAxis1);


            doubleYSvg.selectAll(".y0.axis g")
                .filter(function(d) { return d;})
                .classed("minor", true);

            doubleYSvg.selectAll(".y0.axis .tick text")
                .attr("x", -5)
                .attr("dy", 6).style("text-anchor", "end");

            doubleYSvg.selectAll(".y1.axis g")
                .filter(function(d) { return d;})
                .classed("minor", true);

            doubleYSvg.selectAll(".y1.axis .tick text")
                .attr("x", -10)
                .attr("dy", 6).style("text-anchor", "middle");


            // 矩形之间的间距
            var rectMargin = 10;
            // 添加矩形

            doubleYSvg.selectAll('.bar')
                .data(doubleYBar.borrowType)
                .enter()
                .append('rect')
                .attr('class', 'bar1')
                .attr('x', function(d, i) {
                    return xScale(doubleYBar.name[i]) + rectMargin;
                })
                .attr('width', xScale.rangeBand() - 2*rectMargin)
                .attr('fill', function(d, i) {
                    return (i%2 == 0) ? "#fd7573" : "#81e3c9";

                })
                .on('mouseover', function (d,i) {
                    var $parSvg = $("."+doubleYData.conClassName),
                        svgT = Number($parSvg.offset().top),
                        svgL = Number($parSvg.offset().left),
                        svgPdL = doubleYData.padding.left,
                        svgPdT = doubleYData.padding.top,
                        thisSel = d3.select(this),
                        thisWidth = Number(thisSel.attr("width")),
                        xPos = svgL + Number(thisSel.attr("x")) + (thisWidth/2) + svgPdL,
                        yPos = svgT + Number(thisSel.attr("y"));

                    var bgColor;
                    if(i%2 == 0){
                        bgColor = "#f65b54";
                    }else{
                        bgColor = "#2edeaf";
                    }
                    d3.select(this).attr("fill",bgColor);
                    drowBarDoubleYTip.addClass("width100px");
                    drowBarDoubleYTip.css({
                        "display": "block",
                        "width" : 100 + "px"
                    }).text(doubleYBar.name[i]+'占比'+ d + '%,近3个月平均售罄用时'+doubleYBar.useTime[i]+'分钟');

                    var tipConW = drowBarDoubleYTip.width(),
                        tipConH = drowBarDoubleYTip.height(),
                        tipConL = xPos - (tipConW + 20)/2,
                        tipConT = yPos + svgPdT - tipConH - 8;


                    drowBarDoubleYTip.css({
                        "left": tipConL  + "px",
                        "top": tipConT + "px"
                    });


                    drowBarDoubleYTipArrow.css({
                        "display": "inline-block",
                        "left": (xPos - 6) + "px",
                        "top": (yPos + svgPdT + 12) + "px"
                    })
                })
                .on('mouseout', function (d,i) {
                    // drowBarDoubleYTip.removeClass("width100px");

                    drowBarDoubleYTip.css({
                        "display": "none"
                    }).html("");
                    drowBarDoubleYTipArrow.css({
                        "display": "none"
                    }).html("");
                    var bgColor;
                    if(i%2 == 0){
                        bgColor = "#fd7573";
                    }else{
                        bgColor = "#81e3c9";
                    }
                    d3.select(this).attr("fill",bgColor);
                })
                .attr("y",function(d){
                    var min = yScale0.domain()[0];
                    return yScale0(min);
                })
                .attr("height", function(d){
                    return 0;
                })
                .transition()
                .delay(function(d,i){
                    return i * 200;
                })
                .duration(1000)
                .ease("linear")
                .attr("y",function(d){
                    return yScale0(d);
                })
                .attr("height", function(d){
                    return doubleYData.height - doubleYData.padding.top - doubleYData.padding.bottom - yScale0(d);
                });
            var line = d3.svg.line()
                .x(function(d,i) {
                    return xScale(doubleYBar.name[i]) + xScale.rangeBand()/2;
                })
                .y(function(d,i) {
                    return yScale1(d);
                })
                .interpolate('monotone');

            var path = doubleYSvg.append('path')
                .attr('class', 'line')
                .attr('d', line(doubleYBar.useTime));


            doubleYSvg.selectAll('.circle-wrap')
                .data(doubleYBar.useTime)
                .enter()
                .append('g')
                .attr('class', 'circle-wrap')
                .append('circle')
                .attr('class', 'line-circle')
                .attr('cx', line.x())
                .attr('cy', line.y())
                .attr('r', 4)
                .style('stroke', "#fce271")
                .style('stroke-width', 6)
                .style('stroke-opacity', 0.5);
            
            doubleYSvg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (doubleYData.height - doubleYData.padding.bottom - doubleYData.padding.top) + ')')
                .call(xAxis);
            doubleYSvg.selectAll(".x.axis .tick text")
                .attr("y", 10)
                .attr('fill', function(d, i) {
                    return "#333";
                })
                .style('font-size', 12);
            // Draw legend
            var legendRectSize = 10;

            var legend1 = doubleYSvg.selectAll('.legend1')
                .data(doubleYData.legend1)
                .enter()
                .append('g')
                .attr('transform', 'translate(0,-40)');

            legend1.append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('x', 3)
                .attr('y', 2)
                .style('fill', '#fd7573');
            legend1.append('rect')
                .attr('width', 10)
                .attr('height', 20)
                .attr('x', 17)
                .attr('y', -8)
                .style('fill', '#81e3c9');
            legend1.append('line')
                .attr('x1', 0)
                .attr('y1', 12)
                .attr('x2', 30)
                .attr('y2', 12)
                .style('stroke', '#333')
                .style('fill', 'none')
                .style("shape-rendering","crispEdges");

            legend1.append('text')
                .attr('x', 40)
                .attr('y', 8)
                .style('font-size', 15)
                .text(function (d) { return d; });

            legend1.append('text')
                .attr('x', 180)
                .attr('y', 8)
                .style('font-size', 15)
                .style('fill', "#999")
                .text("（ % ）");

            var legend2 = doubleYSvg.selectAll('.legend2')
                .data(doubleYData.legend2)
                .enter()
                .append('g')
                .attr('transform', 'translate(0,-10)');

            legend2.append('circle')
                .attr('class', 'line-circle')
                .attr('cx', 15)
                .attr('cy', 5)
                .attr('r', 4)
                .style('stroke', "#fce271")
                .style('stroke-width', 6)
                .style('stroke-opacity', 0.5);
            legend2.append('line')
                .attr('x1', 0)
                .attr('y1', 5)
                .attr('x2', 30)
                .attr('y2', 5)
                .style('stroke', '#fce271');

            legend2.append('text')
                .attr('x', 40)
                .attr('y', 12)
                .style('font-size', 15)
                .text(function (d) { return d; });

            legend2.append('text')
                .attr('x', 210)
                .attr('y', 12)
                .style('font-size', 15)
                .style('fill', "#999")
                .text("（ 分 ）");

        },
        drowBarDouble : function (timeLineData) {
            var barData = {
                width: window.winWidth,
                height : window.winWidth*0.8,
                padding : { top: 50, right: 30, bottom: 50, left: 60 },
                conClassName : "borrow-time-svg",
                title : "投资人和借款人最近一年的人数分布",
                legend : [{name:"借款人",color:"#fd7573"},{name:"投资人",color:"#81e3c9"}]
            }
            barData.data = timeLineData;

            var timeY = new Date().getFullYear();

            barData.xValue = timeLineData.map(function(d) {
                var dateArr = d.date.split("-");
                if(dateArr[0] == timeY){
                    return dateArr[1];
                }else{
                    timeY = dateArr[0];
                    return dateArr[0].slice(2,4) + "/" + dateArr[1];
                }

            });
            barData.bar1 = timeLineData.map(function(d) {
                return d.borrowerSum;
            });
            barData.bar2 = timeLineData.map(function(d) {
                return d.investorSum;
            });


            var maxBar1 = d3.max(barData.bar1),maxBar2 = d3.max(barData.bar2),maxBar = (maxBar1 > maxBar2) ? maxBar1 : maxBar2;





            // 创建一个分组用来组合要画的图表元素
            var barSvg = d3.select("."+barData.conClassName).append("svg")
                .attr("width", barData.width )
                .attr("height", barData.height)
                .append("g")
                .attr('transform', "translate(" + barData.padding.left + ',' + barData.padding.top + ')');

            // 定义x轴的比例尺(序数比例尺)
            var xScale = d3.scale.ordinal()
                .domain(barData.xValue)
                .rangeRoundBands([0, barData.width - barData.padding.left - barData.padding.right],0,0);
            // 定义y轴的比例尺(线性比例尺)
            var yScale = d3.scale.linear()
                .domain([0, maxBar])
                .range([barData.height - barData.padding.top - barData.padding.bottom, 0]);
            // 定义x轴和y轴
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .innerTickSize([0])
                .outerTickSize([0]);
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .tickSize(barData.width - barData.padding.left - barData.padding.right)
                .orient('right');

            var drowBarDoubletip1 = d3Tip.attr('class', 'd3-tip n drowBarDoubletip1')
                .offset([-10, 0])
                .html(function(d,i) {
                    var dateArr = timeLineData[i].date.split("-");
                    return "<span style='color:#fff'>"+dateArr[0]+"年"+dateArr[1]+"月,借款人:" + d + "人</span>";
                });
            var drowBarDoubletip2 = d3Tip.attr('class', 'd3-tip drowBarDoubletip2')
                .offset([-10, 0])
                .html(function(d,i) {
                    var dateArr = timeLineData[i].date.split("-");
                    return "<span style='color:#fff'>"+dateArr[0]+"年"+dateArr[1]+"月,投资人:" + d + "人</span>";                                return "<span style='color:#fff'>" + d + "</span>";
                });

            // barSvg.call(drowBarDoubletip1);
            // barSvg.call(drowBarDoubletip2);

            // 添加坐标轴元素
            barSvg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (barData.height - barData.padding.bottom - barData.padding.top) + ')')
                .call(xAxis);
            barSvg.append('g')
                .attr('class', 'y axis hide-path fill-e4e4e4')
                .call(yAxis);

            barSvg.selectAll(".x.axis .tick text")
                .attr("y", 10)
                .attr('fill', function(d, i) {
                    return "#333";
                });
            barSvg.selectAll(".y.axis g")
                .filter(function(d) { return d;})
                .classed("minor", true);
            barSvg.selectAll(".y.axis .tick text")
                .attr("x", -10)
                .attr("dy", 6).style("text-anchor", "end");

            // 矩形之间的间距
            var rectMargin = 10;
            // 添加矩形

            barSvg.selectAll('.bar1')
                .data(barData.bar1)
                .enter()
                .append('rect')
                .attr('class', 'bar1')
                .attr('x', function(d, i) {
                    return xScale(barData.xValue[i]) + rectMargin;
                })
                .attr('width', 15)
                .attr('fill', "#fd7573")
                .call(drowBarDoubletip1)
                .on('mouseover', drowBarDoubletip1.show)
                .on('mouseout', drowBarDoubletip1.hide)
                .attr("y",function(d){
                    var min = yScale.domain()[0];
                    return yScale(min);
                })
                .attr("height", function(d){
                    return 0;
                })
                .transition()
                .delay(function(d,i){
                    return i * 200;
                })
                .duration(1000)
                .ease("linear")
                .attr("y",function(d){
                    return yScale(d);
                })
                .attr("height", function(d){
                    return barData.height - barData.padding.top - barData.padding.bottom - yScale(d);

                });
            barSvg.selectAll('.bar2')
                .data(barData.bar2)
                .enter()
                .append('rect')
                .attr('class', 'bar2')
                .attr('x', function(d, i) {
                    return xScale(barData.xValue[i]) + 15 + rectMargin;
                })
                .attr('width', 15)
                .attr('fill', '#81e3c9')
                .call(drowBarDoubletip2)
                .on('mouseover', drowBarDoubletip2.show)
                .on('mouseout', drowBarDoubletip2.hide)
                .attr("y",function(d){
                    var min = yScale.domain()[0];
                    return yScale(min);
                })
                .attr("height", function(d){
                    return 0;
                })
                .transition()
                .delay(function(d,i){
                    return i * 200;
                })
                .duration(1000)
                .ease("linear")
                .attr("y",function(d){
                    return yScale(d);
                })
                .attr("height", function(d){
                    return barData.height - barData.padding.top - barData.padding.bottom - yScale(d);
                });



            var legendRectSize = 10;

            var legend = barSvg.selectAll('.legend')
                .data(barData.legend)
                .enter()
                .append('g')
                .attr('transform', function (d, i) {
                    var horz = i * 100 ;
                    return 'translate(' + horz + ',-15)';
                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', function (d, i) { return barData.legend[i].color; });
            legend.append('text')
                .attr('class', 'legend')
                .attr('x', legendRectSize + 10)
                .attr('y', 10)
                .text(function (d) { return d.name; })
                .style("font-size",14);

            barSvg.append('text')
                .attr('x', 0)
                .attr('y', -28)
                .text(barData.title)
                .style("font-size",14);
            barSvg.append('text')
                .attr('class', 'c-999')
                .attr('x', 220)
                .attr('y', -28)
                .text("（人）")
                .style("font-size",14)
                .style('fill', "#999");




        },
        drowStackedBar : function (stackedData) {
//                    var stackedData = {
//                        width : 400,
//                        height : 200,
//                        marginL : 60,
//                        marginR : 60,
//                        conClassName : "sex-age-proportion-svg",
//                        color : ["#ac96bf","#fd7573","#fcd77d","#81e3c9","#79c0f0"],
//                        legendName : ["18-19岁","20-29岁","30-39岁","40-49岁","50岁以上"],
//                        title : "各年龄段百分比分布",
//                        data : [
//                            {
//                                name:"投资人",
//                                totalNum : 101,
//                                value : [2,42,45,7,5],
//                                manSex : 59.42,
//                                womanSex : 40.58
//                            },
//                            {
//                                name:"借款人",
//                                totalNum : 369,
//                                value : [0,111,219,39,0],
//                                manSex : 59.42,
//                                womanSex : 40.58
//                            }
//                        ]
//                    }


            var y = d3.scale.ordinal()
                .rangeRoundBands([0, stackedData.height - stackedData.marginT - stackedData.marginB], 0.4);


            var yAxis = d3.svg.axis()
                .scale(y)
                .tickSize(0)
                .orient("left");

            // var drowStackedBarTip = d3.select("body")
            //     .append("div")
            //     .attr("class","d3-tip n")
            //     .style("opacity",0.0);
            var drowStackedBarTip = $(".rel-data-tip"),drowStackedBarTipArrow = $(".rel-data-tip-arrow");


            var stackedSvg = d3.select("."+stackedData.conClassName).append("svg")
                .attr("width", stackedData.width)
                .attr("height", stackedData.height*2+stackedData.marginT);

            // Draw legend
            var legendRectSize = 12;

            var legend = stackedSvg.selectAll('.legend')
                .data(stackedData.legendName)
                .enter()
                .append('g')
                .attr('transform', function (d, i) {
                    var horz = i * 90 + 30,y = 40;
                    if( i > 2){
                        horz = (i-3) * 90 + 30;
                        y = 80
                    }
                    return 'translate(' + horz + ','+y+')';
                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', function (d, i) { return stackedData.color[i]; });

            legend.append('text')
                .attr('class', 'legend')
                .attr('x', legendRectSize + 10)
                .attr('y', 10)
                .text(function (d) { return d; })
                .style("font-size",14);

            stackedSvg.selectAll(".stacked-li")
                .data(stackedData.data)
                .enter().append("g")
                .attr("class", function (d,i) {
                    return "stacked-li"+i;
                })
                .attr("transform", function (d,i) {
                    var h = 120;
                    if( i > 0){
                        h = stackedData.height + stackedData.marginT +40;
                    }
                    return "translate("+stackedData.marginL+","+h+")";
                })
                .each(function (d,i) {
                    var  stackedList = d3.select(".stacked-li"+i);


                    var stackedListText = stackedList.append("g")
                        .attr("class", "w100 t-c")
                        .attr("transform", function (d,i) {
                            var transformX = ((stackedData.width - stackedData.marginL - stackedData.marginR-180)/2) - 30;

                            return "translate("+transformX+",15)";
                        });
                    stackedListText.append("text")
                        .text(function (d) { return d.name; })
                        .attr("transform", "translate(30,50)")
                        .style("font-size",16);
                    stackedListText.append("text")
                        .text(function (d) { return stackedData.title; })
                        .attr("transform", "translate(80,50)")
                        .style("font-size",14);                  

                    stackedListText.append("image")
                        .attr("width",8)
                        .attr("height",18)
                        .attr("xlink:href",$("#man_icon").attr("src"))
                        // .attr("class", "rel-data-icon stacked-list-icon icon1")
                        .attr("transform", "translate(30,70)");
                    stackedListText.append("image")
                        .attr("width",8)
                        .attr("height",18)
                        .attr("xlink:href",$("#woman_icon").attr("src"))
                        // .attr("class", "rel-data-icon stacked-list-icon icon2")
                        .attr("transform", "translate(120,70)");

                    stackedListText.append("text")
                        .text(function (d) { return "男:" + d.manSex + "%"; })
                        .attr("transform", "translate(42,85)")
                        .style("font-size",14);
                    stackedListText.append("text")
                        .text(function (d) { return "女:" + d.womanSex + "%"; })
                        .attr("transform", "translate(132,85)")
                        .style("font-size",14);




                    stackedList.selectAll(".bar")
                        .data(d.value)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function(data,index) {
                            var totalW = stackedData.width - stackedData.marginL - stackedData.marginR;

                            if(index > 0){
                                var upVal = 0;
                                _.each(d.value,function (v,k) {
                                    if(k < index){
                                        upVal += v;
                                    }
                                });

                                return ((upVal)*totalW)/d.totalNum ;
                            }else{
                                return 0;

                            }
                        })
                        .attr('fill', function(data, index) {
                            return stackedData.color[index];
                        })
                        .attr("y", 0)
                        .on('mouseover', function (data,index) {
                            var $parSvg = $("."+stackedData.conClassName+" .stacked-li"+i),
                                svgT = Number($parSvg.offset().top),
                                svgL = Number($parSvg.offset().left),
                                xPos = svgL + (Number(d3.select(this).attr("width"))/2) + Number(d3.select(this).attr("x")),
                                yPos = svgT + Number(d3.select(this).attr("y"));

                            drowStackedBarTip.css({
                                "display":"block",
                                "width": "110px"
                            }).html("<span style='color:#fff'>"+stackedData.legendName[index] + "的"+ d.name+"占比"+ ((data/d.totalNum)*100).toFixed(2) + "%</span>");



                            var tipW = 130,
                                tipH = 54;
                            var tipL = xPos - tipW/2,tipT = yPos - Number(drowStackedBarTip.height()) - 20 - 5;

                            if(tipL < 0){
                                tipL = 0;
                            }

                            if(tipL + tipW > window.winWidth){
                                tipL = window.winWidth - tipW;
                            }

                            drowStackedBarTip.css({
                                "left": tipL + "px",
                                "top": tipT + "px"
                            });

                            var tipArrowL = xPos - 6,tipArrowT = yPos - 5;


                            drowStackedBarTipArrow.css({
                                "display":"block",
                                "left": tipArrowL + "px",
                                "top": tipArrowT + "px"
                            })


                        })
                        .on('mouseout', function () {
                            drowStackedBarTip.css({
                                "display":"none"
                            });
                            drowStackedBarTipArrow.css({
                                "display":"none"
                            });
                        })
                        .attr("height", 30)
                        .attr("width", 0)
                        .transition()
                        .delay(function(data,index){
                            return index * 200;
                        })
                        .duration(1000)
                        .ease("linear")
                        .attr("width", function(data,index) {
                            var totalW = stackedData.width - stackedData.marginL - stackedData.marginR;

                            return (data*totalW)/d.totalNum;
                        });
                    stackedList.append("g")
                        .attr("class", "y axis fill-c333")
                        .attr("transform", function (d,i) {
                            return "translate(0,0)";
                        })
                        .call(yAxis);
                });









        },
        drowRing : function (ringData) {

            var h = ringData.height,w = ringData.width;

            if(ringData.showDetailNum == true && h < 260){
                $("." + ringData.conClassName).addClass("pd0");
            }

            var pie = d3.layout.pie()
                .value(function(d) { return d.value; })
                .sort(null);

            var innerRadius = h/3, outerRadius = h/2;
            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

            var ringSvg = d3.select("." + ringData.conClassName).append("svg")
                .attr("width", function () {
                    return h + ringData.legendWidth + ringData.legendSpacing;
                })
                .attr("height", function () {
                    var newH = h;
                    if( ringData.showDetailNum == true && h < 260 ){
                        newH = 260;
                    }
                    return newH;
                });

            var innerCircle = [
                {
                    x : outerRadius,
                    y : outerRadius,
                    r : innerRadius
                }

            ]

            var circleWrap = ringSvg.selectAll(".inner-circle")
                .data(innerCircle)
                .enter()
                .append("g")
                .attr("transform", function () {
                    var newH = h;
                    if(ringData.showDetailNum == true && h < 260){
                        newH = 260;
                    }
                    var transformY = (newH-h)/2;

                    return "translate(0," + transformY + ")";
                });

            circleWrap.append("circle")
                .attr("cx",outerRadius)
                .attr("cy", outerRadius)
                .attr("r", innerRadius)
                .style('fill', "#fff")
                .style('stroke', "#000");
            circleWrap.selectAll(".inner-circle-text")
                .data(ringData.name)
                .enter()
                .append('text')
                .attr('x', outerRadius)
                .attr('y', function (d,i) {
                    return outerRadius + i*15 + 2;
                })
                .text(function (d,i) {
                    return d;
                })
                .style("text-anchor", "middle")
                .style("font-size", "13");



            var drowRingTip = d3.select("body")
                .append("div")
                .attr("class","cir-tip drowRingTip")
                .style("opacity",0.0);

            var ringPath = ringSvg.datum(ringData.data).selectAll("path")
                .data(pie)
                .enter()
                .append("g")
                .attr("transform", function () {
                    var newH = h;
                    if(ringData.showDetailNum == true && h < 260){
                        newH = 260;
                    }
                    var transformY = newH/2;

                    return "translate(" + h / 2 + "," + transformY + ")";
                })
                .append("path")
                .attr("fill", function(d, i) {

                    return ringData.data[i].color;
                })
                .each(function() { this._current = {startAngle: 0, endAngle: 0}; });

            ringPath.transition()
                .attrTween("d", function(d) {
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                })
                .duration(2000);

            ringPath.on('mousemove', function(d){
                drowRingTip.style({
                    "opacity": 1.0
                }).html("<span style='color:#fff'>"+d.data.name+"," + d.data.percent + "%</span>");


                drowRingTip.style({
                    "left": (d3.event.pageX + 10) + "px",
                    "top": (d3.event.pageY + 10) + "px"
                });

            }).on('mouseout', function(d){
                drowRingTip.style("opacity",0.0);
            });


            // Draw legend
            var legendRectSize = 12;

            var legend = ringSvg.selectAll('.legend')
                .data(ringData.data)
                .enter()
                .append('g')
                .attr('transform', function (d, i) {

                    var newH = h;
                    if(ringData.showDetailNum == true && h < 260){
                        newH = 260;
                    }

                    var height = newH/(ringData.data.length + 1);


                    // if(ringData.showDetailNum == false){
                    //     height = 35;
                    // }

                    var legendH = 20;
                    if(ringData.showDetailNum == true){
                        legendH = 30;
                    }
                    var horz = h + ringData.legendSpacing;
                    var vert = ((i+1) * height) - (legendH/2);
                    // var vert = ((i) * height);

                    // if( i > 2 ){
                    //     horz = horz + 70;
                    //     vert = (i-3) * height;
                    // }

                    return 'translate(' + horz + ',' + vert + ')';

                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', function (d, i) { return d.color; });

            legend.append('text')
                .attr('class', 'legend')
                .attr('x', legendRectSize + 5)
                .attr('y', 12)
                .text(function (d) { return d.name; });


            if(ringData.showDetailNum == true){
                legend.append('text')
                    .attr('class', 'legend')
                    .attr('x', legendRectSize + 5)
                    .attr('y', 28)
                    .text(function (d) { return d.value + ringData.unit; })
                    .style('fill', "#999");
            }
        },
        renderProjectOverview : function (projectOverviewData) {
            var self = this;


            var ringData3 = {
                name : ["各借款期限","笔数分布"],
                legendWidth : 100,
                legendSpacing : 20,
                width : window.winWidth*0.9,
                height : window.winWidth*0.5,
                conClassName : "borrow-deadline-svg",
                showDetailNum : true,
                unit : "笔",
                data : [
                    {color : "#ac96bf"},
                    {color : "#fd7573"},
                    {color : "#fcd77d"},
                    {color : "#81e3c9"},
                    {color : "#79c0f0"}
                ]
            };

            ringData3.totalNum = 0;

            _.each(projectOverviewData.borrowDeadline,function (v,k) {
                ringData3.totalNum += Number(v);
            });

            ringData3.data[0].name = "≤1月";
            ringData3.data[0].value = projectOverviewData.borrowDeadline.deadline1;
            ringData3.data[0].percent = ((Number(projectOverviewData.borrowDeadline.deadline1)/ringData3.totalNum)*100).toFixed(2);


            ringData3.data[1].name = "≤2月";
            ringData3.data[1].value = projectOverviewData.borrowDeadline.deadline2;
            ringData3.data[1].percent = ((Number(projectOverviewData.borrowDeadline.deadline2)/ringData3.totalNum)*100).toFixed(2);


            ringData3.data[2].name = "≤3月";
            ringData3.data[2].value = projectOverviewData.borrowDeadline.deadline3;
            ringData3.data[2].percent = ((Number(projectOverviewData.borrowDeadline.deadline3)/ringData3.totalNum)*100).toFixed(2);


            ringData3.data[3].name = "≤6月";
            ringData3.data[3].value = projectOverviewData.borrowDeadline.deadline6;
            ringData3.data[3].percent = ((Number(projectOverviewData.borrowDeadline.deadline6)/ringData3.totalNum)*100).toFixed(2);


            ringData3.data[4].name = "≤12月";
            ringData3.data[4].value = projectOverviewData.borrowDeadline.deadline12;
            ringData3.data[4].percent = ((Number(projectOverviewData.borrowDeadline.deadline12)/ringData3.totalNum)*100).toFixed(2);




            self.drowRing(ringData3);

            var ringData4 = {
                name : ["各借款额度","笔数分布"],
                legendWidth : 100,
                legendSpacing : 20,
                width : window.winWidth*0.9,
                height : window.winWidth*0.5,
                conClassName : "borrow-quota-svg",
                showDetailNum : true,
                unit : "笔",
                data : [
                    {color : "#ac96bf"},
                    {color : "#fd7573"},
                    {color : "#fcd77d"},
                    {color : "#bce083"},
                    {color : "#81e3c9"},
                    {color : "#79c0f0"}
                ]
            };

            ringData4.totalNum = 0;

            _.each(projectOverviewData.borrowQuota,function (v,k) {
                ringData4.totalNum += Number(v);
            });

            ringData4.data[0].name = "< 1万";
            ringData4.data[0].value = projectOverviewData.borrowQuota.borrowAmount1;
            ringData4.data[0].percent = ((Number(projectOverviewData.borrowQuota.borrowAmount1)/ringData4.totalNum)*100).toFixed(2);


            ringData4.data[1].name = "1 - 50万";
            ringData4.data[1].value = projectOverviewData.borrowQuota.borrowAmount50;
            ringData4.data[1].percent = ((Number(projectOverviewData.borrowQuota.borrowAmount50)/ringData4.totalNum)*100).toFixed(2);


            ringData4.data[2].name = "50 - 100万";
            ringData4.data[2].value = projectOverviewData.borrowQuota.borrowAmount100;
            ringData4.data[2].percent = ((Number(projectOverviewData.borrowQuota.borrowAmount100)/ringData4.totalNum)*100).toFixed(2);


            ringData4.data[3].name = "100 - 200万";
            ringData4.data[3].value = projectOverviewData.borrowQuota.borrowAmount200;
            ringData4.data[3].percent = ((Number(projectOverviewData.borrowQuota.borrowAmount200)/ringData4.totalNum)*100).toFixed(2);


            ringData4.data[4].name = "200 - 500万";
            ringData4.data[4].value = projectOverviewData.borrowQuota.borrowAmount500;
            ringData4.data[4].percent = ((Number(projectOverviewData.borrowQuota.borrowAmount500)/ringData4.totalNum)*100).toFixed(2);


            ringData4.data[5].name = "> 500万";
            ringData4.data[5].value = projectOverviewData.borrowQuota.borrowAmountMore;
            ringData4.data[5].percent = ((Number(projectOverviewData.borrowQuota.borrowAmountMore)/ringData4.totalNum)*100).toFixed(2);


            self.drowRing(ringData4);



            var doubleYBar = {};

            doubleYBar.name = [];
            doubleYBar.borrowType = [];
            doubleYBar.useTime = [];

            doubleYBar.name[0] = projectOverviewData.borrowType["LJB"].title;
            doubleYBar.borrowType[0] = projectOverviewData.borrowType["LJB"].percentage.split("%")[0];
            doubleYBar.useTime[0] = projectOverviewData.fullScaleUseTime.fundPlanTime;


            doubleYBar.name[1] = projectOverviewData.borrowType["ZQZR"].title;
            doubleYBar.borrowType[1] = projectOverviewData.borrowType["ZQZR"].percentage.split("%")[0];
            doubleYBar.useTime[1] = projectOverviewData.fullScaleUseTime.transferDebtTime;

            doubleYBar.name[2] = projectOverviewData.borrowType["XEXYB"].title;
            doubleYBar.borrowType[2] = projectOverviewData.borrowType["XEXYB"].percentage.split("%")[0];
            doubleYBar.useTime[2] = projectOverviewData.fullScaleUseTime.microCreditTime;

            doubleYBar.name[3] = projectOverviewData.borrowType["SB"].title;
            doubleYBar.borrowType[3] = projectOverviewData.borrowType["SB"].percentage.split("%")[0];
            doubleYBar.useTime[3] = projectOverviewData.fullScaleUseTime.normalBorrowTime;

            self.drowBarDoubleY(doubleYBar);

        },
        renderUserInfo : function (userInfoData) {
            var self = this;


            var renderData = [
                // {
                //     name : "投资总人数",
                //     value : userInfoData.investorSum
                // },
                {
                    name : "借款总人数",
                    value : userInfoData.borrowerSum
                },
                // {
                //     name : "人均累计投资额度",
                //     value : userInfoData.avgInvestorAmount
                // },
                {
                    name : "笔均投资额度",
                    value : userInfoData.avgCountInvestAmount
                },
                {
                    name : "人均累计借款额度",
                    value : userInfoData.avgBorrowerAmount
                },
                {
                    name : "笔均借款额度",
                    value : userInfoData.avgBorrowAmount
                }
            ];

            self.renderUserInfoHeader(renderData);

            var ringData1 = {
                name : ["单笔投资","金额分布"],
                legendWidth : 100,
                legendSpacing : 20,
                width : window.winWidth*0.9,
                height : window.winWidth*0.5,
                conClassName : "invest-amount-svg",
                showDetailNum : false,
                data : [
                    {color : "#ac96bf"},
                    {color : "#fd7573"},
                    {color : "#fcd77d"},
                    {color : "#81e3c9"},
                    {color : "#79c0f0"}
                ]
            };

            ringData1.totalNum = 0;

            _.each(userInfoData.investAmountPercentage,function (v,k) {
                ringData1.totalNum += Number(v);
            });

            ringData1.data[0].name = "50-1000元";
            ringData1.data[0].value = userInfoData.investAmountPercentage.investAmount1K;
            ringData1.data[0].percent = ((Number(userInfoData.investAmountPercentage.investAmount1K)/ringData1.totalNum)*100).toFixed(2);


            ringData1.data[1].name = "1000-5000元";
            ringData1.data[1].value = userInfoData.investAmountPercentage.investAmount5K;
            ringData1.data[1].percent = ((Number(userInfoData.investAmountPercentage.investAmount5K)/ringData1.totalNum)*100).toFixed(2);


            ringData1.data[2].name = "5000-1万元";
            ringData1.data[2].value = userInfoData.investAmountPercentage.investAmount10K;
            ringData1.data[2].percent = ((Number(userInfoData.investAmountPercentage.investAmount10K)/ringData1.totalNum)*100).toFixed(2);


            ringData1.data[3].name = "1万-10万元";
            ringData1.data[3].value = userInfoData.investAmountPercentage.investAmount100K;
            ringData1.data[3].percent = ((Number(userInfoData.investAmountPercentage.investAmount100K)/ringData1.totalNum)*100).toFixed(2);

            ringData1.data[4].name = "≥10万元";
            ringData1.data[4].value = userInfoData.investAmountPercentage.investAmountMore;
            ringData1.data[4].percent = ((Number(userInfoData.investAmountPercentage.investAmountMore)/ringData1.totalNum)*100).toFixed(2);



            self.drowRing(ringData1);

            var ringData2 = {
                name : ["各投终端分布"],
                legendWidth : 100,
                legendSpacing : 20,
                width : window.winWidth*0.9,
                height : window.winWidth*0.5,
                conClassName : "platform-map-svg",
                showDetailNum : false,
                data : [
                    {color : "#ac96bf"},
                    {color : "#fd7573"},
                    {color : "#fcd77d"},
                    {color : "#81e3c9"}
                ]
            };
            ringData2.totalNum = 0;

            _.each(userInfoData.platformMap,function (v,k) {
                ringData2.totalNum += Number(v);
            });

            ringData2.data[0].name = "H5";
            ringData2.data[0].value = userInfoData.platformMap.H5;
            ringData2.data[0].percent = ((Number(userInfoData.platformMap.H5)/ringData2.totalNum)*100).toFixed(2);


            ringData2.data[1].name = "PC";
            ringData2.data[1].value = userInfoData.platformMap.PC;
            ringData2.data[1].percent = ((Number(userInfoData.platformMap.PC)/ringData2.totalNum)*100).toFixed(2);


            ringData2.data[2].name = "iOS";
            ringData2.data[2].value = userInfoData.platformMap.iOS;
            ringData2.data[2].percent = ((Number(userInfoData.platformMap.iOS)/ringData2.totalNum)*100).toFixed(2);


            ringData2.data[3].name = "Android";
            ringData2.data[3].value = userInfoData.platformMap.Android;
            ringData2.data[3].percent = ((Number(userInfoData.platformMap.Android)/ringData2.totalNum)*100).toFixed(2);


            self.drowRing(ringData2);

            var stackedData = {
                width : window.winWidth,
                height : 180,
                marginL : 30,
                marginR : 30,
                marginT : 40,
                marginB : 30,
                conClassName : "sex-age-proportion-svg",
                color : ["#ac96bf","#fd7573","#fcd77d","#81e3c9","#79c0f0"],
                legendName : ["18-24岁","25-29岁","30-39岁","40-49岁","50岁以上"],
                title : "各年龄段百分比分布",
                data : [
                    {
                        name:"投资人",
                        totalNum : 101,
                        value : [2,42,45,7,5],
                        manSex : 59.42,
                        womanSex : 40.58
                    },
                    {
                        name:"借款人",
                        totalNum : 369,
                        value : [0,111,219,39,0],
                        manSex : 59.42,
                        womanSex : 40.58
                    }
                ]
            }

            stackedData.data[0].name = "投资人";
            stackedData.data[1].name = "借款人";
            stackedData.data[0].totalNum = 0;
            stackedData.data[1].totalNum = 0;
            stackedData.data[0].value = [];
            stackedData.data[1].value = [];

            stackedData.data[0].manSex = userInfoData.sexAgeProportion.investor.manSex;
            stackedData.data[0].womanSex = userInfoData.sexAgeProportion.investor.womanSex;

            stackedData.data[1].manSex = userInfoData.sexAgeProportion.borrower.manSex;
            stackedData.data[1].womanSex = userInfoData.sexAgeProportion.borrower.womanSex;


            _.each(userInfoData.sexAgeProportion.investor,function (v,k) {
                if( ( k != "manSex" ) && ( k != "womanSex" ) ){
                    stackedData.data[0].value.push(v);
                    stackedData.data[0].totalNum += v;
                }
            });

            _.each(userInfoData.sexAgeProportion.borrower,function (v,k) {
                if( ( k != "manSex" ) && ( k != "womanSex" ) ){
                    stackedData.data[1].value.push(v);
                    stackedData.data[1].totalNum += v;
                }
            });




            self.drowStackedBar(stackedData);


            var barTimeData = [],nowYear = new Date().getFullYear();

            _.each(userInfoData.borrowerInvestorMonthList,function (v,k) {
                var dateArr = v.date.split("-"),keyName;

                if(dateArr[0] == nowYear){
                    keyName = dateArr[1];
                }else{
                    nowYear = dateArr[0];
                    keyName = dateArr[0].slice(2,4) + "/" + dateArr[1];
                }

                barTimeData.push({name:keyName,value:v.borrowerSum});

            });

            var barData = {
                width: window.winWidth,
                height : (window.winWidth*0.7).toFixed(0),
                conClassName : "borrow-time-svg",
                padding : { top: 0, right: 30, bottom: 20, left: 60 },
                tipWidth : 75,
                step : 50,
                unit : "人",
                data : barTimeData.slice(6,12)
            };


            self.drowBar(barData);

            // self.drowBarDouble(userInfoData.borrowerInvestorMonthList.slice(6,12));

            var mapData = userInfoData.investAreaLayout;

            self.drawChinaMap(mapData);

            self.renderChinaMapLegend(mapData.slice(0,5));
        },
        renderChinaMapLegend : function (renderData) {
            var self = this;

            var chinaMapLegendTmpl = [
                '<div class="china-map-title">投资地域百分比分布</div>',
                '<div class="clearfloat">',
                    '{@each data as list,index}',
                        '<div class="f-l china-map-legend-li clearfloat {@if index == 4} mb10{@/if}">',
                            '<span class="f-l china-map-legend-index index${index}">${index|getIconIndex}</span>',
                            '<span class="f-l china-map-legend-con">${list.name}<span class="c-999 fz13">${list.percentage}%</span></span>',
                        '</div>',
                    '{@/each}',
                '</div>'

            ].join('');

            juicer.register("getIconIndex",function (index) {
                return Number(index) + 1;
            });


            $(".china-map-legend").html(juicer(chinaMapLegendTmpl,{data:renderData}));

        },
        renderUserInfoHeader : function (renderData) {
            var self = this;

            var userInfoHeaderTmpl = [
                '<div class="clearfloat">',
                '{@each data as list,index}',
                    '<div class="f-l clearfloat rel-data-con-li">',
                        '<div class="rel-data-userInfo-icon icon${index|getIconIndex}"></div>',
                        '<div class="rel-data-con-li-info">',
                        '<div>${list.name}</div>',
                            '<div class="c-fc7573">${list.value}</div>',
                        '</div>',
                    '</div>',
                '{@/each}',
                '</div>'
            ].join('');

            juicer.register("getIconIndex",function (index) {
                return Number(index) + 1;
            });


            $(".rel-data-userInfo-header").html(juicer(userInfoHeaderTmpl,{data:renderData}));

        },
        renderTotalInvestAmount : function (renderData) {
            var tmpl = [
                '<div class="rel-data-table-header clearfloat">',
                '<div class="f-l rel-data-table-tb">累计投资金额前10名</div>',
                '<div class="f-l rel-data-table-tb">累计投资金额<span class="c-999"> ( 元 )</span></div>',
                '</div>',
                '{@each data as list,index}',
                '<div class="rel-data-table-tr clearfloat">',
                '<div class="f-l rel-data-table-tb t-l">',
                    '<span class="{@if index < 3}c-ffb64e{@/if} rel-data-table-tb-index">',
                        '{@if index < 3}<img class="rel-data-table-tb-index-icon" src="'+crownImage+'"/>{@/if}',
                        '<span>No.${index|getIconIndex}</span>' +
                    '</span>' +
                    '<span class="rel-data-table-tb-name">${list.userName|getUserName}</span>',
                '</div>',
                '<div class="f-l rel-data-table-tb">${list.totalInvestAmount}</div>',
                '</div>',
                '{@/each}'
            ].join('');
            juicer.register("getIconIndex",function (index) {
                return Number(index) + 1;
            });
            juicer.register("getUserName",function (name) {
                return name.slice(0,1) + "***";
            });

            $(".total-invest-amount").html(juicer(tmpl,{data:renderData}));


        },
        renderStillAmount : function (renderData) {
            var tmpl = [
                '<div class="rel-data-table-header clearfloat">',
                '<div class="f-l rel-data-table-tb">待还余额前10名</div>',
                '<div class="f-l rel-data-table-tb">占所有借款待还余额的比例</div>',
                '</div>',
                '{@each data as list,index}',
                '<div class="rel-data-table-tr clearfloat">',
                '<div class="f-l rel-data-table-tb"><span class="{@if index < 3}c-fc7573{@/if}">No.${index|getIconIndex}</span>&nbsp;${list.userName}</div>',
                '<div class="f-l rel-data-table-tb">${list.stillAmountPercent|getPercent}</div>',
                '</div>',
                '{@/each}'
            ].join('');
            juicer.register("getIconIndex",function (index) {
                return Number(index) + 1;
            });

            juicer.register("getPercent",function (per) {
                return (Number(per)*100) + "%";
            });


            $(".still-amount").html(juicer(tmpl,{data:renderData}));
        },
        renderRiskControl : function (riskControlData) {
            var self = this;

            $("#readyRepayPrincipal").text(riskControlData.readyRepayPrincipal);
            $("#riskMoney").text(riskControlData.riskMoney);
            $("#totalIsLateAmount").text(riskControlData.totalIsLateAmount);
            $("#totalIsLateCount").text(riskControlData.totalIsLateCount);


            //["金额逾期率", "项目逾期率", "近三个月项目逾期率"],

            if(riskControlData.amountIsLateRate > 0){
                var polygonBarData = [];
                // polygonBarData[0] = riskControlData.breachContractRate;
                polygonBarData[0] = riskControlData.amountIsLateRate;
                polygonBarData[1] = riskControlData.platformProjectOverdueRate;
                polygonBarData[2] = riskControlData.recent3MonthOverdueRate;
                $(".risk-control-svg").show();
                self.drowPolygonBar(polygonBarData);
            }




            self.drowLateralBar(riskControlData.housePawnTotalValuation,riskControlData.housePrincipalInterest);
            self.drowCircle(riskControlData.riskMoneyOnReadyRepayRate);

        },
        renderDashboard : function (renderData) {
            var self = this;

            var tmpl = [
                '{@each data as list,index}',
                    '<div class="rel-data-header-li f-l {@if index == 1 || index==3} w45{@/if}">',
                        '<div class="rel-data-header-li-top {@if index == 1 || index==3} mb12{@/if}">',
                            '<i class="rel-data-header-icon icon${index}"></i>',
                            '<span>${list.name}</span>',
                        '</div>',
                        '<div class="c-fc7573">${list.value}</div>',
                    '</div>',
                '{@/each}'
            ].join('');
            juicer.register("getIconIndex",function (index) {
                return Number(index) + 1;
            });

            juicer.register("getPercent",function (per) {
                return (Number(per)*100) + "%";
            });


            $(".rel-data-header-con").html(juicer(tmpl,{data:renderData}));
        },
        getDashboard : function () {
            var self = this;

            $.ajax({
                url : "/v2/realData/dashboard",
                type : "POST",
                data : {},
                success : function (res) {
                    if(res.code == 200){
                        var renderData = [];

                        renderData[0] = {
                            name : "累计成交金额",
                            value : res.data.cumulativeTurnover
                        }
                        renderData[1] = {
                            name : "加权平均年化",
                            value : res.data.weightedAvgAnnualised
                        }
                        renderData[2] = {
                            name : "累计赚取收益",
                            value : res.data.cumulativeEarnings
                        }
                        renderData[3] = {
                            name : "投资人复投率",
                            value : res.data.InvestorsReInvestRate
                        }


                        self.renderDashboard(renderData);

                    }
                },
                error : function (res) {

                }
            });
        },
        renderPlatformOutline : function (platformData) {
            var self = this;

            var barTimeData = [],nowYear = new Date().getFullYear();

            _.each(platformData.recentHalfYearIncome,function (v,k) {
                var dateArr = v.date.split("-"),keyName;

                if(dateArr[0] == nowYear){
                    keyName = dateArr[1];
                }else{
                    nowYear = dateArr[0];
                    keyName = dateArr[0].slice(2,4) + "/" + dateArr[1];
                }

                barTimeData.push({name:keyName,value:(Number(v.income)/10000).toFixed(2)});

            });

            var barData = {
                width: window.winWidth,
                height : (window.winWidth*0.7).toFixed(0),
                conClassName : "total-turnover-svg",
                padding : { top: 0, right: 30, bottom: 20, left: 60 },
                tipWidth : 120,
                step : 4000,
                unit : "万元",
                data : barTimeData.slice(6,12)
            };


            self.drowBar(barData);



            var ringData5 = {
                name : ["年化收益率","笔数分布"],
                legendWidth : 80,
                legendSpacing : 20,
                width : window.winWidth*0.9,
                height : window.winWidth*0.5,
                conClassName : "annualized-yield-svg",
                showDetailNum : true,
                unit : "笔",
                data : [
                    {
                        color : "#ac96bf",
                        name : "< 8%",
                    },
                    {
                        color : "#fd7573",
                        name : "8 - 9%",
                    },
                    {
                        color : "#fcd77d",
                        name : "9 - 10%",
                    },
                    {
                        color : "#81e3c9",
                        name : "10 - 11%",
                    },
                    {
                        color : "#79c0f0",
                        name : "> 11%"
                    }
                ]
            };

            ringData5.totalNum = 0;


            _.each(platformData.revenuePercentage,function (v,k) {
                ringData5.totalNum += Number(v);
            });

            ringData5.data[0].value = platformData.revenuePercentage.revenuePercentage8;
            ringData5.data[0].percent = ((Number(platformData.revenuePercentage.revenuePercentage8)/ringData5.totalNum)*100).toFixed(2);


            ringData5.data[1].value = platformData.revenuePercentage.revenuePercentage9;
            ringData5.data[1].percent = ((Number(platformData.revenuePercentage.revenuePercentage9)/ringData5.totalNum)*100).toFixed(2);


            ringData5.data[2].value = platformData.revenuePercentage.revenuePercentage10;
            ringData5.data[2].percent = ((Number(platformData.revenuePercentage.revenuePercentage10)/ringData5.totalNum)*100).toFixed(2);


            ringData5.data[3].value = platformData.revenuePercentage.revenuePercentage11;
            ringData5.data[3].percent = ((Number(platformData.revenuePercentage.revenuePercentage11)/ringData5.totalNum)*100).toFixed(2);


            ringData5.data[4].value = platformData.revenuePercentage.revenuePercentage12;
            ringData5.data[4].percent = ((Number(platformData.revenuePercentage.revenuePercentage12)/ringData5.totalNum)*100).toFixed(2);

            self.drowRing(ringData5);
            
            $("#HasEarnedAmount").text(platformData.hasEarnedAmount);
            $("#readyEarnAmount").text(platformData.readyEarnAmount);

        },
        getPlatformOutline : function () {
            var self = this;

            $.ajax({
                url : "/v2/realData/platformOutline",
                type : "POST",
                data : {},
                success : function (res) {
                    if(res.code == 200){
                        self.renderPlatformOutline(res.data);


                    }
                },
                error : function (res) {

                }
            });
        },
        getRiskControl : function () {
            var self = this;

            $.ajax({
                url : "/v2/realData/riskControl",
                type : "POST",
                data : {},
                success : function (res) {
                    if(res.code == 200){
                        self.renderRiskControl(res.data);

                    }
                },
                error : function (res) {

                }
            });
        },
        getUserInfo : function () {
            var self = this;

            $.ajax({
                url : "/v2/realData/userInfo",
                type : "POST",
                data : {},
                success : function (res) {
                    if(res.code == 200){
                        self.renderUserInfo(res.data);

                    }
                },
                error : function (res) {

                }
            });
        },
        getProjectOverview : function () {
            var self = this;

            $.ajax({
                url : "/v2/realData/projectOverview",
                type : "POST",
                data : {},
                success : function (res) {
                    if(res.code == 200){
                        self.renderProjectOverview(res.data);

                    }
                },
                error : function (res) {

                }
            });
        },
        getTotalInvestAmount : function () {
            var self = this;
            $.ajax({
                url : "/v2/statistics/real-data/user/invest/top",
                type : "POST",
                data : {},
                success : function (res) {
                    if(res.code == 200){
                        self.renderTotalInvestAmount(res.data);
                    }
                },
                error : function (res) {

                }
            });
        },
        getStillAmount : function () {
            var self = this;
            $.ajax({
                url : "/v2/statistics/real-data/user/repayment",
                type : "POST",
                data : {},
                success : function (res) {
                    if(res.code == 200){
                        self.renderStillAmount(res.data);
                    }
                },
                error : function (res) {

                }
            });
        }

    });
    new RealTimeData();





});
