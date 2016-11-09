/**
 * Created by lishuxia on 16/11/7.
 */
//在这里,接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约

interface LabelledValue{
    label:string;
}

function printLable(labelledObj:LabelledValue){
    console.log(labelledObj.label);
}

let myObj = {size:10,label:'Size 10 object'};
printLable(myObj);

//接口中的属性不一定完全需要

interface SquareConfig(){
    color?:string;    //这里的问号是可选的意思
    width?:number;    //这里的问号是可选的意思
}

function createSquare(config:SquareConfig):{color:string;area:number}{
    let newSquare = {color:'white',area:100};
    if(config.color){
        newSquare.color = config.color;
    }
    if(config.width){
        newSquare.width = config.width;
    }
    return newSquare;
}

let mySquare = createSquare({color:'black'});



//只读属性
//只能在对象刚刚创建的时候修改其值
interface Point{
    readonly x : number;
    readonly y : number;
}
let p1:Point = {x:10,y:20};
p1.x = 5;   //错误 不能再修改p1的值


//ReadonlyArray<T> 可以确保数组创建后再也不能被修改
let a: number[] = [1,2,3,4];
let ro: ReadonlyArray<number> = a;

ro[0] = 12;  //错误
ro.push(5); //错误

a = ro as number[];


//变量用const 若作为属性用readonly


//接口 明确的强制一个类去符合某种契约
interface ClockInterface{
    currentTime: Date;
}

class Clock implements ClockInterface{
    currentTime :Date;
    constructor(h:number,m:number){};
}

//在接口中描述一个方法,在类中实现它
interface ClockInterface{
    currentTime: Date;
    setTime(d:Date);
}

class Clock implements ClockInterface{
    currentTime : Date;
    setTime(d:Date){
        this.currentTime = d;
    }
    constructor(h:number,m:number){}
}

//类静态部分和实例部分的区别
interface ClockConstructor{
    new (hour:number,minute:number):ClockInterface
}
interface ClockInterface{
    tick();
}
function createClock(ctor:ClockConstructor,hour:number,minute:number):ClockInterface{
    return new ctor(hour,minute)
}
class DigitalClock implements ClockInterface{
    constructor(h:number,m:number){}
    tick(){
        console.log('beep beep');
    }
}
class AnalogClock implements ClockInterface{
    constructor(h:number,m:number){}
    tick(){
        console.log('tick tock');
    }
}

let digital = createClock(DigitalClock,12,17);
let analog = createClock(AnalogClock,7,32);


//扩展接口
interface Shape{
    color:string
}
interface Square extends Shape{
    sideLength:number;
}

let square = <Square>{};
square.color = 'blue';
square.sideLength = 10;

//一个接口可以继承多个接口,创造出多个接口的合成接口
interface Shape{
    color: string;
}
interface PenStroke{
    penWidth: number;
}
interface Square extends Shape,PenStroke{
    sideLength : number;
}

let square = <Square>{};
square.color = 'blue';
square.sideLength = 10;
square.penWidth = 5.0;
