/**
 * Created by lishuxia on 16/11/7.
 */
function f(input:boolean){
    let a = 100;

    if(input){
        let b = a + 1;
        return b;
    }

    return b;
}

try{
    throw 'oh no!';
}
catch (e){
    console.log('Oh')
}

console.log(e);


//重定义及屏蔽
//不是说块级作用域变量不能在函数作用域内声明,而是块级作用域变量需要在不用的块里声明
function f(condition,x){
    if(condition){
        let x = 100;
        return x;
    }

    return x;
}

f(false,0);
f(true,0);


function sunMatrix(matrix :number[][]){
    let sum = 0;
    for(let i = 0;i < matrix.length;i++){
        var currentRow = matrix[i];
        for(let i = 0;i < currentRow.length;i++){
            sum += currentRow[i];
        }
    }
    return sum;
}

//块级作用域变量的获取
function theCityThatAlwaysSleeps(){
    let getCity;

    if(true){
        let city = 'Seattle';
        getCity = function(){
            return city;
        }
    }

    return getCity();
}

//解构数组
let input = [1,2];
let [first,second] = input;
console.log(first);

//用...name 语法创造一个剩余变量列表
let [first,...reset] = [1,2,3,4,5];
console.log(first);   //1
console.log(reset);   //[2,3,4]

//对象解构
let o = {
    a: 'foo',
    b: 12,
    c: 'bar'
}

let {a,b} = o;
({a,b} = {a:'baz',b:101});

let {a,b}:{a:string,b:number} = o;

function keepWholeObject(wholeObject:{a:string,b?:number}){
    let{a,b = 101} = wholeObject;
}



