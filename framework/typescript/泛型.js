/**
 * Created by lishuxia on 16/11/8.
 */
//可以使用泛型来创建可重用组件.一个组件可以支持多种类型的数据

function identity<T>(arg:T):T{
    return arg;
}

let output = identity<string>('myString');