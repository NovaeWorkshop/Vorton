/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../src/vorton.ts" />

module VortonSpecs {

  var expect = chai.expect;
  jasmine.getFixtures().fixturesPath = 'base/spec/fixtures';

  describe('highlight()', () => {

    var fixture: HTMLElement,
      fixtureUrl: string,
      selectionRange: Range,
      originalText: string,
      originalLength: number;

    beforeEach(() => {
        loadFixtures(fixtureUrl);

        fixture = $('#test')[0];
        selectionRange = document.createRange();
        originalText = fixture.textContent;
        originalLength = originalText.length;
    });

    afterEach(() =>
      fixture.textContent
        .should.equal(originalText));

    describe('single text node', () => {

      beforeAll(() =>
        fixtureUrl = 'singleTextNode.html');

      it('highlights range', () => {

        selectionRange.setStart(fixture.firstChild, 5);
        selectionRange.setEnd(fixture.firstChild, 27);

        Vorton.highlight(selectionRange, 'red');

        fixture.firstChild.nodeName
          .should.equal('#text');
        fixture.firstChild.textContent.length
          .should.equal(5);

        fixture.firstChild.nextSibling.nodeName
          .should.equal('SPAN');
        fixture.firstChild.nextSibling.textContent.length
          .should.equal(22);
        (<HTMLElement>fixture.firstChild.nextSibling)
          .className.should.equal('red');

        fixture.firstChild.nextSibling.nextSibling.nodeName
          .should.equal('#text');
        fixture.firstChild.nextSibling.nextSibling.textContent.length
          .should.equal(originalLength - 27);

      });
    });


    describe('text node in nested divs', () => {

      beforeAll(() =>
        fixtureUrl = 'textNodeInNestedDivs.html');

      it('highlights range', () => {

        var rangeStart = fixture.firstElementChild,
          rangeEnd = rangeStart.firstElementChild.firstElementChild.firstChild,
          originalLength = rangeEnd.textContent.length;

        selectionRange.setStart(rangeStart, 0);
        selectionRange.setEnd(rangeEnd, 22);

        Vorton.highlight(selectionRange, 'red');

        var createdSpan = <HTMLElement>fixture.firstElementChild.firstElementChild.firstElementChild
          .firstChild;

        fixture.children.length.should.equal(1);

        createdSpan.nodeName
          .should.equal('SPAN');
        createdSpan.className
          .should.equal('red');
        createdSpan.textContent.length
          .should.equal(22);
        createdSpan.nextSibling.nodeType
          .should.equal(Node.TEXT_NODE);

      });
    });


    describe('text nodes in sibling divs', () => {

      beforeAll(() =>
        fixtureUrl = 'textNodesInSiblingDivs.html');

      it('highlights whole range', () => {

        var rangeStart = fixture.firstElementChild,
          rangeEnd = fixture.lastElementChild.firstChild;

        selectionRange.setStart(rangeStart, 0);
        selectionRange.setEnd(rangeEnd, rangeEnd.textContent.length);

        Vorton.highlight(selectionRange, 'red');

        var firstDiv = fixture.firstElementChild;
        var secondDiv = firstDiv.nextElementSibling;
        var thirdDiv = secondDiv.nextElementSibling;

        firstDiv
          .childNodes.length.should.equal(1);
        firstDiv
          .firstChild.nodeName.should.equal('SPAN');
        (<HTMLElement>firstDiv.firstChild)
          .className.should.equal('red');

        secondDiv
          .childNodes.length.should.equal(1);
        secondDiv
          .firstChild.nodeName.should.equal('SPAN');
        (<HTMLElement>secondDiv.firstChild)
          .className.should.equal('red');

        thirdDiv
          .childNodes.length.should.equal(1);
        thirdDiv
          .firstChild.nodeName.should.equal('SPAN');
        (<HTMLElement>thirdDiv.firstChild)
          .className.should.equal('red');

      });

      it('highlights range not starting at commonAncestor', () => {

        var rangeStart = fixture.firstElementChild,
          rangeEnd = fixture.lastElementChild.firstChild;

        selectionRange.setStart(rangeStart.firstChild, 20);
        selectionRange.setEnd(rangeEnd, rangeEnd.textContent.length);

        Vorton.highlight(selectionRange, 'red');

        var firstDiv = fixture.firstElementChild;
        var secondDiv = firstDiv.nextElementSibling;
        var thirdDiv = secondDiv.nextElementSibling;

        firstDiv
          .childNodes.length.should.equal(2);
        firstDiv
          .firstChild.nodeType.should.equal(Node.TEXT_NODE);
        firstDiv
          .firstChild.nextSibling.nodeName.should.equal('SPAN');
        (<HTMLElement>firstDiv.firstChild.nextSibling)
          .className.should.equal('red');

        secondDiv
          .childNodes.length.should.equal(1);
        secondDiv.firstChild
          .nodeName.should.equal('SPAN');
        (<HTMLElement>secondDiv.firstChild)
          .className.should.equal('red');

        thirdDiv
          .childNodes.length.should.equal(1);
        thirdDiv
          .firstChild.nodeName.should.equal('SPAN');
        (<HTMLElement>thirdDiv.firstChild)
          .className.should.equal('red');

      });
    });
  });

}
