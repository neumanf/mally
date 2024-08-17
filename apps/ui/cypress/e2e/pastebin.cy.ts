import { SYNTAXES } from '../../src/app/pastebin/pages/index/constants/syntaxes';

describe('URL Shortener', () => {
    const PAGE_URL = '/pastebin';
    const PAGE_TITLE_SELECTOR = '#page-title';
    const PASTE_URL_SELECTOR = '#paste-url';

    beforeEach(() => {
        cy.visit(PAGE_URL);
    });

    it('can access the URL Shortener', () => {
        cy.get(PAGE_TITLE_SELECTOR).contains('Pastebin');
    });

    it('can save a pastebin without encryption', () => {
        const textToBeSaved = 'const test = "test"';
        const pasteUrlRegex = /http:\/\/localhost:4200\/p\/\w+/;

        selectSyntaxAndTypeText('Typescript', textToBeSaved);
        cy.get('button').contains('Save').click();

        // Test saving a paste
        cy.get('qrcode').should('exist');
        cy.get('qrcode')
            .invoke('attr', 'ng-reflect-qrdata')
            .should('match', pasteUrlRegex);
        cy.get(PASTE_URL_SELECTOR)
            .invoke('attr', 'href')
            .should('match', pasteUrlRegex);

        // Test paste result
        cy.get(PASTE_URL_SELECTOR).click();
        cy.get('code').should('contain.text', textToBeSaved);
    });

    it('can save a pastebin with encryption', () => {
        const textToBeSaved = 'const test = "test"';
        const pasteUrlRegex = /http:\/\/localhost:4200\/p\/\w+/;
        const password = 'testPassword';

        selectSyntaxAndTypeText('Typescript', textToBeSaved);
        cy.get('p-checkbox[formcontrolname="encrypted"]').click();
        cy.get('p-password').type(password);
        cy.get('button').contains('Save').click();

        // Test saving a paste
        cy.get('qrcode').should('exist');
        cy.get('qrcode')
            .invoke('attr', 'ng-reflect-qrdata')
            .should('match', pasteUrlRegex);
        cy.get(PASTE_URL_SELECTOR)
            .invoke('attr', 'href')
            .should('match', pasteUrlRegex);

        // Test paste result
        cy.get(PASTE_URL_SELECTOR).click();
        cy.get('p-password').type(password);
        cy.get('p-button').contains('Decrypt').click();
        cy.get('code').should('contain.text', textToBeSaved);
    });

    // Generate tests for all syntaxes
    SYNTAXES.forEach(({ label }) => {
        it(`can preview ${label} syntax`, () => {
            selectSyntaxAndTypeText(label, 'test');
            cy.get('.p-button[aria-label="Preview"]').click();

            cy.get('code').should('contain.text', 'test');
        });
    });

    function selectSyntaxAndTypeText(syntaxLabel: string, text: string) {
        cy.get('p-dropdown[formcontrolname="syntax"]').click();
        cy.get(`p-dropdownitem[ng-reflect-label="${syntaxLabel}"]`).click();
        cy.get('textarea[formcontrolname="text"]').click().type(text);
    }
});
