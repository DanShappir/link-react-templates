'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
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
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-eslint');

    grunt.registerTask('default', ['eslint', 'browserify']);

    grunt.registerTask('teamcity-check', ['eslint:teamcity']);
    grunt.registerTask('teamcity', ['build_sources', 'teamcity-check']);

    grunt.registerTask('all', ['install', 'default']);
};
