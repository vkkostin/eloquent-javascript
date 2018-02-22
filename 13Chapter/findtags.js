function byTagName(node, tagName) {

    let collection = [];

    if (node.children) {
        for(let i = 0; i < node.children.length; i++) {
            if (node.children[i].tagName.toLowerCase() === tagName) {
                collection.push(node.children[i]);
            }
            if (node.children[i].children) {
                byTagName(node.children[i], tagName).forEach(node => collection.push(node));
            }
        }
    }

    return collection;
}

console.log(byTagName(document.body, "h1").length);
// → 1
console.log(byTagName(document.body, "span").length);
// → 3
const para = document.querySelector("p");
console.log(byTagName(para, "span").length);
// → 2