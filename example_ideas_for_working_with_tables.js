document.body.innerHTML = '';

let data = [1, 2, 3, 4, 5];

let t1 = HTML`<table><tbody></tbody></table>`;
{
	let tr = data.map(val => HTML`<table>
		<tr>
			<td>${val}</td>
			<td>*2=</td>
			<th>${val*2}</th>
		</tr>
	</table>`.querySelector('tr'));
	
	let tbody = t1.querySelector('tbody');
	tr.forEach(node => tbody.appendChild(node))
}
document.body.appendChild(t1);



//Add these helper functions to simpify the above code;
function HTML_TR(strings, ...exps) {
	let copy = strings.map(v=>v);
	copy[0] = '<table><tbody><tr>' + copy[0];
	let last = copy.length - 1;
	copy[last] = copy[last] + '</tr></tbody></table>';
	let node = HTML(copy, ...exps);
	return node.querySelector('tr');
}
function TR_Mapper(target, data, mapper) {
	data.forEach(val => target.appendChild(mapper(val)));
}



// Using only the TR maker
let t2 = HTML`<table><tbody></tbody></table>`;
{
	let tr = data.map(val => HTML_TR`<td>${val}</td><td>*2=</td><th>${val*2}</th>`);
	let tbody = t2.querySelector('tbody');
	tr.forEach(node => tbody.appendChild(node))
}
document.body.appendChild(t2);


// Using TR maker and mapper
let t3 = HTML`<table><tbody></tbody></table>`;
TR_Mapper(t3.querySelector('tbody'), data, val => HTML_TR`<td>${val}</td><td>*2=</td><th>${val*2}</th>`);
document.body.appendChild(t3);