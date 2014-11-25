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
    <script src="src/linkrt.browser.js"></script>
</head>
<body>
    <link href="sample/sample.rt" type="text/rt">
</body>
</html>
```
will result in the text "Hello world" being displayed inside the browser window. You can put any number of &lt;link&gt; tags referencing React Template in th HTML file.

linkrt also supports the inclusion of JavaScript files for implementing React Component state manipulation. Simply create a JavaScript file with the same name at the .rt file, and place it at the same location. linkrt will automatically download the JavaScript file, and attach it to the component - see below for details.

## Usage
To use linkrt in an HTML page add a &lt;script&gt; tag referencing *linkrt.browser.js*. This tag can be placed anywhere in the page, and will not interfer with any other scripts used by the page. The linkrt script will begin downloading and processing the component files (.rt and .js) after the browser's **Document Ready** event. As soon as each component is download, it will be immediatly processed and the result will be injected into the DOM at the same place as the referring &lt;link&gt; tag.

**Note:** &lt;link&gt; tags rferencing React Templates must have the *type="text/rt"* attribute, otherwise they will be igonred by linkrt. The .rt extension in the &lt;link&gt; *href* attribute is optional.

If an error occurs during download or processing of React Templates, an error message will be written to the browser's Dev Tools Console.

## Passing Properties
React utilizes the props setting to pass initialization data to components. linkrt supports this mechanism through the use of a **props** attribute on the &lt;link&gt; element. For example, given the .rt file:

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
    <script src="src/linkrt.browser.js"></script>
</head>
<body>
    <link href="sample/sample.rt" type="text/rt" props="name:'Jim'">
</body>
</html>
```
the text "Hello Jim" will be displayed in the browser window.
