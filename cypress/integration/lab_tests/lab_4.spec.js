describe('Lab 4', () => {
  it('Successfully loads with valid HTML', () => {
    cy.fixture('test_values').then((json) => {
      const labUrl = `${json.test_context || ''}/lab_4/`;
      cy.visit(labUrl); // change URL to match your dev URL
      cy.htmlvalidate();
    });
  });

  it('should contain your name and lab number within the page title', () => {
    cy.fixture('test_values').then((json) => {
      cy.title().then(($title) => {
        const [name, lab, title] = [json.name, 'lab 4', $title].map((m) => m.toUpperCase());
        expect(title.includes(name)).to.be.true;
        expect(title.includes(lab)).to.be.true;
      });
    });
  });

  it('should correctly link to supplied lab styles.css', () => {
    cy.get('head link[href="styles.css"]');
  });

  it('Your lab should have a headline with your name and the lab number in it', () => {
    cy.fixture('test_values').then((json) => {
      cy.get('h1')
        .then(($hh1) => {
          const [name, lab, title] = [json.name, 'lab 4', $hh1.text()].map((m) => m.toUpperCase());
          expect(title.includes(name)).to.be.true;
          expect(title.includes(lab)).to.be.true;
        });
    });
  });

  it('Should include an HTML form', () => {
    cy.get('form');
  });

  it('Should wrap form elements in an unordered list with a flex-outer class, for styling', () => {
    cy.get('form ul.flex-outer');
  });

  it('Should have inputs for first and last name, with id of fname and lname', () => {
    cy.get('form ul.flex-outer li input[type=text]')
      .then(($ta) => {
        const id = $ta.attr('id');
        expect(id).to.exist;
      });

    cy.get('form ul.flex-outer li label[for="fname"]')
      .contains('First Name');

    cy.get('form ul.flex-outer li label[for="lname"]')
      .contains('Last Name');
  });

  it('Should have inputs for email and phone', () => {
    cy.get('form ul.flex-outer li input[type=tel]')
      .then(($ta) => {
        const id = $ta.attr('id');
        expect(id).to.exist;
      });

    cy.get('form ul.flex-outer li input[type=email]')
      .then(($ta) => {
        const id = $ta.attr('id');
        expect(id).to.exist;
      });
  });

  it('Should wrap checkbox elements in a separate list for styling', () => {
    cy.get('form ul.flex-outer li ul.flex-inner li input[type="checkbox"]');
  });

  it('Should include a Textarea field that has 5 rows and 33 columns, labelled for messages', () => {
    cy.get('form textarea[name="message"]')
      .then(($ta) => {
        const rows = Number($ta.attr('rows'));
        const cols = Number($ta.attr('cols'));

        expect(rows).to.be.greaterThan(4);
        expect(cols).to.be.greaterThan(32);
      });
  });

  it('All form controls should have a name attribute, for identification of data on server', () => {
    cy.get('form textarea')
      .then(($txt) => {
        const name = $txt.attr('name');
        expect(name).to.exist;
      });
    cy.get('form input')
      .each(($txt) => {
        const name = $txt.attr('name');
        expect(name).to.exist;
      });
    cy.get('form button')
      .then(($txt) => {
        const name = $txt.attr('name');
        expect(name).to.exist;
      });
  });

  it('All form controls should have appropriate labels and ID tags, for identification on the client', () => {
    cy.get('form textarea')
      .then(($txt) => {
        const id = $txt.attr('id');
        cy.get(`form label[for=${id}]`);
      });
    cy.get('form input')
      .each(($txt) => {
        const id = $txt.attr('id');
        cy.get(`form label[for=${id}]`);
      });
    cy.get('form button')
      .then(($txt) => {
        const id = $txt.attr('id');
        expect(id).to.exist;
      });
  });

  // CSS TESTS START HERE

  it('Your ul CSS - both .flex-outer and .flex-inner - should be set to flexbox display values', () => {
    cy.get('.flex-outer li').should('have.css', 'display', 'flex');
    cy.get('.flex-outer li').should('have.css', 'flex-wrap', 'wrap');
    cy.get('.flex-outer li').should('have.css', 'align-items', 'center');

    cy.get('.flex-inner').should('have.css', 'display', 'flex');
    cy.get('.flex-inner').should('have.css', 'flex-wrap', 'wrap');
    cy.get('.flex-inner').should('have.css', 'align-items', 'center');
  });

  it('Your .flex-outer element should have a constrained width and reset padding to fit nicely on a screen', () => {
    cy.get('.flex-outer').should(($ul) => {
      const style = window.getComputedStyle($ul[0]);
      expect(style.marginLeft).to.equal('0px');
      expect(style.marginLeft).to.equal(style.marginRight);
      expect(style.marginTop).to.equal(style.marginBottom);
    });
    cy.get('.flex-outer').should('have.css', 'max-width', '800px');
    cy.get('.flex-outer').should('have.css', 'padding', '0px 16px');
  });

  it('Your label CSS - p and label both - should be set to flex up to 130px, with a max width of 225px', () => {
    cy.get('.flex-outer > li > label').should('have.css', 'flex', '1 0 125px');
    cy.get('.flex-outer > li > label').should('have.css', 'max-width', '225px');

    cy.get('.flex-outer li p').should('have.css', 'flex', '1 0 125px');
    cy.get('.flex-outer li p').should('have.css', 'max-width', '225px');
  });

  it('Your CSS should let your form elements should stack vertically in a nice way', () => {
    cy.get('.flex-outer > li > label + *').should('have.css', 'flex', '1 0 225px');
    cy.get('.flex-inner').should('have.css', 'flex', '1 0 225px');
  });

  it('Your form button should be carefully styled to match these rules', () => {
    cy.get('.flex-outer > li > button').should('have.css', 'margin-left', '0px');
    cy.get('.flex-outer > li > button').should('have.css', 'padding', '6px 12px');
    cy.get('.flex-outer button').should('have.css', 'text-transform', 'uppercase');
    cy.get('.flex-outer button').should('have.css', 'letter-spacing', '1.2px');
    cy.get('.flex-outer button').should('have.css', 'border-radius', '3px');
  });

  it('Each checkbox should only take up 80px of width', () => {
    cy.get('.flex-inner li').should('have.css', 'width', '80px');
  });

  it('Your checkboxes should have space between them', () => {
    cy.get('.flex-inner').should('have.css', 'justify-content', 'space-between');
  });

  it('Your label elements should have enough padding to space out your form elements', () => {
    cy.get('.flex-outer > li > label').should('have.css', 'padding', '8px');
    cy.get('.flex-outer li p').should('have.css', 'padding', '8px');
  });

  it('Pick a nice color for your page background', () => {
    cy.get('body').then(($bdy) => {
      console.log($bdy);
      console.log($bdy.css('background-color'));
      expect($bdy.css('background-color')).to.not.equal('rgba(0, 0, 0, 0)');
    });
  });

  it('Should use the submit button to POST material to the /api endpoint', () => {
    cy.get('form').should('have.attr', 'method', 'post');
    cy.get('button[type=submit]')
      .click();
    cy.contains('hello world', { matchCase: false });
  });

  it('Should receive a string containing "Hello World" from the server - use res.send from Express docs for this', () => {
    cy.fixture('test_values').then((json) => {
      const labUrl = `${json.test_context || ''}/lab_4/`;
      cy.visit(labUrl);
      cy.get('button[type=submit]')
        .click();
      cy.contains('hello world', { matchCase: false });
    });
  });
});