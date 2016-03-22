### An example of usage
```javascript
var structure = [
    "cars", // a node will be created with id == value == "node 1"
    {
        id: "bikes-id", // optional, if not specified then node's value will be used
        value: "bikes",
        leaves: [
            "expensive", 
            {
                value: "cheap",
                leaves: [
                    "For chidren",
                    "For teens"
                ]
            }
        ]
    }
]
var tree = new Tree(structure); // create Tree with specified structure
var html = tree.render(); // render tree html
tree.selected({includeLeaves: true | false}); // get selected items.
// if includeLeaves == false then in the case all leaves of a node are included then only parent node will be returned
```