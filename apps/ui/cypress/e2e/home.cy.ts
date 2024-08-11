describe('Home', () => {
    it('can access homepage', () => {
        cy.visit('/');

        cy.get('[aria-label="logo"]').contains('Mally');
    });
});
