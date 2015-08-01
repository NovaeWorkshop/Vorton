module Vorton {

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

  function isEmptyNode(node: Node) {
    return !node.textContent.trim().length;
  }


  function eachRangeTextNode(range: Range, fn: Function) {

    function processTextNodeRange(range: Range) {

      var textNode: Text = <Text>range.startContainer;
      var splittedTextNode = textNode
        .splitText(range.startOffset)
        .splitText(range.endOffset)
        .previousSibling;

      fn(splittedTextNode);
      range.startContainer.parentNode.normalize();
    }

    function splitBreadthRange(range: Range) {

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

    function deeperRange(range: Range) {

      var nextRange = document.createRange();
      nextRange.setStart(range.startContainer.firstChild, 0);

      if (range.startContainer === range.endContainer) {
        var endContainer = range.startContainer.lastChild;

        nextRange.setEnd(endContainer,
          endContainer.nodeType === Node.TEXT_NODE ?
            endContainer.textContent.length : 0);
      }
      else {
        nextRange.setEnd(range.endContainer, range.endOffset);
      }

      processRange(nextRange);
    }

    function processRange(range: Range) {

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


  export function highlight(range: Range, className: string) {

    eachRangeTextNode(range, function(node: Text) {

      if (!isEmptyNode(node)) {
        var wrapper = document.createElement('SPAN');
        node.parentNode.insertBefore(wrapper, node);
        wrapper.className = className;
        wrapper.appendChild(node);
      }

    });

  }

}
