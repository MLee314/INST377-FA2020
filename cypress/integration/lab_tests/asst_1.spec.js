function checkClassname($el) {
  const className = $el.attr('class');
  expect(className).to.exist;
  expect(className.includes('.')).to.be.false;
  expect(className).to.have.length.greaterThan(0);
}

function checkImageSize($img, max) {
  expect($img[0].naturalWidth).to.be.greaterThan(0);
  expect($img[0].width).to.be.lessThan(max);
}

function variableWidth($el, min, max) {
  const w = $el.outerWidth();
  expect(w).to.be.greaterThan(min);
  expect(w).to.be.lessThan(max);
}

function notBW($el, rule) {
  expect($el.css(rule)).to.not.equal('rgba(0, 0, 0, 0)');
  expect($el.css(rule)).to.not.equal('rgba(255, 255, 255, 1)');
}

function lightOrDark(color) {
  // Variables for red, green, blue values
  let r; let g; let b; let
    hsp;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If RGB --> store the red, green, blue values in separate variables
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If hex --> Convert it to RGB: http://gist.github.com/983661
    color = +(`0x${color.slice(1).replace(
      color.length < 5 && /./g, '$&$&'
    )}`);

    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(
    0.299 * (r * r)
    + 0.587 * (g * g)
    + 0.114 * (b * b)
  );

  cy.log('HSP', hsp);
  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 140) {
    return 'light';
  }

  return 'dark';
}

