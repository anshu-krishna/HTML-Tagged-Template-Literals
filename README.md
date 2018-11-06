# HTML-Tagged-Template-Literals
#### Using JavaScript tagged template literals for creating DOM Element trees
The library provides a function named HTML() with syntax:
```javascript
HTML(tagString, attrs = {})
```
The HTML function takes a tagString and an object containing attributes of the DOMElement and returns a function that can be used as the handler for a tagged template literal.
```
tagString = elementType[#id][.class1.class2...]
```
###### Examples of tagString:
 - div
 - p#my_p_id
 - span.my_class
 - div.red.highlight
 - div#content.add_border.blue_text
### How to use:
To create a div element
```javascript
let node = HTML('div#element_id.css_class1')`Element's innerHTML`;
```
##### Examples:
To create
```HTML
<div><b>Hello</b> <i>World</i></div>
```
```javascript
let node = HTML('div')`<b>Hello</b> <i>World</i>`;
```
The innerHTML part can also take other nodes (or an array of nodes) like
```javascript
let b = HTML('b')`Hello`;
let node = HTML('div')`${b} <i>World</i>`;
```
```javascript
let internalNodes = [HTML('b')`Hello`, ' ' ,HTML('i')`World`];
let node = HTML('div')`${internalNodes}`;
```
Let's take another example and try to create the following form element, where the button displays the value of the input
```HTML
<form onsubmit="return false;">
	<input type="number" max="100" min ="1" value="5" />
	<button>Show value</button>
</form>
```
```javascript
let input = HTML('input', {
    type: 'number',
    min: 1,
    max: 100,
    value: 5
})``;
let button = HTML('button')`Show value`;
button.addEventListener('click', () => { alert(input.value); });
document.body.appendChild(HTML('form', { onsubmit: 'return false;' })`${input} ${button}`);
```
Let's create a unordered list of links
```javascript
let links = ['https://www.google.com', 'https://www.yahoo.com', 'https://www.bing.com'];
let ul = HTML('ul')`${
    links.map( url => HTML('li')`${HTML('a', { href: url, target: '_blank'})`${url}`}` )
}`;
document.body.appendChild(ul);
```
This will add the following to the document body
```HTML
<ul><li><a href="https://www.google.com" target="_blank">https://www.google.com</a></li><li><a href="https://www.yahoo.com" target="_blank">https://www.yahoo.com</a></li><li><a href="https://www.bing.com" target="_blank">https://www.bing.com</a></li></ul>
```

**You can freely mix and match all the ways to repersent the innerHTML**
```javascript
HTML('div')`${HTML('header.myclass')`<strong>Days of the week</strong>`}
The days are called
<ul>${
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => HTML('li')`${day}`)
}</ul>`;
```
The above code will generate
```HTML
<div><header class="myclass"><strong>Days of the week</strong></header> The days are called <ul><li>Sunday</li><li>Monday</li><li>Tuesday</li><li>Wednesday</li><li>Thursday</li><li>Friday</li><li>Saturday</li></ul></div>
```