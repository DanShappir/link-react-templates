(function () {
    'use strict';

    var reactTemplates = require('react-templates/src/reactTemplates');
    var React = require('react/addons');
    var _ = require('lodash');
    var jQuery = require('jquery-browserify');
    var $ = jQuery;

    if (document.currentScript && 'expose' in document.currentScript.dataset) {
        if (!window.React) {
            window.React = React;
        }
        if (!window._) {
            window._ = _;
        }
        if (!window.jQuery) {
            window.jQuery = jQuery;
            if (!window.$) {
                window.$ = $;
            }
        }
    }

    $(function () {
        var sync = (function () {
            var map = {};
            return function (name) {
                if (typeof name !== 'string') {
                    return name;
                }
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
                return $.Deferred().resolve(reactTemplates.convertTemplateToReact(html.trim().replace(/\r/g, '')));
            }

            function generateDefine(deferred, map) {
                return function (dep, impl) {
                    $.when.apply(null, _.map(_.map(dep, map), sync)).then(impl).done(deferred.resolve);
                };
            }

            function generateTemplateFunction(code) {
                return $.Deferred(function (deferred) {
                    /*eslint no-unused-vars:0*/
                    var define = generateDefine(deferred);
                    /*eslint no-eval:0*/
                    eval(code);
                });
            }

            function generateReactClass(spec, render) {
                return $.Deferred(function (deferred) {
                    /*eslint no-unused-vars:0*/
                    var define = generateDefine(deferred, function (dep) {
                        return dep.search(/\.rt$/) === -1 ? dep : $.Deferred().resolve(render);
                    });
                    /*eslint no-eval:0*/
                    var result = eval(spec);
                    if (result) {
                        if (result.render) {
                            console.warn('Rendering function already defined', name || '', rturl);
                        }
                        deferred.resolve(React.createClass(_.assign(result, {render: render})));
                    }
                });
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

            function render(cls) {
                if ($container) {
                    props = generateProps(props);
                    var reactComponent = React.render(React.createElement(cls, props), $container[0]);
                    $container.trigger('linkRtRender', [reactComponent, rturl, name]);
                }
                if (name) {
                    sync(name).resolve(React.createFactory(cls));
                }
            }

            try {
                generateTemplateSource(rt)
                    .then(generateTemplateFunction)
                    .then(generateReactClass.bind(this, script))
                    .then(render);
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
                $container = $('<span>')
                    .attr('id', $this.attr('id'))
                    .attr('style', $this.attr('style'))
                    .attr('class', $this.attr('class'))
                    .addClass('linkrt-container')
                    .replaceAll($this);
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
}());