describe('Assignment 1', () => {
// TODO:
// Make this work at TWO SIZES
  const sizes = ['macbook-13', 'ipad-2'];
  sizes.forEach((size) => {
    context(size, () => {
      beforeEach(() => {
        cy.viewport(size);
      });
      it('Successfully loads with valid HTML', () => {
        cy.fixture('test_values').then((json) => {
          const labUrl = `${json.test_context || ''}/asst-1/`;
          cy.visit(labUrl); // change URL to match your dev URL
          cy.htmlvalidate();
        });
      });

      it('Has a correctly crafted header', () => {
        cy.get('div.header h1');
      });

      it('Has a header image smaller than 355px', () => {
        // cy.get('div.header img')
        //   .invoke('width')
        //   .should('be.lt', 355);

        cy.get('div.header img')
          .should('be.visible')
          .and(($img) => { checkImageSize($img, 355); });
      });

      it('Has a content wrapper div for positioning elements', () => {
        cy.get('div.wrapper');
      });

      it('Has a content container div', () => {
        cy.get('.wrapper .container');
      });

      it('Has two content columns', () => {
        cy.get('.wrapper .container > div')
          .should('have.length', 2)
          .each(checkClassname);
      });

      it('Has an image column with caption', () => {
        cy.get('div img + p');
      });

      it('Has a descriptive passage block and an ordered list, with a header', () => {
        cy.get('div > h2 + p + ol');
      });

      it('Each list element contains a text header with content', () => {
        cy.get('div > ol > li > h2')
          .then(($el) => {
            expect($el).to.have.length(3);
          });
      });

      it('Each list entry has a sub-list with text', () => {
        cy.get('div > ol').within(($el) => {
          cy.get('ul')
            .should('have.length', 3);
          cy.get('ul')
            .each(checkClassname);
          cy.get('ul li')
            .should('have.length', 9);

          cy.get('div')
            .should('have.length', 3);
          cy.get('div')
            .each(checkClassname);
        });
      });
      it('=========== End of HTML section ===========', () => {
        cy.log('END OF HTML SECTION');
      });

      it('Dark color for the header', () => {
        cy.get('div.header').then(($el) => {
          const lightDark = lightOrDark($el.css('background-color'));
          expect(lightDark).to.equal('dark');
        });
      });
      it('Light color for the body', () => {
        cy.get('body').then(($el) => {
          const lightDark = lightOrDark($el.css('background-color'));
          expect(lightDark).to.equal('light');
        });
      });

      it('CSS rules for header', () => {
        cy.get('div.header').should('have.css', 'margin-bottom', '15px');
        cy.get('div.header').should('have.css', 'padding', '15px');
        cy.get('div.header').should('have.css', 'display', 'flex');
        cy.get('div.header').should('have.css', 'flex-direction', 'row');
        cy.get('div.header').should('have.css', 'flex-wrap', 'wrap');
        cy.get('div.header').should('have.css', 'align-items', 'center');
      });

      it('Middle column is restricted to a readable width', () => {
        cy.get('div.container')
          .first(($el) => { variableWidth($el, 450, 960); });
      });

      it('Center middle column using flex properties', () => {
        cy.get('div.container').should('have.css', 'display', 'flex');
        cy.get('div.container').should('have.css', 'flex-direction', 'row');
        cy.get('div.container').should('have.css', 'flex-wrap', 'wrap');
        cy.get('div.container').should('have.css', 'align-items', 'flex-start');
        if (size === sizes[0]) {
          cy.get('div.container').should('have.css', 'justify-content', 'space-between');
        } else {
          cy.get('div.container').should('have.css', 'justify-content', 'center');
        }
      });

      if (size === sizes[0]) {
        it('Left div is structured as a column', () => {
            cy.get('.wrapper .container > div')
              .first()
              .should('have.css', 'flex', '0 1 auto');
    
            cy.get('.wrapper .container > div')
              .first()
              .should('have.css', 'margin-right', '15px');
    
            cy.get('.wrapper .container > div')
              .first(($el) => { variableWidth($el, 75, 200); });
          });
      } else {
        it('Left div is now on top of main div', () => {
            cy.get('.wrapper .container > div')
              .first()
              .should('have.css', 'flex', '1 0 auto');
    
            cy.get('.wrapper .container > div')
              .first()
              .should('have.css', 'margin-right', '0px');
    
            cy.get('.wrapper .container > div')
              .first(($el) => { variableWidth($el, 75, 200); });
          });
      }

      it('Should contain links for all your stylesheets', () => {
        cy.get('head link[rel="stylesheet"]')
          .should('have.lengthOf.at.least', 2);
      });

      it('Should use no more than 3 weights of a google font', () => {
        cy.get('head link[rel="stylesheet"]')
          .each(($el) => {
            const href = $el.attr('href');
            const possible = ['styles.css', 'https://fonts.googleapis.com'];
            const regex = new RegExp(`${possible.join('|')}`, 'gi');
            expect(href.match(regex)).to.have.length(1);
          });
      });

      it('Should use no more than 3 weights of a google font', () => {
        cy.get('head link[rel="stylesheet"]')
          .each(($el) => {
            const href = $el.attr('href');
            const possible = ['styles.css', 'https://fonts.googleapis.com'];
            const regex = new RegExp(`${possible.join('|')}`, 'gi');
            expect(href.match(regex)).to.have.length(1);
          });
      });

      it('Should apply special fonts to header tags', () => {
        cy.get('h1').should('have.css', 'font-family');
        cy.get('h2').should('have.css', 'font-family');

        cy.get('h1')
          .then(($h1) => {
            cy.get('h2')
              .first(($h2) => {
                const h1FontFam = $h1.css('font-family');
                const h2FontFam = $h2.css('font-family');
                expect(h1FontFam).to.equal(h2FontFam);
              });
          });
      });

      it('Should use different fonts for headers and basic text', () => {
        cy.get('h1')
          .then(($h1) => {
            cy.get('h2')
              .first(($h2) => {
                const h1FontFam = $h1.css('font-family');
                const h2FontFam = $h2.css('font-family');
                expect(h1FontFam).to.equal(h2FontFam);
                cy.get('body')
                  .then(($bdy) => {
                    const bdyFont = $bdy.css('font-family');
                    expect(h1FontFam).to.not.equal(bdyFont);
                  });
              });
          });
      });

      it('Should have two images, one styled, one not', () => {
        cy.get('div > img ~ p')
          .parent()
          .within(($el) => {
            cy.get('img').should('have.css', 'border-radius', '4px');
            cy.get('img').should('have.css', 'border-width', '1px');
            cy.get('img').should('have.css', 'border-style', 'solid');
            cy.get('img').then(($img) => {
              checkImageSize($img, 200);
            });
            cy.get('img')
              .then(($img) => { notBW($img, 'border-color'); });
          });
      });
    });
  });
});
