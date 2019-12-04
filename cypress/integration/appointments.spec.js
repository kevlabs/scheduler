describe('Appointments', () => {

  beforeEach(() => {
    cy.request('GET', '/api/debug/reset')
    cy.visit("/");
    // wait for API data to be rendered
    cy.contains('Monday');
  });

  it('should book an interview', () => {

    cy.get('[data-testid=appointment]:nth-child(2)').as('second');

    // click add button
    cy.get('@second').find('[alt=Add]')
      .click();

    // input interview details and hit save 
    cy.get('@second').find('[data-testid=student-name-input]')
      .type('Lydia Miller-Jones');
    cy.get('@second').find('[alt=\'Sylvia Palmer\']')
      .click();
    cy.get('@second').contains('Save')
      .click();

    cy.get('@second').contains('Saving...');

    // confirm that the appointment details are displayed
    cy.get('@second').contains('Lydia Miller-Jones');
    cy.get('@second').contains('Sylvia Palmer');


  });

  it('should edit an interview', () => {

    cy.get('[data-testid=appointment]:first').as('first');

    // Click edit interview button
    cy.get('@first').find('[alt=Edit]')
      .click({force: true});

    // Change name + interviewer and hit save
    cy.get('@first').find('[data-testid=student-name-input]')
      .clear()
      .type('John Doe');
    cy.get('@first').find('[alt=\'Tori Malcolm\']')
      .click();
    cy.get('@first').contains('Save')
      .click();

    cy.get('@first').contains('Saving...');

    // check that view displays latest info
    cy.get('@first').contains('John Doe');
    cy.get('@first').contains('Tori Malcolm');

  });

  it('should cancel an interview', () => {

    cy.get('[data-testid=appointment]:first').as('first');

    // click cancel button
    cy.get('@first').find('[alt=Delete]')
      .click({force: true});

    cy.get('@first').contains('Confirm')
      .click();

    cy.get('@first').contains('Deleting...');

    // check that the interview has been replaced with the empty view
    cy.get('@first').find('[alt=Add]');

  });

});