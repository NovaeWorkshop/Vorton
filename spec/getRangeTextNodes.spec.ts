/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../src/vorton.ts" />

module VortonSpecs {

  var expect = chai.expect;
  jasmine.getFixtures().fixturesPath = 'base/spec/fixtures';

  describe('getRangeTextNodes', () => {

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

    describe('on single text node', () => {

      beforeAll(() =>
        fixtureUrl = 'singleTextNode.html');

      it('should return all text nodes', () => {

        selectionRange.setStart(fixture.firstChild, 0);
        selectionRange.setEnd(fixture.firstChild, fixture.firstChild.textContent.length);

        var textNodes = Vorton.getRangeTextNodes(selectionRange);

        textNodes.length
          .should.equal(1);
        textNodes[0].nodeType
          .should.equal(Node.TEXT_NODE);
        textNodes[0].length
          .should.equal(originalLength);
      });

      it('should return splitted text node still in DOM', () => {

        selectionRange.setStart(fixture.firstChild, 10);
        selectionRange.setEnd(fixture.firstChild, fixture.firstChild.textContent.length - 10);

        var textNodes = Vorton.getRangeTextNodes(selectionRange);

        textNodes.length
          .should.equal(1);
        textNodes[0].nodeType
          .should.equal(Node.TEXT_NODE);

        textNodes[0].parentNode
          .should.equal(fixture);

      });

    });
  });
}