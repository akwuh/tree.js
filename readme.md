### Example of usage
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
/** 
 * cars
 * bikes
 * |_expensive
 * |_cheap
 *     |_For children
 *     |_For teens
*/
var tree = new Tree(structure); // create Tree with specified structure
var html = tree.render(); // render tree html
document.body.appendChild(html);
tree.selected(); // get selected items.
```
