/*
File: HTML Tagged Template Literals 2
Author: Anshu Krishna
Contact: anshu.krishna5@gmail.com
Date: 24-Oct-2019
*/
const HTML = (function() {
	const placeholder = 'thisIsInternalPlaceholder';
	const pattern = new RegExp(`${placeholder}[0-9]+`, 'g');
	const placeholderMapper = (str) => {return {replace: str, index: parseInt(str.replace(placeholder, ''))}};

	function extractTargets(ele) {
		const ret = [];
		for(let a of ele.attributes) {
			const m = a.value.match(pattern);
			if(m) {
				ret.push({node: a, value: a.value, match: m.map(placeholderMapper)});
			}
		}
		const nodes = Array.from(ele.childNodes);
		for(let n of nodes) {
			if(n.nodeType !== 3) continue;
			const m = n.nodeValue.match(pattern);
			if(!m) continue;
			ret.push({node: n, value: n.nodeValue, match: m.map(placeholderMapper)});
		}
		for(let c of ele.children) {
			for(let t of extractTargets(c)) {
				ret.push(t);
			}
		}
		return ret;
	}
	
	function expToNode(exp) {
		if(exp instanceof HTMLElement || exp instanceof Text) {
			return exp;
		}
		switch(typeof exp) {
			case 'object':
				if(Array.isArray(exp)) {
					return exp.map(expToNode);
				}
				return document.createTextNode(JSON.stringify(exp));
				break;
			case 'function':
				return expToNode(exp());
				break;
		}
		return document.createTextNode(String(exp));
	}

	function expToString(exp) {
		if(exp instanceof HTMLElement) {
			return exp.textContent;
		}
		if(exp instanceof Text) {
			return exp.nodeValue;
		}
		switch(typeof exp) {
			case 'object':
				return JSON.stringify(exp);
				break;
			case 'function':
				return expToString(exp());
				break;
		}
		return String(exp);
	}

	function handler(strings, ...exps) {
		let template = strings[0];
		for(let i = 0, j = exps.length; i < j; i++) {
			template += `${placeholder}${i}${strings[i + 1]}`;
		}
		let ele = document.createElement('div');
		ele.innerHTML = template;
		let targets = extractTargets(ele);
		for(let t of targets) {
			switch(t.node.nodeType) {
				case 2:
					{
						let v = String(t.value);
						for(let m of t.match) {
							v = v.replace(m.replace, expToString(exps[m.index]));
						}
						t.node.nodeValue = v;
					}
					break;
				case 3:
					{
						let textNodes = t.value.split(pattern).map(n => document.createTextNode(n));
						let e = t.node.parentElement;
						e.insertBefore(textNodes[0], t.node);
						for(let i = 0, j = t.match.length; i < j; i++) {
							let expNodes = expToNode(exps[t.match[i].index]);
							if(Array.isArray(expNodes)) {
								for(let en of expNodes) {
									e.insertBefore(en, t.node);
								}
							} else {
								e.insertBefore(expNodes, t.node);
							}
							e.insertBefore(textNodes[i + 1], t.node);
						}
						e.removeChild(t.node);
					}
					break;
			}
		}
		ele.normalize();
		if(ele.children.length !== 1) {
			console.error('Invalid content in the template tag');
			return null;
		}
		return ele.firstChild;
	}
	return handler;
})();