var Vorton;
(function (Vorton) {
    function elementHasClass(element, className) {
        var elementClasses = element.className.split(' ');
        return elementClasses.indexOf(className) !== -1;
    }
    Vorton.elementHasClass = elementHasClass;
    function isDescendantOrSame(child, parent) {
        var node = child;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    function isEmptyNode(node) {
        return !node.textContent.trim().length;
    }
    function eachRangeTextNode(range, fn) {
        function processTextNodeRange(range) {
            var textNode = range.startContainer;
            var splittedTextNode = textNode
                .splitText(range.startOffset)
                .splitText(range.endOffset)
                .previousSibling;
            fn(splittedTextNode);
        }
        function splitBreadthRange(range) {
            var leftRange = document.createRange();
            var rightRange = document.createRange();
            leftRange.setStart(range.startContainer, range.startOffset);
            if (range.startContainer.nodeType === Node.TEXT_NODE) {
                leftRange.setEnd(range.startContainer, range.startContainer.textContent.length);
            }
            else {
                leftRange.setEnd(range.startContainer, 0);
            }
            var leftRangeStartRoot = range.startContainer;
            while (!leftRangeStartRoot.nextSibling) {
                leftRangeStartRoot = leftRangeStartRoot.parentNode;
            }
            rightRange.setStart(leftRangeStartRoot.nextSibling, 0);
            rightRange.setEnd(range.endContainer, range.endOffset);
            processRange(leftRange);
            processRange(rightRange);
        }
        function deeperRange(range) {
            var nextRange = document.createRange();
            nextRange.setStart(range.startContainer.firstChild, 0);
            if (range.startContainer === range.endContainer) {
                var endContainer = range.startContainer.lastChild;
                nextRange.setEnd(endContainer, endContainer.nodeType === Node.TEXT_NODE ?
                    endContainer.textContent.length : 0);
            }
            else {
                nextRange.setEnd(range.endContainer, range.endOffset);
            }
            processRange(nextRange);
        }
        function processRange(range) {
            if (range.startContainer === range.endContainer
                && range.startContainer.nodeType === Node.TEXT_NODE) {
                processTextNodeRange(range);
            }
            else if (isDescendantOrSame(range.endContainer, range.startContainer)) {
                deeperRange(range);
            }
            else {
                splitBreadthRange(range);
            }
        }
        processRange(range);
    }
    Vorton.eachRangeTextNode = eachRangeTextNode;
    function getRangeTextNodes(range) {
        var textNodes = [];
        eachRangeTextNode(range, function (textNode) { return textNodes.push(textNode); });
        return textNodes;
    }
    Vorton.getRangeTextNodes = getRangeTextNodes;
    function splitHighlight(textNode) {
        var container = textNode.parentElement;
        var previousSibling = textNode.previousSibling;
        var nextSibling = textNode.nextSibling;
        if (previousSibling && previousSibling.length) {
            var beforeNode = document.createElement('SPAN');
            beforeNode.className = container.className;
            beforeNode.appendChild(previousSibling);
            container.parentNode
                .insertBefore(beforeNode, container);
        }
        container.parentNode
            .insertBefore(textNode, container);
        if (nextSibling && nextSibling.length) {
            var afterNode = document.createElement('SPAN');
            afterNode.className = container.className;
            afterNode.appendChild(nextSibling);
            container.parentNode
                .insertBefore(afterNode, container);
        }
        container.parentNode
            .removeChild(container);
    }
    function highlight(range, className, genericClassName) {
        eachRangeTextNode(range, function (node) {
            if (!isEmptyNode(node)) {
                if (elementHasClass(node.parentElement, genericClassName)) {
                    splitHighlight(node);
                }
                var wrapper = document.createElement('SPAN');
                node.parentNode.insertBefore(wrapper, node);
                wrapper.className = (genericClassName ? genericClassName + ' ' : '') + className;
                wrapper.appendChild(node);
                wrapper.normalize();
                wrapper.parentNode.normalize();
            }
        });
    }
    Vorton.highlight = highlight;
    function clear(range, genericClassName) {
        eachRangeTextNode(range, function (textNode) {
            if (elementHasClass(textNode.parentElement, genericClassName)) {
                splitHighlight(textNode);
                textNode.normalize();
                textNode.parentNode.normalize();
            }
        });
    }
    Vorton.clear = clear;
})(Vorton || (Vorton = {}));

//# sourceMappingURL=vorton.js.map