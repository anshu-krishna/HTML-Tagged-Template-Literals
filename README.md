# HTML-Tagged-Template-Literals [v3.0]

## Installation:
Import from: [https://cdn.jsdelivr.net/gh/anshu-krishna/HTML-Tagged-Template-Literals@3.0/html-ttl.min.js](https://cdn.jsdelivr.net/gh/anshu-krishna/HTML-Tagged-Template-Literals@3.0/html-ttl.min.js)

Using JavaScript tagged template literals for creating DOM Element trees.
#### This version is incompatible with the previous versions
The library provides a function named `HTML()` that can be used as 'string literal tag'. It returns a `HTMLElement` | `TextNode` | `DocumentFragment`.

**Example:**
```javascript
let mydiv = HTML`<div>Hello World</div>`;
/*
Equivalent code in vanila javascript:

let mydiv = document.createElement('div');
mydiv.innerHTML = 'Hello World';
*/
```

Javascript expressions can be a part of the HTML string.

**Example:**
```javascript
const link = {url: 'https://www.google.com/', text: 'Link 1 - Visit Google'};

const link2 = {scheme: 'https', url: 'www.google.com', text: 'Link 2 - Visit google'};


let mylink = HTML`<a href="${link.url}" target="_blank">${link.text}</a>`;
/*Creates:
<a href="https://www.google.com/" target="_blank">Link 1 - Visit Google</a>
*/


mylink = HTML`<a href="${link2.scheme}://${link2.url}/" target="_blank">${link2.text}</a>`;
/*Creates:
<a href="https://www.google.com/" target="_blank">Link 2 - Visit google</a>
*/
```

```javascript
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


let mydiv = HTML`<div>
    <strong>Days of the week:</strong>
    <ul>
        ${days.map(day => HTML`<li>${day}</li>`)}
    </ul>
</div>`;


/*Creates:
<div>
    <strong>Days of the week:</strong>
    <ul>
        <li>Sunday</li><li>Monday</li><li>Tuesday</li><li>Wednesday</li><li>Thursday</li><li>Friday</li><li>Saturday</li>
    </ul>
</div>
*/
```

If the expression is a reference to a `HTMLElement` | `TextNode` | `DocumentFragment` then it is inserted at the relevent place.\
If the expression is an `Array` then all the values are added sequentially.\
If the expression is a `function` then it is evaluated before adding.\
Any other type of expression is converted to a `String` before adding as a `TextNode`.

See the `example.html` file for all the examples.