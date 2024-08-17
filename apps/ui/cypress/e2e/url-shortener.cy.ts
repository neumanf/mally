describe('URL Shortener', () => {
    const PAGE_URL = '/url-shortener';
    const PAGE_TITLE_SELECTOR = '#page-title';
    const URL_INPUT_SELECTOR = '#url';
    const SUBMIT_SELECTOR = '#submit';
    const RESULT_SELECTOR = '#result';
    const SHORT_URL_SELECTOR = '#short-url';
    const EXPIRATION_DATE_SELECTOR = '#expiration-date';

    beforeEach(() => {
        cy.visit(PAGE_URL);
    });

    it('can access the URL Shortener', () => {
        cy.get(PAGE_TITLE_SELECTOR).contains('URL Shortener');
    });

    it('can submit a valid URL', () => {
        cy.get(RESULT_SELECTOR).should('not.exist');

        cy.get(URL_INPUT_SELECTOR).type('http://test.localhost');
        cy.get(SUBMIT_SELECTOR).click();

        cy.get(RESULT_SELECTOR).should('be.visible');
        cy.get('qrcode').should('be.visible');
        cy.get(SHORT_URL_SELECTOR).contains(/\w+\/s\/\w+/);
        cy.get(EXPIRATION_DATE_SELECTOR).contains(/\d{4}-\d{2}-\d{2}/);
    });

    it('cannot submit an invalid URL', () => {
        cy.get(URL_INPUT_SELECTOR).type('not an url');

        cy.get(SUBMIT_SELECTOR).should('not.be.enabled');
    });

    it('can redirect from a short URL to the original URL', () => {
        const originalUrl = 'http://localhost:4200/';

        cy.get(URL_INPUT_SELECTOR).type(originalUrl);
        cy.get(SUBMIT_SELECTOR).click();

        cy.get(SHORT_URL_SELECTOR).click();

        cy.url().should('eq', originalUrl);
    });
});
