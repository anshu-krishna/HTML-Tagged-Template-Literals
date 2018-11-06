/*
File: HTML Tagged Literals.js
Author: Anshu Krishna
Contact: anshu.krishna5@gmail.com
Date: 03-Nov-2018
*/
function HTML(tagString, attrs = {}) {
	let nodeData = { tag: 'div', id: null, classes: [] };
	do {
		if (tagString === undefined) {
			break;
		}
		let info = String(tagString).split(/([ #.])/);
		if (!info[0]) {
			break;
		}
		nodeData.tag = info[0];
		let len = info.length;
		if (len < 3) {
			break;
		}
		for (let idx = 1; idx < len; idx += 2) {
			let val = info[idx + 1];
			if (val === undefined) {
				break;
			}
			switch (info[idx]) {
				case '.':
					nodeData.classes.push(val);
					break;
				case '#':
					nodeData.id = val;
					break;
			}
		}
	} while (false);

	let node = document.createElement(nodeData.tag);
	if (nodeData.id) {
		node.setAttribute('id', nodeData.id);
	}
	for (let c of nodeData.classes) {
		node.classList.add(c);
	}
	if (attrs instanceof Object) {
		for (let k in attrs) {
			node.setAttribute(k, attrs[k]);
		}
	}
	return (strings, ...exprs) => {
		let placeholders = `<span data-thisIsInternalPlaceholder=""></span>`;
		node.innerHTML = strings.join(placeholders);
		console.log(strings.join(placeholders));
		console.log(node.innerHTML);
		console.log();
		placeholders = node.querySelectorAll(`span[data-thisIsInternalPlaceholder]`);
		let len = placeholders.length;
		for (let i = 0; i < len; i++) {
			if (exprs[i] instanceof Node) {
				placeholders[i].parentNode.replaceChild(exprs[i], placeholders[i]);
			} else if (Array.isArray(exprs[i])) {
				for (let expr of exprs[i].reverse()) {
					if (expr instanceof HTMLElement) {
						placeholders[i].insertAdjacentElement('afterend', expr);
					} else {
						placeholders[i].insertAdjacentText('afterend', String(expr));
					}
				}
				placeholders[i].parentNode.removeChild(placeholders[i]);
			}
			else {
				placeholders[i].parentNode.replaceChild(document.createTextNode(String(exprs[i])), placeholders[i]);
			}
		}
		node.normalize();
		return node;
	};
}