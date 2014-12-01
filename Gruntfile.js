'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        clean: {
            main: {
                src: ['src/linkrt.browser.js']
            }
        },
        eslint: {
            all: {
                src: [
                    'src/**/*.js', 
                    '!sample/**/*.js',
                    '!dist/linkrt.browser.js'
                ]
            },
            teamcity: {
                options: {
                    format: 'checkstyle',
                    'output-file': 'target/eslint.xml'
                },
                src: ['<%= eslint.all.src %>']
            }
        },
        browserify: {
            options: {
            },
            dist: {
            },
            pg: {
                files: {
                    'dist/linkrt.browser.js': ['src/linkrt.js']
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            target: {
                files: {
                    'dist/linkrt.min.js': ['dist/linkrt.browser.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['eslint', 'browserify', 'uglify:target']);

    grunt.registerTask('teamcity-check', ['eslint:teamcity']);
    grunt.registerTask('teamcity', ['build_sources', 'teamcity-check']);

    grunt.registerTask('all', ['install', 'default']);
};
