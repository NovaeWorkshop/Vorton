/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../src/vorton.ts" />

module VortonSpec {

  describe('elementHasClass', () => {

    it('returns true if element has class', () => {

      var element = document.createElement('SPAN');

      element.className = 'one two three';

      Vorton.elementHasClass(element, 'two')
        .should.equal(true);
    });

    it('returns false if element has not class', () => {

      var element = document.createElement('SPAN');
      element.className = 'one two three';

      Vorton.elementHasClass(element, 'zero')
        .should.equal(false);
    });

  });

}