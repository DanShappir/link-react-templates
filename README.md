# Link React Templates

[React Templates](https://github.com/wix/react-templates) provide a powerful mechanism for constructing [React](http://facebook.github.io/react/index.html) Components using HTML syntax. **Link React Templates** (linkrt) extends this mechanism by providing an easy to use environment for rapid design, prototyping, and development of React Templates. In certian scenarios it can also be used for production deployments. [See the recommended steps for using linkrt for designing and implementing React components](#recommended-process-for-bulding-components).

## How does it work
linkrt allows you to easily embed React Templates directly into the HTML, without requiring explicit pre-compilation, or any special mechanism on the server-side. Simply place &lt;link&gt; tags in the HTML which refer to the .rt files - linkrt will download the .rt files, compile them in-memory on the fly, and replace the original &lt;link&gt; tags with the result. For example, given the file sample.rt:

```html
<!doctype rt>
<div>Hello world</div>
```
and an HTML file at the same location:

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Link React Templates Sample</title>
    <script src="dist/linkrt.min.js"></script>
</head>
<body>
    <link href="sample/sample.rt" type="text/rt">
</body>
</html>
```
will result in the text "Hello world" being displayed inside the browser window. You can put any number of &lt;link&gt; tags referencing React Template in the HTML file.

linkrt also supports the inclusion of JavaScript files for implementing React Component state logic and manipulation. Simply create a JavaScript file with the same name as the .rt file, and place it at the same location. linkrt will automatically download both the .rt and JavaScript files, and utilize them both for constructing the component - [see below for details](#javascript-for-state).

## Installation
Simply use [Bower](http://bower.io/):

1. Install Bower: *npm install -g bower*
2. Configure Bower to use the [Wix Bower Registry](http://kb.wixpress.com/display/dashboard/Creating+a+bower+component)
2. Install the package: *bower install link-react-templates*

linkrt will now be installed in *bower_components/link-react-templates*.

## Usage
To use linkrt in your HTML file, you need to include the tag such as &lt;script src="bower_components/link-react-templates/dist/linkrt.min.js"&gt; - it can be place anywhere inside the HTML. **linkrt is self contained, and is not dependent on any JavaScript library**. The linkrt script will begin downloading and processing the component files (.rt and .js) after the browser's **Document Ready** event. As soon as each component is download, it will be immediatly processed and the result will be injected into the DOM, replacing the referring &lt;link&gt; tag.

**Note:** &lt;link&gt; tags referrencing React Templates must have the *type="text/rt"* attribute, otherwise they will be igonred by linkrt. The .rt extension in the &lt;link&gt; *href* attribute is optional.

If an error occurs during download or processing of React Templates, an error message will be written to the browser's Dev Tools Console.

## Passing properties
React utilizes the *props* setting to pass initialization data to components. linkrt supports this mechanism through the use of a *props* attribute on the &lt;link&gt; element. For example, given the .rt file:

```html
<!doctype rt>
<div>Hello {this.props.name}</div>
```
and the HTML:

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Link React Templates Sample</title>
    <script src="dist/linkrt.min.js"></script>
</head>
<body>
    <link href="sample/sample.rt" type="text/rt" props="name:'Jim'">
</body>
</html>
```
the text "Hello Jim" will be displayed in the browser window.

The values of the *props* attribute is a comma-delimited list of name/values pairs, which are separated by colons. String values should be enclosed in single quotes. The entire value of *props* can be optionally enclosed in { }, to give it a JSON-like appearance.

## JavaScript for state
Most React components maintain an internal state. With React Templates this is achieved by creating a JavaScript file adjacent to the .rt file. This JavaScript files is composed with the result of the compilation of the .rt to generate the React Component. linkrt requires that the JavaScript file have the same name and location as the .rt file.

linkrt supports two types of syntax for the JavaScript file. Using the simple syntax that JavaScript file should be implemented as a single, self-invoking function that returns an object that will be used as the specification for *React.createClass*. This object should not implement a *render* method - instead linkrt will implement the *render* method from the React Template. For example:

counter.rt
```html
<!doctype rt>
<div onClick="()=>this.inc()">Click to inc: {this.state.counter}</div>
```

counter.js
```javascript
(function () {
	return {
		getInitialState: function () {
			return {counter:0};
		},
		inc: function () {
			this.setState({counter:this.state.counter + 1});
		}
	};
}());
```
Alternatively, the JavaScript file can be implemented using [RequireJS](http://requirejs.org/) syntax. In the requirement list, the React Template file must be specified by name. The return value will be the React class. For example:

counter.js
```javascript
define(['react', 'counter.rt'], function (React, render) {
	return React.createClass({
		getInitialState: function () {
			return {counter:0};
		},
		inc: function () {
			this.setState({counter:this.state.counter + 1});
		},
		render: render
	}};
}());
```
Note that in this case, the *render* method must be implemented as shown in the sample. Also, in addition to 'react' and the React Template, the script can also require 'lodash' and 'jquey'.

## Component composition
One of the most powerful features of React in general, and React Templates in particular, is the ability to [compose components](https://github.com/wix/react-templates#doctype-rt-require-dependencies-and-calling-other-components). linkrt supports this functionality using the *name* attribute on the &lt;link&gt; tag.

To specify a component as composable into other components, give it a none-emty *name* attribute value. Such a component will not be rendered directly into the DOM. Instead they will become available for consumption by other components:

index.html
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Link React Templates Sample</title>
    <script src="dist/linkrt.min.js"></script>
</head>
<body>
    <link href="sample/component" type="text/rt" name="component"> <!-- not displayed directly -->
    <link href="sample/container" type="text/rt">
</body>
</html>
```
container.rt
```html
<!doctype rt todo="component">
<div style="color:white; background-color:blue; padding:4px;">
    <component/>
</div>
```

## Alternate paths
By default, linkrt assumes that both the .rt and .js files the constitute a component are next to each other (same URL, except for the file extension). You can override this default by specifying the script URL explicitly using the *data-script-href* attribute of the &lt;link;&gt; tag, for example:
```html
<link href="sample/todo" data-script-href="sample/todo2" type="text/rt">
```
Note that the files can now be placed at different locations, as well as have different names. As with the *href* attribute, the file extension is optional.

By default, *href* (and *data-script-href*) values specified for &lt;link;&gt; tag are either absolute, or relative to the containing page's based address. You can explicitly specify an alternate base for all the linkrt tags by placing the *data-base* attribute on the linkrt &lt;script&gt; tag. You can also specify a base specifically for scripts using the *data-script-base* attribute:
```html
<script src="dist/linkrt.min.js" data-base="http://somewhereelse.com"></script> 
```

## Advanced

### Render containers
After linkrt retrieves and compiles the React Templates, it embeds them in the DOM instead of the referring &lt;link&gt; tags. This is done by replacing the &lt;link&gt; tags with the following HTML code: &lt;span class="linkrt-container"&gt;&lt;/span&gt;. It then uses the &lt;span&gt; tags as the target for the rendering. This means that you can use the *linkrt-container* class name to identify or style all the component containers.

In addition, if the original &lt;link&gt; tag has *id*, *style*, or *class* attributes, these attributes will be copied over to the &lt;span&gt; tag that replaces it. In the case of the *class* attribute, the *linkrt-container* class name will be appended to the list of class names copied over from the original &lt;link&gt; tag.

[As dscribed above](#component-composition), &lt;link&gt; tags that have the *name* attribute are not injected directly into the DOM. As a result, such &lt;link&gt; tags are not replaced with a &lt;span&gt;. Instead, they are wholly removed from the DOM.

### Exposing the libraries
You can instruct linkrt to expose the React, lodash and jQuery libraries it uses to other scripts on the page but placing a *data-expose* attribute on its &lt;script&gt; tag:

```html
<script src="dist/linkrt.min.js" data-expose></script>
```

### Events
After successfuly injectng a React component into the DOM, linkrt generates a DOM event that will bubble from the containing &lt;span&gt; tag up to the root *window* object. The event type is *linkRtRender*, and the event target will be set to the containing &lt;span&gt; tag:

```html
<script>
    $(window).on('linkRtRender', function (e, component, url) {
        alert(url);
    });
</script>
```
*component* will be the React component generated by *React.render*, and *url* is the source URL of the React Templates. If a *name* attribute was specified for the &lt;link&gt; tag, it will be provided as the third argument.

## Recommended process for bulding components
Here is a suggested best practice for using linkrt for designing, implementing and debugging React components. At every stage you can simply reload the page in the browser to see the effects of your changes.

1. Design and style the component's prototype directly in the HTML document

    index.html:
    ```html
    <!DOCTYPE html>
    <html>
    <head lang="en">
        <meta charset="UTF-8">
        <title>Todo List</title>
        <script src="dist/linkrt.min.js"></script>
    </head>
    <body>
    <div>
        Have 0 todos done,
        and 1 not done
        <br/>
        <div>
            <button>x</button>
            <input type="checkbox">
            <span>Design and style todo list component</span>
        </div>
        <form>
            <input type="text">
            <button type="submit">Add</button><br/>
        </form>
        <button>Clear done</button>
    </div>
    </body>
    </html>
    ```
2. Cut and paste the component's content into a separate .rt file and referrence it from the HTML. No need to create a JavaScript file yet

    index.htm:
    ```html
    <!DOCTYPE html>
    <html>
    <head lang="en">
        <meta charset="UTF-8">
        <title>Todo List</title>
        <script src="dist/linkrt.min.js"></script>
    </head>
    <body>
        <link href="todo" type="text/rt">
    </body>
    </html>
    ```
    todo.rt:
    ```html
    <!doctype rt>
    <div>
        Have 0 todos done,
        and 1 not done
        <br/>
        <div>
            <button>x</button>
            <input type="checkbox">
            <span>Design and style todo list component</span>
        </div>
        <form>
            <input type="text">
            <button type="submit">Add</button><br/>
        </form>
        <button>Clear done</button>
    </div>
    ```
3. Add directives, such as rt-repeat and rt-if, using data provided via *props*

    index.htm:
    ```html
    <!DOCTYPE html>
    <html>
    <head lang="en">
        <meta charset="UTF-8">
        <title>Todo List</title>
        <script src="dist/linkrt.min.js"></script>
    </head>
    <body>
        <link href="todo" type="text/rt" props="todos:['first','second','third']">
    </body>
    </html>
    ```
    todo.rt:
    ```html
    <!doctype rt>
    <div>
        Have 0 todos done,
        and {this.props.todos.length} not done
        <br/>
        <div rt-repeat="todo in this.props.todos" key="{todo}">
            <button>x</button>
            <input type="checkbox">
            <span>{todo}</span>
        </div>
        <form>
            <input type="text">
            <button type="submit">Add</button><br/>
        </form>
        <button>Clear done</button>
    </div>
    ```
4. Implement the JavaScript for event handling and state manipulation.

    index.html
    ```html
    <!DOCTYPE html>
    <html>
    <head lang="en">
        <meta charset="UTF-8">
        <title>Todo List</title>
        <script src="dist/linkrt.min.js"></script>
    </head>
    <body>
        <link href="todo" type="text/rt">
    </body>
    </html>
    ```
    todo.rt:
    ```html
    <!doctype rt>
    <div>
        Have {_.filter(this.state.todos, {done:true}).length} todos done,
        and {_.filter(this.state.todos, {done:false}).length} not done
        <br/>
        <div rt-repeat="todo in this.state.todos" key="{todo.key}">
            <button onClick="()=>this.remove(todo)">x</button>
            <input type="checkbox" checked="{todo.done}" onChange="()=>this.toggleChecked(todoIndex)">
            <span style="text-decoration: {todo.done ? 'line-through': 'none'}">{todo.value}</span>
        </div>
        <form onSubmit="(e)=>e.preventDefault(); this.add()">
            <input key="myinput" ref="myinput" type="text" valueLink="{this.linkState('edited')}">
            <button type="submit">Add</button><br/>
        </form>
        <button onClick="(e)=>e.preventDefault(); this.clearDone()">Clear done</button>
    </div>
    ```
    todo.js
    ```javascript
    (function () {
        return {
            mixins: [React.addons.LinkedStateMixin],
    
            makeTodos: function (todos, counter) {
                return _.map(todos, function (todo) {
                    return {value: todo, done: false, key: counter++};
                });
            },
    
            getInitialState: function () {
                var todos = this.props.todos ? this.makeTodos(this.props.todos, 0) : [];
                return {edited: '', todos: todos, counter: todos.length};
            },
    
            add: function () {
                var state = this.state;
                var edited = state.edited.trim();
                if (edited) {
                    var todos = state.todos.concat(this.makeTodos([edited], state.counter));
                    this.setState({todos: todos, edited: '', counter: state.counter + 1});
                }
            },
    
            remove: function (todo) {
                this.setState({todos: _.reject(this.state.todos, todo)});
            },
    
            toggleChecked: function (index) {
                var todos = _.cloneDeep(this.state.todos);
                todos[index].done = !todos[index].done;
                this.setState({todos: todos});
            },
    
            clearDone: function () {
                this.setState({todos: _.filter(this.state.todos, {done: false})});
            },
    
            componentDidUpdate: function () {
                this.refs.myinput.getDOMNode().focus();
            }
        };
    }());
    ```
5. Break large components into smaller composable components, [using the *name* attribute](#component-composition).
