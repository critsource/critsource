import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RootComponent } from './root.component';
import { RootHarness } from '../../testing';

describe('RootComponent', () => {
    @Component({
        selector: 'dma-test',
        template: `<dma-root />`,
        imports: [RootComponent],
    })
    class TestComponent {}

    @Component({
        selector: 'dma-test-page',
        template: `<p>page works!</p>`,
    })
    class TestPageComponent {}

    async function setupTest() {
        TestBed.configureTestingModule({
            imports: [TestComponent],
            providers: [provideRouter([{ path: '', component: TestPageComponent }])],
        });

        const fixture = TestBed.createComponent(TestComponent);
        const harnessLoader = TestbedHarnessEnvironment.loader(fixture);

        await TestBed.inject(Router).navigateByUrl('/');

        return {
            harness: await harnessLoader.getHarness(RootHarness),
        };
    }

    it('should render the page of the current route', async () => {
        const { harness } = await setupTest();

        expect(await (await harness.host()).text()).toEqual('page works!');
    });
});
