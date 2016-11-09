/**
 * Created by lishuxia on 16/11/3.
 */
let isDone: boolean = false;
let dea: number = 6;
let name: string = 'bob';

let name: string = 'gene';
let age: number = 37;
let sentence: string = 'Hello,my name is ${name},i will  be ${age + 1} years old next month';

//数组
let list: number[] = [1,2,3];
let list: Array<number> = [1,2,3];

//元组 Tuple
let x: [string,number];
x = ['Hello',10];   //正确
x = [10,'Hello'];   //错误
//联合类型
x[3] = 'word';
console.log(x[5].toString());  //正确 string 和 number都有toString 方法
x[6] = true;          //错误 布尔不是(string | number)类型

//枚举
//enum类型可以为一组数值赋予友好的名字
//默认情况下,从0开始编号
enum Color {red,green,blue};
let c: Color = Color.green;

enum Color: {red = 1,green,blue};
let c:Color = Color.green;
let colorName:string = Color[2];

//任意值
let notSure:any = 4;
notSure = 'maybe a string instead';
notSure = false;   //正确
//any与Object Object类型的变量只是允许给它赋任意值,但是不能够在它上面调用任意的方法
let notSure: any = 4;
notSure.ifItExists();  //正确
notSure.toFixed();  //正确

let prettrtSure: Object = 4;
prettrtSure.toFixed();  //错误


//空值
function warnUser():void{  //这里的空指的是函数的参数个数为0
    alert('空')
}
//声明一个void类型的变量没什么大用,因为只能为它赋予undefined和null
let unable: void = undefined;

//null 和 undefined
//分别有自己的类型
let u: undefined = undefined;
let n: null = null;


//Never
//返回never的函数必须存在无法到达的终点
function error(message:string):never{
    throw new Error(message);
}


//类型断言
let someValue:any = 'this is a string';
let strLength: number = (<string>someValue).length;
let strLength: number = (someValue as string).length;