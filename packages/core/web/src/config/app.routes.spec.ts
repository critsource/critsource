import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { NotFoundPage } from '../not-found/not-found.page';

describe('routes', () => {
    async function navigate(url: string) {
        TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
        const harness = await RouterTestingHarness.create();
        const component = await harness.navigateByUrl(url);

        return { component, title: TestBed.inject(Title).getTitle() };
    }

    it.each(['/does-not-exist', '/does/not/exist', '/not-found'])(
        'should show the Not found page at %s with its title',
        async (url) => {
            const { component, title } = await navigate(url);

            expect(component).toBeInstanceOf(NotFoundPage);
            expect(title).toEqual('Page not found - Critsource');
        },
    );

    it('should leave the landing page at the root to landing-web', async () => {
        const { component } = await navigate('/');

        expect(component).not.toBeInstanceOf(NotFoundPage);
    });
});
