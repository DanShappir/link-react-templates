var reactTemplates = require('react-templates');
var React = require('react/addons');
var _ = require('lodash');
var $ = require('jquery-browserify');

$(function () {
    'use strict';

    var sync = (function () {
        var map = {};
        return function (name) {
            if (!map.hasOwnProperty(name)) {
                map[name] = $.Deferred();
            }
            return map[name];
        };
    }());
    sync('react').resolve(React);
    sync('lodash').resolve(_);
    sync('jquery').resolve($);

    function process(rt, script, $container, name, props, rturl) {
        function generateTemplateSource(html) {
            return reactTemplates.convertTemplateToReact(html.trim().replace(/\r/g, ''));
        }

        function generateTemplateFunction(code) {
            return $.Deferred(function (deferred) {
                /*eslint no-unused-vars:0*/
                function define(dep, impl) {
                    $.when.apply(null, _.map(dep, sync)).then(impl).done(deferred.resolve);
                }
                /*eslint no-eval:0*/
                eval(code);
            });
        }

        function generateReactClass(spec, render) {
            /*eslint no-eval:0*/
            spec = eval(spec);
            if (spec.render) {
                console.warn('Rendering function already defined', name || '', rturl);
            }
            spec.render = render;
            return React.createClass(spec);
        }

        function generateProps(props) {
            if (props) {
                props = props.trim();
                if (props) {
                    /*eslint no-eval:0*/
                    props = eval(props[0] === '{' ? ('(' + props + ')') : ('({' + props + '})'));
                }
            }
            return props;
        }

        try {
            var source = generateTemplateSource(rt);
            generateTemplateFunction(source).done(function (func) {
                var cls = generateReactClass(script, func);
                if ($container) {
                    props = generateProps(props);
                    var reactComponent = React.render(React.createElement(cls, props), $container[0]);
                    $container.trigger('linkRtRender', [reactComponent]);
                }
                if (name) {
                    sync(name).resolve(React.createFactory(cls));
                }
            });
        } catch (e) {
            console.error('Failed processing React Template', name || '', rturl);
        }
    }

    $('link[type="text/rt"]').each(function () {
        var $this = $(this);
        var props = $this.attr('props');
        var name = $this.attr('name');
        var $container;
        if (name) {
            $this.remove();
        } else {
            $container = $('<span class="linkrt-container"></span>').replaceAll($this);
        }

        var rturl = $this.attr('href');
        if (rturl.search(/\.rt$/) === -1) {
            rturl += '.rt';
        }
        var jsurl = rturl.replace(/rt$/, 'js');

        $.when(
            $.ajax({
                url: rturl,
                dataType: 'html'
            }),
            $.ajax({
                url: jsurl,
                dataType: 'text'
            }).then(null, function () {
                return $.Deferred().resolve(['new Object']);
            })
        ).done(function (rt, script) {
            process(rt[0], script[0], $container, name, props, rturl);
        });
    });
});
