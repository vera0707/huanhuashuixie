/**
 * Created by lishuxia on 16/11/8.
 */
let myAdd:(x:number,y:number) => number =
    function(x:number,y:number):number{return x+y};


//剩余参数
function buildName(firstName:string,...restOfName:string[]){
    return firstName + " " + restOfName.join(" ");
}

let buildNameFun:(fname: string,...rest:string[]) =>string = buildName;

//this和箭头函数
let deck = {
    suits: ["heats","spades","clubs","diamonds"],
    cards: Array(52),
    createCardPicker: function(){
        return  () => {
            let pickedCard = Math.floor(Math.random()*52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit],card: pickedCard % 13};
        }
    }
};

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + "of" + pickedCard.suit);

