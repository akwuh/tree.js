var OFF = 0, HALF = 0.5, ON = 1

function Node (value, parent, id) {

	this.id = id
	this.leaves = []
	this.state = OFF
	this.checked = 0
	this.value = value
	this.parent = parent

}

Node.prototype.selected = function (options) {
	var out = []
	if (this.state == ON) out.push(this.id)
	if (this.state == HALF || (this.state == ON && options.includeLeaves))
		this.leaves.forEach(function (leaf) {
			out = out.concat(leaf.selected(options)) 
		})
	return out
}

Node.prototype.click = function () {
	var delta = this.state - (this.state = this.state == ON ? OFF : ON)
	this.checked = this.state == OFF ? 0 : this.leaves.length
	this.leaves.map(Node.prototype.force)
	this.parent && this.parent.bubble(-delta)
	this.render()
}

Node.prototype.render = function () {
	this.dom.classList.remove('on', 'off', 'half')
	this.dom.className += this.state == OFF ? ' off' : (this.state == ON ? ' on' : ' half')
}

Node.prototype.force = function (leaf) {
	leaf.state = leaf.parent.state
	leaf.checked = leaf.state == OFF ? 0 : leaf.leaves.length
	leaf.leaves.map(Node.prototype.force)
	leaf.render()
}

Node.prototype.bubble = function (delta) {
	this.checked += +delta
	var oldState = this.state
	this.state = !this.checked ? OFF : (this.checked == this.leaves.length ? ON : HALF)
	this.parent && this.parent.bubble(this.state - oldState)
	this.render()
}

function Tree (data) {

	var parse = function (data, parent) {
		
		return data.map(function (node) {
			if ('string' == typeof node) return new Node(node, parent, node)
			else if ('object' == typeof node) {
				var n = new Node(node.value, parent, node.id || node.value)
				n.leaves = parse(node.leaves, n)
				return n
			}
		}, this)
		
	}.bind(this)

	this.leaves = parse(data)

	this.render = function () {

		var innerHtml = function (leaves, dom) {
			leaves.forEach(function (leaf) {
				var div = document.createElement('div')
					,chbox = document.createElement('div')
					,label = document.createElement('span')
				
				label.innerText = leaf.value
				chbox.className = 'checkbox'
				chbox.onclick = leaf.click.bind(leaf)

				div.className = 'node'
				div.appendChild(chbox)
				div.appendChild(label)

				leaf.dom = div
				leaf.render()

				dom.appendChild(div)
				if (leaf.leaves) {
					var inner = document.createElement('div')
					inner.className = 'inner'
					innerHtml(leaf.leaves, inner)
					dom.appendChild(inner)
				}
			})
		}

		var div = document.createElement('div')
		div.className = 'tree-js'
		innerHtml(this.leaves, div)
		return div

	}.bind(this)

	this.selected = function (options) {
		options = options || {}
		var out = []
		this.leaves.forEach(function (leaf) {
			out = out.concat(leaf.selected(options))
		})
		return out
	}.bind(this)

}

module.exports = Tree