import { Component } from '@angular/core';
import { page } from 'vitest/browser';
import { PrivacyPage } from './privacy.page';
import { PrivacyPageHarness } from '@critsource/legal-web/testing';
import { setupTestEnvironment } from '@critsource/ui-web/testing';

describe('PrivacyPage', () => {
    @Component({
        template: `<dma-privacy-page />`,
        imports: [PrivacyPage],
    })
    class TestComponent {}

    const sections = [
        'Who is responsible',
        'What we process',
        'What we don’t do',
        'Who else sees it',
        'Your rights',
        'Changes to this statement',
    ];

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: PrivacyPageHarness });

        return { harness };
    }

    it('should render its heading', async () => {
        const { harness } = await setupTest();

        expect(await harness.headingContents()).toEqual('Privacy');
    });

    it('should name the date it was last updated', async () => {
        const { harness } = await setupTest();
        const textPage = await harness.getTextPage();

        expect(await textPage.getText('date')).toBe('Last updated November 22, 2026');
        expect(await textPage.getDateTime()).toBe('2026-11-22');
    });

    it('should open with a summary titled In short', async () => {
        const { harness } = await setupTest();
        const summary = await harness.getSummary();

        expect(await summary.getTitle()).toBe('In short');
        expect(await summary.getPoints()).toHaveLength(4);
        await expect.element(page.getByRole('region', { name: 'In short', exact: true })).toBeInTheDocument();
    });

    it('should hold a section for each topic, in order', async () => {
        const { harness } = await setupTest();

        const prose = await (await harness.getTextPage()).getProse();

        expect(prose.filter(({ tag }) => tag === 'h2').map(({ text }) => text)).toEqual(sections);
    });

    it('should link to each section from On this page', async () => {
        const { harness } = await setupTest();

        const links = await (await harness.getOnThisPage()).getLinks();

        expect(await Promise.all(links.map((link) => link.getText()))).toEqual(sections);
        for (const link of document.querySelectorAll<HTMLAnchorElement>('a[dma-on-this-page-link]')) {
            expect(document.getElementById(link.hash.slice(1))?.localName, link.hash).toBe('h2');
        }
    });

    it('should list the data it processes in a table, a row each', async () => {
        const { harness } = await setupTest();
        const table = await harness.getDataTable();

        expect(await table.getCaption()).toBe('Data we process');
        expect((await table.getCells()).map(([data, , , keptFor]) => [data, keptFor])).toEqual([
            ['Data', 'Kept for'],
            ['Server logs', '14 days'],
            ['Bot check', '6 months, in your browser'],
            ['Theme choice', 'Until you pick System or clear your site data'],
            ['Emails to us', '1 year after your question is resolved'],
        ]);
    });

    it('should link to the support address by email', async () => {
        await setupTest();

        const links = page.getByRole('link', { name: 'support@critsource.com', exact: true }).elements();

        expect(links).toHaveLength(4);
        for (const link of links) {
            expect(link.getAttribute('href')).toBe('mailto:support@critsource.com');
        }
    });

    it('should link to the history of the statement on GitHub', async () => {
        await setupTest();

        await expect
            .element(page.getByRole('link', { name: 'See every change on GitHub', exact: true }))
            .toHaveAttribute(
                'href',
                'https://github.com/critsource/critsource/commits/main/packages/legal/web/src/privacy.page.html',
            );
    });
});
