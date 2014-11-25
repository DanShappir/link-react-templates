# Link React Templates

[React Templates](https://github.com/wix/react-templates) provide a powerful mechanism for constructing [React](http://facebook.github.io/react/index.html) Components using HTML syntax. **Link React Templates** (linkrt) extends this mechanism by providing an easy to use environment for rapid design, prototyping, and development of React Templates. In simple scenarios it can even be used for production deployment.

## How does it work
linkrt allows you to easily embed React Templates directly into the HTML, without requiring explicit pre-compilation. Simply place a <link> tag in the HTML which referres to the .rt file - linkrt will download the .rt file, compile it in-memory, and replace the original <link> tag with the result. For example, given the file sample.rt:

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
will result in the text "Hello world" being displayed in the browser window.

linkrt also supports backing JavaScript for implementing React Components state manipulation. Simply create a JavaScript file with the same name at the .rt file, at the same location. linkrt will automatically download the JavaScript file, and attach it to the component - see below for details.

## Usage
To use linkrt in an HTML page add a <script> tag referencing *linkrt.browser.js*. This tag can be placed anywhere in the page, and will not interfer with any other scripts used by the page. The linkrt script will begin downloading and processing the component files (.rt and .js) after the browser's **Document Ready** event. As soon as each component is download, it is immediatly processed and the result is injected into the DOM.

**Note:** <link> tags rferencing component files must have the *type="text/rt"* attribute, otherwise it will be igonred. That .rt extension in the href is optional.

If an error occurs during download or processing of the component files, an error message will be written to the browser's console.