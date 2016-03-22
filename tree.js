var OFF = 0, HALF = 0.5, ON = 1

function Node (value, parent, id) {

	this.id = id
	this.nodes = []
	this.state = OFF
	this.checked = 0
	this.value = value
	this.parent = parent

}

function selected (nodes, options) {
	var out = []
	nodes.forEach(function (node) {
		if (node.state == ON) out.push(node.id)
		if (node.state == HALF || (node.state == ON && options.expose))
			out = out.concat(selected(node.nodes, options)) 
	})
	return out
}

function force (node) {
	node.state = node.parent.state
	node.checked = node.state == OFF ? 0 : node.nodes.length
	node.nodes.map(force)
	node.render()
}

Node.prototype.click = function () {
	var delta = this.state - (this.state = this.state == ON ? OFF : ON)
	this.checked = this.state == OFF ? 0 : this.nodes.length
	this.parent && this.parent.bubble(-delta)
	this.nodes.map(force)
	this.render()
}

Node.prototype.bubble = function (delta) {
	this.checked += +delta
	var oldState = this.state
	this.state = !this.checked ? OFF : (this.checked == this.nodes.length ? ON : HALF)
	this.parent && this.parent.bubble(this.state - oldState)
	this.render()
}

Node.prototype.render = function () {
	this.dom.classList.remove('on', 'off', 'half')
	this.dom.className += this.state == OFF ? ' off' : (this.state == ON ? ' on' : ' half')
	this.dom.innerHTML = '<div class="checkbox"></div><span>' + this.value + '</span>'
}

function Tree (data) {

	var parse = function (data, parent) {
		return data.map(function (node) {
			if ('string' == typeof node) return new Node(node, parent, node)
			var n = new Node(node.value, parent, node.id || node.value)
			n.nodes = parse(node.leaves, n)
			return n
		})
	}

	var nodes = parse(data)

	var render = function (nodes, dom) {
		nodes.forEach(function (node) {
			node.dom = document.createElement('div')
			node.dom.className = 'node'
			node.dom.onclick = node.click.bind(node)
			node.render()
			dom.appendChild(node.dom)
			if (node.nodes) {
				var inner = document.createElement('div')
				inner.className = 'inner'
				render(node.nodes, inner)
				dom.appendChild(inner)
			}
		})
		return dom
	}

	this.render = function () {
		var div = render(nodes, document.createElement('div'))
		div.className = 'tree-js'
		return div
	}

	this.selected = function (options) {
		return selected(nodes, options || {})
	}

}

module.exports = Tree