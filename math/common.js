function nodeToPath(node) {
    if (!node.parent) return '';
    const lastChoice = node.parent.content[0] === node ? '0' : '1';
    return nodeToPath(node.parent) + lastChoice;
}