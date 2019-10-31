# HTML-Tagged-Template-Literals v2
Using JavaScript tagged template literals for creating DOM Element trees.
#### This version is incompatible with the previous versions
The library provides a function named `HTML()` that can be used as 'string literal tag'. It returns an HTMLElement. The string must contain a valid HTML code else `null` is returned.

**Example:**
```javascript
let mydiv = HTML`<div>Hello World</div>`;
/*
Equivalent code in vanila javascript:

let mydiv = document.createElement('div');
mydiv.innerHTML = 'Hello World';
*/
```

Just like in React, the string **must** contain only one HTML tag at the top level. (It can have any number of child elements.)

**Example:**
```javascript
let a = HTML`<div>Hello World</div>`; // Valid

let b = HTML`<div>
                <p>One</p>
                <p>Two</p>
            </div>`; // Valid

let c = HTML`<p>One</p> <p>Two</p>`; // Invalid
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

If the expression is a reference to a HTMLElement then it is inserted at the relevent place.\
If the expression is an array then all the values are added sequentially.\
If the expression is a function then it is evaluated before adding.\
Any other type of expression is converted to a `String` before adding as a `TextNode`.

See the `example.html` file for all the examples.

[Examples-JSFiddle](https://jsfiddle.net/anshu_krishna/5Lcsuwve/)