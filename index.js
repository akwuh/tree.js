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