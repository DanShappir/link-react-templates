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
                    'sample/**/*.js',
                    '!src/linkrt.browser.js'
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
        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                specNameMatcher: 'spec',
                extensions: 'js'
            },
            all: ['server/test'],
            grunt: ['conf/tasks/test']
        },
        browserify: {
            options: {
            },
            dist: {
            },
            pg: {
                files: {
                    'src/linkrt.browser.js': ['src/linkrt.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-eslint');

    grunt.registerTask('default', ['eslint', 'build_sources', 'check', 'build']);
    grunt.registerTask('test', ['jasmine_node']);

    grunt.registerTask('teamcity-check', ['eslint:teamcity'/*, 'scsslint'*/]);
    grunt.registerTask('teamcity', ['build_sources', 'teamcity-check', 'packages:teamcity', 'static-upload-to-s3']);
    grunt.registerTask('teamcity-test', ['jasmine_node', 'karma:teamcity', 'cssTest']);

    grunt.registerTask('all', ['install', 'default', 'test']);
};
