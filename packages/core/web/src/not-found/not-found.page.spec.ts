import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { setupTestEnvironment } from '@critsource/ui-web/testing';
import { page } from 'vitest/browser';
import { NotFoundPage } from './not-found.page';
import { NotFoundPageHarness } from '../../testing';

describe('NotFoundPage', () => {
    @Component({
        template: `<dma-not-found-page />`,
        imports: [NotFoundPage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({
            host: TestComponent,
            harness: NotFoundPageHarness,
            providers: [provideRouter([])],
        });

        return { harness };
    }

    it('should render its heading', async () => {
        const { harness } = await setupTest();

        expect(await harness.headingContents()).toEqual('This page isn’t on the map');
    });

    it('should link home from a button', async () => {
        const { harness } = await setupTest();

        expect(await (await harness.getHomeButton()).getText()).toEqual('Go to the home page');
        await expect
            .element(page.getByRole('link', { name: 'Go to the home page', exact: true }))
            .toHaveAttribute('href', '/');
    });
});
