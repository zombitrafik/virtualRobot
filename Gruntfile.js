"use strict";


// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-processhtml');

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the application
    var appConfig = {
        app: '',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        virtualRobot: appConfig,

        // Grunt Tasks
        concat: {
            options: {
                separator: '\r\n'
            },

            basic_and_extras: {
                files: {
                    '<%= virtualRobot.dist %>/scripts/main.js': [
                        'core/**/*.js',
                        'app.js'
                    ]
                }
            },

            css: {
                src: [
                    'style.css'
                ],
                dest: '<%= virtualRobot.dist %>/style.css'
            }
        },

        processhtml: {
            dist: {
                options: {
                    process: true
                },
                files: {
                    '<%= virtualRobot.dist %>/index.html': ['index.html']
                }
            }
        },

        uglify: {
            options: {
                mangle: false
            },

            js: {
                files: {
                    '<%= virtualRobot.dist %>/scripts/app.min.js': '<%= virtualRobot.dist %>/scripts/main.js'
                }
            }
        },

        cssmin: {
            css: {
                src: '<%= virtualRobot.dist %>/style.css',
                dest: '<%= virtualRobot.dist %>/style.min.css'
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= virtualRobot.dist %>/{,*/}*',
                        '!<%= virtualRobot.dist %>/.git{,*/}*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= virtualRobot.dist %>/scripts/{,*/}*.js',
                    '<%= virtualRobot.dist %>/{,*/}*.css',
                    '<%= virtualRobot.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= virtualRobot.app %>/index.html',
            options: {
                dest: '<%= virtualRobot.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= virtualRobot.dist %>/{,*/}*.html'],
            css: ['<%= virtualRobot.dist %>/{,*/}*.css'],
            options: {
                assetsDirs: [
                    '<%= virtualRobot.dist %>',
                    '<%= virtualRobot.dist %>/images'
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= virtualRobot.dist %>',
                    src: ['*.html'],
                    dest: '<%= virtualRobot.dist %>'
                }]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '',
                    dest: 'dist',
                    src: [
                        'index.html',
                        'images/**/*'
                    ]
                }]
            }
        }

    });


    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concat',
        'copy:dist',
        'cssmin',
        'uglify',
        'processhtml',
        'usemin',
        'htmlmin'
    ]);

};
