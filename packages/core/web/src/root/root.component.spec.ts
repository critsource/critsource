import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { InMemoryStorage, provideBrowserStorage, setupTestEnvironment } from '@critsource/ui-web/testing';
import { page, userEvent } from 'vitest/browser';
import { RootComponent } from './root.component';
import { RootHarness } from '../../testing';

describe('RootComponent', () => {
    @Component({
        template: `<dma-root />`,
        imports: [RootComponent],
    })
    class TestComponent {}

    @Component({
        template: `<p>Routed page</p>`,
    })
    class RoutedPage {}

    const githubUrl = 'https://github.com/critsource/critsource';

    async function setupTest() {
        const { fixture, harness } = await setupTestEnvironment({
            host: TestComponent,
            harness: RootHarness,
            providers: [
                provideRouter([
                    { path: '', component: RoutedPage },
                    { path: 'privacy', component: RoutedPage },
                ]),
                provideBrowserStorage(new InMemoryStorage()),
            ],
        });

        await TestBed.inject(Router).navigateByUrl('/');
        await fixture.whenStable();

        return { fixture, harness };
    }

    const menuButton = () => page.getByRole('button', { name: 'Menu', exact: true });
    const closeButton = () => page.getByRole('button', { name: 'Close', exact: true });

    afterEach(async () => {
        await page.viewport(innerWidth, innerHeight);
    });

    describe('skip link', () => {
        it('should point at the main content', async () => {
            await setupTest();

            await expect
                .element(page.getByRole('link', { name: 'Skip to main content', exact: true }))
                .toHaveAttribute('href', '#main');
        });

        it('should be the first item to take keyboard focus', async () => {
            await setupTest();

            await userEvent.tab();

            await expect.element(page.getByRole('link', { name: 'Skip to main content', exact: true })).toHaveFocus();
        });

        it('should move focus to the main content', async () => {
            await setupTest();

            await userEvent.tab();
            await userEvent.keyboard('{Enter}');

            await expect.element(page.getByRole('main')).toHaveFocus();
        });
    });

    describe('header', () => {
        it('should link home from the logo', async () => {
            const { harness } = await setupTest();

            expect(await (await harness.getHeader()).getLogo()).not.toBeNull();
            await expect
                .element(page.getByRole('banner').getByRole('link', { name: 'Critsource', exact: true }))
                .toHaveAttribute('href', '/');
        });

        it('should link to GitHub from a button', async () => {
            const { harness } = await setupTest();
            await page.viewport(1440, 900);

            expect(await (await harness.getHeader()).getGitHubButton()).not.toBeNull();
            await expect
                .element(page.getByRole('banner').getByRole('link', { name: 'GitHub', exact: true }))
                .toHaveAttribute('href', githubUrl);
        });

        it('should hold the theme picker', async () => {
            const { harness } = await setupTest();
            await page.viewport(1440, 900);

            expect(await (await harness.getHeader()).isShown('theme')).toBe(true);
        });
    });

    describe('main', () => {
        it('should hold the routed page', async () => {
            const { harness } = await setupTest();

            expect(await (await harness.getMain()).text()).toBe('Routed page');
            await expect.element(page.getByRole('main').getByText('Routed page')).toBeInTheDocument();
        });

        it('should be the only main landmark', async () => {
            await setupTest();

            expect(document.querySelectorAll('main')).toHaveLength(1);
            expect(document.querySelector('main')?.id).toBe('main');
        });
    });

    describe('footer', () => {
        const privacyLink = () =>
            page.getByRole('navigation', { name: 'Legal', exact: true }).getByRole('link', { name: 'Privacy' });

        it('should hold the project group, then the legal group', async () => {
            const { harness } = await setupTest();

            const groups = await harness.getLinkGroups();

            expect(await Promise.all(groups.map((group) => group.getHeadingText()))).toEqual(['Project', 'Legal']);
        });

        it('should link to GitHub from the project group', async () => {
            await setupTest();

            await expect
                .element(page.getByRole('navigation', { name: 'Project', exact: true }).getByRole('link'))
                .toHaveAttribute('href', githubUrl);
        });

        it('should link to the Privacy page from the legal group', async () => {
            await setupTest();

            await expect.element(privacyLink()).toHaveAttribute('href', '/privacy');
            await expect.element(privacyLink()).not.toHaveAttribute('aria-current');
        });

        it('should mark the Privacy link as the current page on the Privacy page', async () => {
            const { fixture } = await setupTest();

            await TestBed.inject(Router).navigateByUrl('/privacy');
            await fixture.whenStable();

            await expect.element(privacyLink()).toHaveAttribute('aria-current', 'page');
        });
    });

    describe('mobile menu', () => {
        beforeEach(async () => {
            await page.viewport(375, 812);
        });

        it('should stay closed until the reader presses the Menu button', async () => {
            const { harness } = await setupTest();

            expect(await (await harness.getMobileMenu()).isOpen()).toBe(false);
        });

        it('should open when the reader presses the Menu button', async () => {
            const { harness } = await setupTest();

            await (await harness.getHeader()).pressMenu();

            expect(await (await harness.getMobileMenu()).isOpen()).toBe(true);
            await expect.element(page.getByRole('dialog', { name: 'Menu', exact: true })).toBeInTheDocument();
        });

        it('should return focus to the Menu button when it closes', async () => {
            const { harness } = await setupTest();
            await (await harness.getHeader()).pressMenu();

            await userEvent.click(closeButton());

            expect(await (await harness.getMobileMenu()).isOpen()).toBe(false);
            await expect.element(menuButton()).toHaveFocus();
        });

        it('should link to GitHub from a button', async () => {
            const { harness } = await setupTest();
            await (await harness.getHeader()).pressMenu();

            expect(await (await harness.getMobileMenu()).getGithubButton()).toBeDefined();
            await expect
                .element(page.getByRole('dialog').getByRole('link', { name: 'GitHub', exact: true }))
                .toHaveAttribute('href', githubUrl);
        });

        it('should close when the reader follows the link home', async () => {
            const { harness } = await setupTest();
            await (await harness.getHeader()).pressMenu();

            await userEvent.click(page.getByRole('dialog').getByRole('link', { name: 'Critsource', exact: true }));

            expect(await (await harness.getMobileMenu()).isOpen()).toBe(false);
        });
    });
});
