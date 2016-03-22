(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Tree = require('./tree');

var structure = [
    {
        id: 2,
        value: 'category 2',
        leaves: [
            'subcategory 1', 
            {
                value: 'subcategory 2',
                leaves: [
                    'subsubcategory 1',
                    'subsubcategory 2'
                ]
            }
        ]
    },
    'category 1'
]
var tree = new Tree(structure) // create Tree with specified structure
var html = tree.render() // render tree html
document.body.appendChild(html)
window.tree = tree
},{"./tree":2}],2:[function(require,module,exports){
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
},{}]},{},[1]);
