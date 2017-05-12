/**
 * Created by lishuxia on 17/5/10.
 */
module.exports = function(grunt){
    /*
     grunt-contrib-clean：删除文件。
     grunt-contrib-compass：使用compass编译sass文件。
     grunt-contrib-concat：合并文件。
     grunt-contrib-copy：复制文件。
     grunt-contrib-cssmin：压缩以及合并CSS文件。
     grunt-contrib-imagemin：图像压缩模块。
     grunt-contrib-jshint：检查JavaScript语法。
     grunt-contrib-uglify：压缩以及合并JavaScript文件。
     grunt-contrib-watch：监视文件变动，做出相应动作。
     */

    var source = './src/',    //源文件
        build = './build/',  //目标文件
        minify = './',   //临时文件
        cdn = './cdn/';

    // Project configuration.
    grunt.initConfig({
        concat : {
            main : {
                options : {
                    //separator: ';'
                    relative : true,
                    noncmd: true
                },
                files :{
                    './cdn/javascript/main.js' : [
                        source + 'javascript/vendor/core1.js',
                        source + 'javascript/vendor/core2.js'
                    ]
                }
                //dist: {
                //    expand: true,
                //    cwd: ['./src/javascript/vendor/'],
                //    src: ['*.js','**/**.js'],
                //    dest: './cdn/javascript/main.js'
                //}
            }
        },
        uglify : {
            options:{
                mangle: false,
                ASCIIOnly: true
            },
            minify : {
                expand: true,
                cwd: source + 'javascript/vendor',
                src: ["*.js", "**/*.js"],
                dest: cdn + 'javascript'
            },
            main : {
                expand: true,
                cwd: './src',
                src: ["*.html"],
                dest:'cdn'
            }
        },
        copy : {
            javascript: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/javascript',
                        src: ['**'],
                        dest: cdn+'javascript',
                        filter: 'isFile'
                    }
                ]
            },
            images: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/images/',
                        src: ['**'],
                        dest: cdn+'images',
                        filter: 'isFile'
                    }
                ]
            },
            css: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/css/',
                        src: ['**'],
                        dest: cdn+'css',
                        filter: 'isFile'
                    }
                ]
            },
            meta: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: 'src/META-INF/',
                        src: ['**'],
                        dest: cdn+'META-INF',
                        filter: 'isFile'
                    }
                ]
            },
            srcfile: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['*.html','*.jsp','*.txt', '*.png','*.png'],
                        dest: cdn,
                        filter: 'isFile'
                    }
                ]
            }
        }
    });

    // 合并文件
    grunt.loadNpmTasks('grunt-contrib-concat');
    // 语法检查
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    // 压缩文件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //文件复制
    grunt.loadNpmTasks('grunt-contrib-copy');



    // 默认被执行的任务列表。
    //grunt.registerTask('default', ['copy:javascript','copy:images','copy:css','copy:meta','copy:srcfile']);
    grunt.registerTask('default', ['uglify']);

};