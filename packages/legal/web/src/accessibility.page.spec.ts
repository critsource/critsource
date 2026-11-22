import { Component } from '@angular/core';
import { page } from 'vitest/browser';
import { AccessibilityPage } from './accessibility.page';
import { AccessibilityPageHarness } from '@critsource/legal-web/testing';
import { setupTestEnvironment } from '@critsource/ui-web/testing';

describe('AccessibilityPage', () => {
    @Component({
        template: `<dma-accessibility-page />`,
        imports: [AccessibilityPage],
    })
    class TestComponent {}

    const sections = [
        'Our goal',
        'What we’ve done',
        'Known issues',
        'How we test',
        'Report a barrier',
        'Changes to this statement',
    ];

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: AccessibilityPageHarness });

        return { harness };
    }

    it('should render its heading', async () => {
        const { harness } = await setupTest();

        expect(await harness.headingContents()).toEqual('Accessibility');
    });

    it('should name the date it was last updated', async () => {
        const { harness } = await setupTest();
        const textPage = await harness.getTextPage();

        expect(await textPage.getText('date')).toBe('Last updated November 22, 2026');
        expect(await textPage.getDateTime()).toBe('2026-11-22');
    });

    it('should open with the facts of its conformance, titled At a glance', async () => {
        const { harness } = await setupTest();

        expect(await (await harness.getSummary()).getTitle()).toBe('At a glance');
        expect(await (await harness.getFactsList()).getFacts()).toEqual([
            { term: 'Standard', value: 'WCAG 2.2, level AA' },
            { term: 'Status', value: 'Conformant: we know of no barriers.' },
            { term: 'Last checked', value: 'November 14, 2026' },
            { term: 'Method', value: 'Our own checks; no outside audit yet' },
        ]);
        await expect.element(page.getByRole('region', { name: 'At a glance', exact: true })).toBeInTheDocument();
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

    it('should link to the open accessibility issues on GitHub', async () => {
        await setupTest();

        await expect
            .element(page.getByRole('link', { name: 'accessibility label', exact: true }))
            .toHaveAttribute('href', 'https://github.com/critsource/critsource/labels/accessibility');
    });

    it('should offer to report a barrier by email first, then on GitHub', async () => {
        const { harness } = await setupTest();

        const buttons = await harness.getButtons();

        expect(await Promise.all(buttons.map((button) => button.getText()))).toEqual([
            'Email support',
            'Open an issue on GitHub',
        ]);
        await expect
            .element(page.getByRole('link', { name: 'Email support', exact: true }))
            .toHaveAttribute('href', 'mailto:support@critsource.com');
    });

    it('should open the accessibility form on GitHub, and warn that the issue is public', async () => {
        await setupTest();

        const link = page.getByRole('link', { name: 'Open an issue on GitHub', exact: true });

        await expect
            .element(link)
            .toHaveAttribute(
                'href',
                'https://github.com/critsource/critsource/issues/new?template=6-accessibility.yml',
            );
        await expect
            .element(link)
            .toHaveAccessibleDescription(
                'An issue on GitHub is public. Email us if you’d rather not share the details.',
            );
    });

    it('should link to the history of the statement on GitHub', async () => {
        await setupTest();

        await expect
            .element(page.getByRole('link', { name: 'See every change on GitHub', exact: true }))
            .toHaveAttribute(
                'href',
                'https://github.com/critsource/critsource/commits/main/packages/legal/web/src/accessibility.page.html',
            );
    });
});
