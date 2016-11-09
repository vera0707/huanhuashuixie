/**
 * Created by lishuxia on 16/11/8.
 */
function generateText(){
    var element = document.createElement('h2');
    element.innerHTML = 'Hello World!';
    return element;
}

module.exports = generateText;