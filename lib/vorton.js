var Vorton;
(function (Vorton) {
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
            range.startContainer.parentNode.normalize();
        }
        function splitBreadthRange(range) {
            var leftRange = document.createRange();
            var rightRange = document.createRange();
            leftRange.setStart(range.startContainer, 0);
            if (range.startContainer.nodeType === Node.TEXT_NODE) {
                leftRange.setEnd(range.startContainer, range.startContainer.textContent.length);
            }
            else {
                leftRange.setEnd(range.startContainer, 0);
            }
            rightRange.setStart(range.startContainer.nextSibling, 0);
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
    function highlight(range, className) {
        eachRangeTextNode(range, function (node) {
            if (!isEmptyNode(node)) {
                var wrapper = document.createElement('SPAN');
                node.parentNode.insertBefore(wrapper, node);
                wrapper.className = className;
                wrapper.appendChild(node);
            }
        });
    }
    Vorton.highlight = highlight;
})(Vorton || (Vorton = {}));

//# sourceMappingURL=vorton.js.map