const path = require("path");

module.exports = {

    entry: {
        index: './src/index.js'
    },

    output: {
       path: path.resolve(__dirname,'dist'),
        filename: 'bundle.js'
    },

    module:{

    },

   plugins: [

   ],

   devServer: {

   },

    mode: "production"
};