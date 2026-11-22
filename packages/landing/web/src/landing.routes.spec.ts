import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { landingRoutes } from './landing.routes';
import { LandingPageHarness } from '@critsource/landing-web/testing';

describe('landingRoutes', () => {
    it('should render the landing page at the root of the routes', async () => {
        TestBed.configureTestingModule({ providers: [provideRouter(landingRoutes)] });
        const router = await RouterTestingHarness.create('/');

        const harness = await TestbedHarnessEnvironment.loader(router.fixture).getHarness(LandingPageHarness);

        expect(await harness.paragraphContents()).toEqual('landing works!');
    });
});
