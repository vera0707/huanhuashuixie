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
        clean: {
            build :[
                './cdn'
            ]
        },
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
            }
        },
        copy : {
            //javascript: {
            //    files: [
            //        {
            //            expand: true,
            //            cwd: 'src/javascript',
            //            src: ['**'],
            //            dest: cdn+'javascript',
            //            filter: 'isFile'
            //        }
            //    ]
            //},
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
            jsp: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['*.jsp'],
                        dest: 'cdn',
                        filter: 'isFile'
                }]
            }
            //meta: {
            //    files: [
            //        // includes files within path
            //        {
            //            expand: true,
            //            cwd: 'src/META-INF/',
            //            src: ['**'],
            //            dest: cdn+'META-INF',
            //            filter: 'isFile'
            //        }
            //    ]
            //},
            //srcfile: {
            //    files: [
            //        // includes files within path
            //        {
            //            expand: true,
            //            cwd: 'src/',
            //            src: ['*.html','*.jsp','*.txt', '*.png','*.png'],
            //            dest: cdn,
            //            filter: 'isFile'
            //        }
            //    ]
            //}
        },
        cssmin: {
            options:{
                //美化代码
                beautify: {
                    ascii_only: true
                }
            },
            target:{
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['*.css', '**/*.css'],
                    dest: 'cdn/css',
                    ext: '.css'
                }]
            },
            single: {
                files: {
                    'cdn/css/main-min.css':
                        ['src/css/demo2.css', 'src/css/demo1/demo1.css']
                }
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            html: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['*.html'],
                    dest: './cdn'
                }]
            }
        },
        imagemin:{
            dynamic: {
                options: {
                    optimizationLevel: 3 //定义 PNG 图片优化水平
                },
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'src/images/',                   // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'cdn/images/'            // Destination p
                }]
            }
        },
        filerev:{
            options: {
                algorithm: 'md5',
                length: 8,
                //这里处理文件名字生成规则
                process: function(basename, name, extension) {
                    if(
                        basename == "qrcode_for_gh_73c0ad6a5e4c_258"
                    ) {
                        return basename+"."+extension;
                    }
                    grunt.log.write(basename+'\n');
                    grunt.log.write(name+'\n');
                    grunt.log.write(extension +'\n');
                    grunt.log.write('\n');
                    return basename+'.'+name + '.' + extension;
                }
            },
            assets: {
                files: [{
                    src: [
                        'cdn/images/**/*.{jpg,jpeg,gif,png}',
                        'cdn/css/**/*.css',
                        'cdn/javascript/**/*.js',
                        'cdn/*.html'
                    ]
                }]
            }
        },
        usemin: {
            options: {
                //上级目录可以 使用app/cdn/scripts 失败
                assetsDirs: ['/cdn'],
                patterns: {
                    jsp: [
                        [
                            /<script.+src=['"]([^"']+)["']/gm,
                            'Update the HTML to reference our concat/min/revved script files'
                        ],
                        [
                            /<link[^\>]+href=['"]([^"']+)["']/gm,
                            'Update the HTML with the new css filenames'
                        ],
                        [
                            /<img[^\>]*[^\>\S]+src=['"]([^'"\)#]+)(#.+)?["']/gm,
                            'Update the HTML with the new img filenames'
                        ],
                        //匹配src之前不带空格的不规范写法
                        [
                            /<img[^\>]*[^\>\s]+src=['"]([^'"\)#]+)(#.+)?["']/gm,
                            'Update the HTML with the new img filenames'
                        ],
                        [
                            /<video[^\>]+src=['"]([^"']+)["']/gm,
                            'Update the HTML with the new video filenames'
                        ],
                        [
                            /<video[^\>]+poster=['"]([^"']+)["']/gm,
                            'Update the HTML with the new poster filenames'
                        ],
                        [
                            /<source[^\>]+src=['"]([^"']+)["']/gm,
                            'Update the HTML with the new source filenames'
                        ],
                        [
                            /data-main\s*=['"]([^"']+)['"]/gm,
                            'Update the HTML with data-main tags',
                            function (m) {
                                return m.match(/\.js$/) ? m : m + '.js';
                            },
                            function (m) {
                                return m.replace('.js', '');
                            }
                        ],
                        [
                            /data-(?!main).[^=]+=['"]([^'"]+)['"]/gm,
                            'Update the HTML with data-* tags'
                        ],
                        [
                            /url\(\s*['"]?([^"'\)]+)["']?\s*\)/gm,
                            'Update the HTML with background imgs, case there is some inline style'
                        ],
                        [
                            /<a[^\>]+href=['"]([^"']+)["']/gm,
                            'Update the HTML with anchors images'
                        ],
                        [
                            /<input[^\>]+src=['"]([^"']+)["']/gm,
                            'Update the HTML with reference in input'
                        ],
                        [
                            /<meta[^\>]+content=['"]([^"']+)["']/gm,
                            'Update the HTML with the new img filenames in meta tags'
                        ],
                        [
                            /<object[^\>]+data=['"]([^"']+)["']/gm,
                            'Update the HTML with the new object filenames'
                        ],
                        [
                            /<image[^\>]*[^\>\S]+xlink:href=['"]([^"'#]+)(#.+)?["']/gm,
                            'Update the HTML with the new image filenames for svg xlink:href links'
                        ],
                        [
                            /<image[^\>]*[^\>\S]+src=['"]([^'"\)#]+)(#.+)?["']/gm,
                            'Update the HTML with the new image filenames for src links'
                        ],
                        [
                            /<(?:img|source)[^\>]*[^\>\S]+srcset=['"]([^"'\s]+)\s*?(?:\s\d*?[w])?(?:\s\d*?[x])?\s*?["']/gm,
                            'Update the HTML with the new image filenames for srcset links'
                        ],
                        [
                            /<(?:use|image)[^\>]*[^\>\S]+xlink:href=['"]([^'"\)#]+)(#.+)?["']/gm,
                            'Update the HTML within the <use> tag when referencing an external url with svg sprites as in svg4everybody'
                        ]
                    ],
                    html: [
                        [/seajs\.use\(['"]([^"']+)["']\)/gm,'replace html seajs use',
                            function (m) {
                                return m.match(/\.js$/) ? m : m + '.js';
                            },
                            function (m) {
                                return m.replace('.js', '');
                            }
                        ]
                    ],
                    js: [
                        [/define\(['"]([^"']+)['"]/gm,'replace js define use',
                            function (m) {
                                return m.match(/\.js$/) ? m : m + '.js';
                            },
                            function (m) {
                                return m.replace('.js', '');
                            }
                        ],
                        [/async\(['"]([^"']+)['"]/gm,'replace js define use',
                            function (m) {
                                return m.match(/\.js$/) ? m : m + '.js';
                            },
                            function (m) {
                                return m.replace('.js', '');
                            }
                        ],
                        [
                            /<img[^\>]*[^\>\S]+src=['"]([^'"\)#]+)(#.+)?["']/gm,
                            'Update the HTML with the new img filenames'
                        ],
                    ]
                }
            },
            html: 'cdn/*.html',
            css: 'cdn/css/**/*.css',
            js: 'cdn/javascript/**/*.js',
            jsp: 'cdn/*.jsp'
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

    //css压缩
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-filerev');



    // 默认被执行的任务列表。
    //grunt.registerTask('default', ['copy:javascript','copy:images','copy:css','copy:meta','copy:srcfile']);
    grunt.registerTask('default', ['clean','uglify','cssmin','imagemin','htmlmin','copy','filerev']);

};