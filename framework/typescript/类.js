/**
 * Created by lishuxia on 16/11/7.
 */
class Greeter{
    greeting: string;
    constructor(message:string){
        this.greeting = message;
    }
    greet(){
        return 'Hello, '+ this.greeting;
    }
}

let greeter = new Greeter('world');

//继承
class Animal{
    name:string;
    constructor(theName:string){this.name = theName}
    move(distanceInMeters:number = 0){
        console.log('${this.name} moved ${distanceInMeters}m.');
    }
}

class Snake extends Animal{
    constructor(name: string){super(name);}
    move(distanceInMeters = 5){
        console.log('Slithering...');
        super.move(distanceInMeters)
    }
}

class Horse extends Animal {
    constructor(name:string) {
        super(name);
    }
    move(distanceInMeters = 45) {
        console.log('Galloping...');
        super.move(distanceInMeters);
    }
}
let sam = new Snake('Sammy the Python');
let tom:Animal = new Horse('Tommy the Palomino');

sam.move();
sam.move(34);
//我们使用extends关键字来创造子类.包含构造函数的派生类必须调用super(),他会执行基类的构造方法

class Animal{
    public name:string;
    public constructor(theName:string){this.name = theName;}
    public move(distanceInMeters:number){
        console.log()
    }
}

//当成员被标记成privite时,它就不能在声明它的类的外部访问
class Animal{
    privite name:string;
    constructor(theName:string){this.name = theName;}
}

new Animal('Cat').name;

//protected与privite行为很相似,但是有一点不同,protected成员在派生类中仍然可以访问

class Person{
    protected name:string;
    constructor(name:string){this.name = name}
}


class  Employee extends Person{
    private deparment:string;

    constructor(name:string){this.name = name};
}
class Employee extends Person{
    private department:string;
    constructor(name:string,department:string){
        super(name)
        this.department = department;
    }

    public getElevatorPitch(){
        return 'Hello,my name is ${this.name} and I work in ${this.department}';
    }
}

let howard = new Employee('Howard','Sales');
console.log(howard.getElevatorPitch());
console.log(howard.name);

//我们不能在Person类外使用name 但是我们仍然可以通过Employee类的实例方法访问.因为Employee是由Person派生而来的
class Person {
    protected name: string;
    protected constructor(theName: string){this.name = theName}
}
class Employee extends Person{
    private department: string;

    constructor(name: string,department: string){
        super(name);
        this.deparment = department;
    }

    public getElevatorPitch(){
        return 'Hello,my name is ${this.name} and i work in ${this.department}';
    }
}

let howard = new Employee('Howard','Sales');
let join = new Person('John');   //报错  不可以实例化受保护的类

//readonly修饰符
//可以使用radyonly关键字将属性设置为只读的.只读属性必须在声明时或构造函数里被初始化
class Octopus{
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string){
        this.name = theName;
    }
}
let add = new Octopus("Man width the 8 strong legs");
add.name = 'Man wudth the 3-piece suit';

//参数属性
class Animal {
    constructor(private name: string){ }
    move(distanceInMeters: number){
        console.log('${this.name} moved ${distanceInMeters}m.');
    }
}

//静态属性
class Grid {
    static origin = {x: 0,y: 0};
    calculateDistanceFromOrigin(point: {x: number;y: number;}){
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist)/this.scale;
    }

    constructror (public scale: number){ }
}

let grid1 = new Grid(1.0);
console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));

//抽象类
//抽象类和接口方法相似,都是定义方法签名但不包含方法体 然而,抽象方法必须包含abstract关键字并且可以包含访问修饰符
abstract class Department{
    constructor(public name: string){
    }

    printName():void{
    console.log('Department name': + this.name);
    }

    abstract printMetting():void;   //必须在派生类中实现
}
