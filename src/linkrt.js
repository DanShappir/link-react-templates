(function () {
    'use strict';

    var reactTemplates = require('react-templates/src/reactTemplates');
    var React = require('react/addons');
    var _ = require('lodash');
    var jQuery = require('jquery-browserify');
    var $ = jQuery;

    var base;
    var scriptBase;
    if (document.currentScript && document.currentScript.dataset) {
        (function (dataset) {
            base = dataset.base;
            scriptBase = dataset.scriptBase || base;
            if ('expose' in dataset) {
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
        }(document.currentScript.dataset));
    }

    function joinURL(base, relative) {
        return base ? base + '/' + relative : relative;
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
        sync('react/addons').resolve(React);
        sync('lodash').resolve(_);
        sync('jquery').resolve($);

        $('link[type="text/rt"]').each(function () {
            function generateTemplateSource(html) {
                var deferred = $.Deferred();
                try {
                    return deferred.resolve(reactTemplates.convertTemplateToReact(html.trim().replace(/\r/g, '')));
                } catch(e) {
                    return deferred.reject('(' + rturl + ') Compile error: ' + e.message);
                }
            }

            function generateDefine(deferred, map) {
                return function (dep, impl) {
                    $.when.apply(null, _.map(_.map(dep, map), sync)).then(impl).done(deferred.resolve);
                };
            }

            function generateTemplateFunction(code) {
                return $.Deferred(function (deferred) {
                    try {
                        /*eslint no-unused-vars:0*/
                        var define = generateDefine(deferred);
                        /*eslint no-eval:0*/
                        eval(code);
                    } catch(e) {
                        deferred.reject('(' + rturl + ') Parse error: ' + e.message);
                    }
                });
            }

            function generateReactClass(render, spec) {
                return $.Deferred(function (deferred) {
                    try {
                        /*eslint no-unused-vars:0*/
                        var define = generateDefine(deferred, function (dep) {
                            return dep.search(/\.rt$/) === -1 ? dep : $.Deferred().resolve(render);
                        });
                        /*eslint no-eval:0*/
                        var result = eval(spec[0]);
                        if (result) {
                            if (result.render) {
                                console.warn('Rendering function already defined', name || '', rturl);
                            }
                            deferred.resolve(React.createClass(_.assign(result, {render: render})));
                        }
                    } catch(e) {
                        deferred.reject('(' + jsurl + ') JavaScript error: ' + e.message);
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

            var rturl = ($this.attr('href') || '').replace(/(\.rt)?$/, '.rt');
            var jsurl = ($this.attr('data-script-href') || rturl.replace(/\.rt$/, '')).replace(/(\.js)?$/, '.js');
            rturl = joinURL(base, rturl);
            jsurl = joinURL(scriptBase, jsurl);

            $.when(
                $.ajax({
                    url: rturl,
                    dataType: 'html'
                }).then(generateTemplateSource).then(generateTemplateFunction),
                $.ajax({
                    url: jsurl,
                    dataType: 'text'
                }).then(null, function () {
                    return $.Deferred().resolve(['new Object']);
                })
            ).then(generateReactClass).then(render, console.error.bind(console));
        });
    });
}());
