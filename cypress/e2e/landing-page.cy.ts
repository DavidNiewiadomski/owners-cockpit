
describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays hero section correctly', () => {
    cy.get('h1').contains('Owners Cockpit').should('be.visible');
    cy.get('button').contains('Get Started').should('be.visible');
    cy.get('button').contains('Learn More').should('be.visible');
    cy.get('[aria-label="Scroll to features"]').should('be.visible');
  });

  it('navigates to app on Get Started click', () => {
    cy.get('button').contains('Get Started').click();
    cy.url().should('include', '/app');
  });

  it('scrolls to features on Learn More click', () => {
    cy.get('button').contains('Learn More').click();
    cy.get('#features').should('be.visible');
    cy.get('h2').contains('Intelligent Construction Management').should('be.visible');
  });

  it('scrolls to features on arrow button click', () => {
    cy.get('[aria-label="Scroll to features"]').click();
    cy.get('#features').should('be.visible');
  });

  it('displays features section with cards', () => {
    cy.scrollTo(0, 800);
    cy.get('#features').should('be.visible');
    cy.contains('Lifecycle Coverage').should('be.visible');
    cy.contains('Role-Aware AI').should('be.visible');
    cy.contains('Voice Commands').should('be.visible');
  });

  it('handles responsive design on mobile', () => {
    cy.viewport(375, 667);
    cy.get('h1').should('be.visible');
    cy.get('button').contains('Get Started').should('be.visible');
    cy.get('button').contains('Learn More').should('be.visible');
  });

  it('has proper accessibility attributes', () => {
    cy.get('[aria-label="Scroll to features"]').should('exist');
    cy.get('button').should('have.attr', 'type');
  });

  // Visual regression test
  it('matches visual snapshot', () => {
    cy.get('h1').should('be.visible');
    cy.matchImageSnapshot('hero-section');
    
    cy.scrollTo(0, 800);
    cy.get('#features').should('be.visible');
    cy.matchImageSnapshot('features-section');
  });
});
