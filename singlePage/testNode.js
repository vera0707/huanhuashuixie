/*******************************************************************************
 * Copyright (c) 2005-2016 Gozap, Inc.
 * description:
 * Contributors:
 * sundongzhi  on 16/7/21
 *******************************************************************************/

var path = require("path");


var fs = require('fs'),
    fileList = {};

//遍历路径罗列出所有文件key-value
function walk(path){
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isDirectory()){
            if(item == "core") {
                return false;
            };
            walk(path + '/' + item);
        }else{
            fileList[item.split('.')[0]] = path + '/' + item;
        }
    });
}

walk(path.resolve('web/public/src/scripts'));

console.log('----------------------------------------------------------------------------------')


console.log(fileList);

let jsArr = Object.keys(fileList);

console.log(jsArr);
console.log('----------------------------------------------------------------------------------')


var glob = require("glob");
let srcDir = path.join(process.cwd(), "web","public",'src');

let jsDir = path.resolve(srcDir, 'scripts/core')
let entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
let map = {}

entryFiles.forEach((filePath) => {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    map[filename] = filePath
})
// console.log(map);


function walkHtml(path){
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isDirectory()){
            walkHtml(path + '/' + item);
        }else{
            let filePath = path + '/' + item;

            htmlPrefix = path.split("views/html")[1];
            
            let conf = {
                template: 'html!' + filePath,
                filename: 'views/html' + htmlPrefix + '/'+item
            }

            if(filePath in fileList) {
                conf.inject = 'body'
                conf.chunks = ['vendor', item]
            }
            console.log(conf);
        }
    });
}

// walkHtml(path.resolve('public/src/views/html'));

console.log('----------------------------------------------------------------------------------');


let entryHtml = glob.sync(path.join(srcDir,'views','html') + '/*.html')

entryHtml.forEach((filePath) => {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    let conf = {
        template: 'html!' + filePath,
        filename: 'views/'+filename + '.html'
    }

    if(filename in fileList) {
        conf.inject = 'body'
        conf.chunks = ['vendor', filename]
    }
    
    // console.log(conf);

})