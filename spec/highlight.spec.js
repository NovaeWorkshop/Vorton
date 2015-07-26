var expect = chai.expect;
jasmine.getFixtures().fixturesPath = 'base/spec/fixtures';


describe('Highlight.highlight', function() {

  loadFixtures('highlight.html');

  it('highlights a range in a single text node', function() {

    var fixture = $('#test'),
        selectionRange = document.createRange(),
        originalLength = fixture[0].textContent.length;

    selectionRange.setStart(fixture[0].firstChild, 0);
    selectionRange.setEnd(fixture[0].firstChild, 22);

    Highlight.highlight(selectionRange, 'SPAN');

    fixture[0].firstChild.nodeName
      .should.equal('SPAN');

    fixture[0].firstChild.textContent.length
      .should.equal(22);

    fixture[0].firstChild.nextSibling.nodeName
      .should.equal('#text');

    fixture[0].firstChild.nextSibling.textContent.length
      .should.equal(originalLength - 22);
  });

});
