const placeholder = '~internal_-_placeholder_-_';

const splitPattern = new RegExp(`${placeholder}[0-9]+`, 'g');

const groupsPattern = new RegExp(`(?<replace>${placeholder}(?<index>[0-9]+))`, 'g');
const groupsMapper = ({groups}) => {
	groups.index = Number(groups.index);
	return groups;
};

const trueObject = o => typeof o === 'object' && !Array.isArray(o);
function stringify(exp) {
	if (exp instanceof HTMLElement) {
		return String(exp.textContent);
	}
	if (exp instanceof Text) {
		return String(exp.nodeValue);
	}
	switch (typeof exp) {
		case 'object':
			return JSON.stringify(exp);
			break;
		case 'function':
			return stringify(exp());
			break;
	}
	return String(exp);
}
function nodify(exp) {
	if (
		exp instanceof HTMLElement ||
		exp instanceof Text ||
		exp instanceof DocumentFragment
	) { return exp; }
	switch (typeof exp) {
		case 'object':
			if (Array.isArray(exp)) { return exp.map(nodify); }
			return document.createTextNode(JSON.stringify(exp));
			break;
		case 'function':
			return nodify(exp());
			break;
	}
	return document.createTextNode(String(exp));
}

function findTargets(elem) {
	const vt = []; /* value targets */
	const ant = []; /* attr name targets */
	
	/* Extract from attributes */
	for (let attr of elem?.attributes ?? []) {
		const v = [...attr.value.matchAll(groupsPattern)];
		if (v.length) {
			vt.push({ node: attr, value: attr.value, match: v.map(groupsMapper) });
		}
		const n = [...attr.name.matchAll(groupsPattern)];
		if(n.length) {
			ant.push({element: elem, attr: attr, match: n.map(groupsMapper)});
		}
	}

	/* Extact from text-nodes */
	const nodes = Array.from(elem.childNodes);
	for (let n of nodes) {
		if (n.nodeType !== 3) continue;
		const m = [...n.nodeValue.matchAll(groupsPattern)];
		if (m.length === 0) continue;
		vt.push({ node: n, value: n.nodeValue, match: m.map(groupsMapper) });
	}

	/* Process child elements */
	for (let c of elem.children) {
		const [v, n] = findTargets(c);
		for(let i of v) { vt.push(i); }
		for(let i of n) { ant.push(i); }
	}
	return [vt, ant];
}
export function HTML(strings, ...exps) {
	const template = [strings[0]];
	for (let i = 0, j = exps.length; i < j; i++) {
		template.push(`${placeholder}${i}${strings[i + 1]}`);
	}
	const elem = ((html) => {
		const node = document.createElement('template');
		node.innerHTML = html;
		return node.content;
	})(template.join(''));
	const [targets, attrs] = findTargets(elem);
	for (let item of targets) {
		switch (item.node.nodeType) {
			case 2:
				{
					let v = String(item.value);
					for (let m of item.match) {
						v = v.replace(m.replace, stringify(exps[m.index]));
					}
					item.node.nodeValue = v;
				}
				break;
			case 3:
				{
					let textNodes = item.value.split(splitPattern).map(n => document.createTextNode(n));
					let e = item.node.parentNode;
					e.insertBefore(textNodes[0], item.node);
					for (let i = 0, j = item.match.length; i < j; i++) {
						let expNodes = nodify(exps[item.match[i].index]);
						if (Array.isArray(expNodes)) {
							for (let en of expNodes) {
								e.insertBefore(en, item.node);
							}
						} else {
							e.insertBefore(expNodes, item.node);
						}
						e.insertBefore(textNodes[i + 1], item.node);
					}
					e.removeChild(item.node);
				}
				break;
		}
	}
	for(let item of attrs) {
		const ielem = item.element;
		const value = item.attr.nodeValue;
		let name = item.attr.name;
		if(item.match.length === 1
			&& trueObject(exps[item.match[0].index])
			&& name.replace(item.match[0].replace, '') === '') {
				ielem.removeAttribute(name);
				for(let [key, val] of Object.entries(exps[item.match[0].index])) {
					ielem.setAttribute(key, val);
				}
		} else {
			for(let m of item.match) {
				name = name.replace(m.replace, stringify(exps[m.index]));
			}
			ielem.removeAttribute(item.attr.name);
			if(name) {
				ielem.setAttribute(name, value);
			}
		}
	}
	elem.normalize();
	if(elem.childNodes.length === 1) {
		return elem.childNodes[0];
	}
	return elem;
}