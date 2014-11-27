# Link React Templates

[React Templates](https://github.com/wix/react-templates) provide a powerful mechanism for constructing [React](http://facebook.github.io/react/index.html) Components using HTML syntax. **Link React Templates** (linkrt) extends this mechanism by providing an easy to use environment for rapid design, prototyping, and development of React Templates. In simple scenarios it can also be used for production deployments.

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
    <script src="dist/linkrt.browser.js"></script>
</head>
<body>
    <link href="sample/sample.rt" type="text/rt">
</body>
</html>
```
will result in the text "Hello world" being displayed inside the browser window. You can put any number of &lt;link&gt; tags referencing React Template in th HTML file.

linkrt also supports the inclusion of JavaScript files for implementing React Component state manipulation. Simply create a JavaScript file with the same name at the .rt file, and place it at the same location. linkrt will automatically download the JavaScript file, and attach it to the component - [see below for details](#javascript-for-state).

## Installation
Simply use [Bower](http://bower.io/):

1. Install Bower: *npm install -g bower*
2. Configure Bower to use the [Wix Bower Registry](http://kb.wixpress.com/display/dashboard/Creating+a+bower+component)
2. Install the package: *bower install link-react-templates*

linkrt will now be installed in *bower_components/link-react-templates*. To use linkrt in your HTML file, you would include a tag such as &lt;script src="bower_components/link-react-templates/dist/linkrt.browser.js"&gt;

## Usage
To use linkrt in an HTML page add a &lt;script&gt; tag referencing *linkrt.browser.js*. This tag can be placed anywhere in the page, and will not interfer with any other scripts used by the page. The linkrt script will begin downloading and processing the component files (.rt and .js) after the browser's **Document Ready** event. As soon as each component is download, it will be immediatly processed and the result will be injected into the DOM at the same place as the referring &lt;link&gt; tag.

**Note:** &lt;link&gt; tags rferencing React Templates must have the *type="text/rt"* attribute, otherwise they will be igonred by linkrt. The .rt extension in the &lt;link&gt; *href* attribute is optional.

If an error occurs during download or processing of React Templates, an error message will be written to the browser's Dev Tools Console.

## Passing properties
React utilizes the props setting to pass initialization data to components. linkrt supports this mechanism through the use of a *props* attribute on the &lt;link&gt; element. For example, given the .rt file:

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
    <script src="dist/linkrt.browser.js"></script>
</head>
<body>
    <link href="sample/sample.rt" type="text/rt" props="name:'Jim'">
</body>
</html>
```
the text "Hello Jim" will be displayed in the browser window.

The values of the *props* attribute is a comma-delimited list of name/values pairs, which are separated by colons. String values should be enclosed in single quotes. The entires value of props can be optionally enclosed in { }, to give it a JSON-like appearance.

## JavaScript for state
Most React components maintain an internal state. With React Templates this is achieved by creating a JavaScript file adjacent to the .rt file. This JavaScript files is composed with the result of the compilation of the .rt to generate the React Component. linkrt requires that the JavaScript file have the same name and location as the .rt file. For example:

counter.rt
```html
<!doctype rt>
<div onClick="()=>this.inc()">Click to inc: {this.state.counter}</div>
```

counter.js
```javascript
(function () {
	'use strict';
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
Note that counter.js contains a single, self-invoking function that returns a JavaScript object to be used as the specification for *React.createClass*. Also note that this object **does not** implement a *render* method. The *render* method is generated automatically from the .rt file.

## Component composition
One of the most powerful features of React in general, and React Templates in particular, is the ability to [compose components](https://github.com/wix/react-templates#doctype-rt-require-dependencies-and-calling-other-components). linkrt supports this functionality using the *name* attribute on the &lt;link&gt; tag.

To specify a component as composable into other components, give it a none-emty *name* attribute value. Such a component will not be rendered directly into the DOM. Instead it will become available for consumption by other components:

index.html
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Link React Templates Sample</title>
    <script src="dist/linkrt.browser.js"></script>
</head>
<body>
    <link href="sample/component" type="text/rt" name="component"> <!-- no displayed directly -->
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

## Advanced

### Render containers

### events

## Recommended process for bulding components
