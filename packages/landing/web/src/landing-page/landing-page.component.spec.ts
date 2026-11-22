import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';
import { LandingPageHarness } from '@critsource/landing-web/testing';

describe('LandingPageComponent', () => {
    @Component({
        template: `<dma-landing-page />`,
        imports: [LandingPageComponent],
    })
    class TestComponent {}

    it('should render the placeholder', async () => {
        TestBed.configureTestingModule({ imports: [TestComponent] });
        const harnessLoader = TestbedHarnessEnvironment.loader(TestBed.createComponent(TestComponent));

        const harness = await harnessLoader.getHarness(LandingPageHarness);

        expect(await harness.paragraphContents()).toEqual('landing works!');
    });
});
