module Vorton {

  export function elementHasClass(element: HTMLElement, className: string) {
    var elementClasses = element.className.split(' ');
    return elementClasses.indexOf(className) !== -1;
  }

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


  export function eachRangeTextNode(range: Range, fn: Function) {

    function processTextNodeRange(range: Range) {

      var textNode = <Text>range.startContainer;
      var splittedTextNode = textNode
        .splitText(range.startOffset)
        .splitText(range.endOffset)
        .previousSibling;

      fn(splittedTextNode);
    }

    function splitBreadthRange(range: Range) {

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

  export function getRangeTextNodes(range: Range): Array<Text> {
    var textNodes = [];

    eachRangeTextNode(range, textNode => textNodes.push(textNode));
    return textNodes;
  }

  function splitHighlight(textNode: Text) {

    var container = textNode.parentElement;
    var previousSibling = <Text>textNode.previousSibling;
    var nextSibling = <Text>textNode.nextSibling;

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

  export function highlight(range: Range, className: string, genericClassName?: string) {

    eachRangeTextNode(range, function(node: Text) {

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

  export function clear(range: Range, genericClassName: string) {

    eachRangeTextNode(range, function(textNode: Text) {

      if (elementHasClass(textNode.parentElement, genericClassName)) {
        splitHighlight(textNode);
        textNode.normalize();
        textNode.parentNode.normalize();
      }
    });
  }

}
