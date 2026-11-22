import { Component } from '@angular/core';
import { PrivacyPage } from './privacy.page';
import { PrivacyPageHarness } from '@critsource/legal-web/testing';
import { setupTestEnvironment } from '@critsource/ui-web/testing';

describe('PrivacyPage', () => {
    @Component({
        template: `<dma-privacy-page />`,
        imports: [PrivacyPage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: PrivacyPageHarness });

        return { harness };
    }

    it('should render its heading', async () => {
        const { harness } = await setupTest();

        expect(await harness.headingContents()).toEqual('Privacy');
    });
});
