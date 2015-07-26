module Highlight {

    export function highlight(range: Range, nodeName: string) {
        var wrapper = document.createElement(nodeName);
        range.surroundContents(wrapper);
        range.startContainer.parentNode.normalize();
    }

}
