import { expect, test, type APIResponse } from '@playwright/test';

const headers = {
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'same-origin',
    'permissions-policy':
        'accelerometer=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
    'x-frame-options': 'DENY',
};

const files = [
    { path: '/', file: 'the prerendered landing page', status: 200 },
    { path: '/privacy', file: 'the prerendered Privacy page', status: 200 },
    { path: '/any/other/path', file: 'the Not found page', status: 404 },
    { path: '/build-info.json', file: 'build-info.json', status: 200 },
    { path: '/missing.js', file: 'a missing file', status: 404 },
];

/** Checks that the response carries every security header. */
function expectSecurityHeaders(response: APIResponse): void {
    const received = response.headersArray();

    for (const [name, value] of Object.entries(headers)) {
        // Each copy of the header must carry the value, since a proxy in front of the image may add one of its own.
        const values = received.filter((header) => header.name.toLowerCase() === name).map((header) => header.value);
        expect(new Set(values), name).toEqual(new Set([value]));
    }
}

test.describe('security headers', () => {
    for (const { path, file, status } of files) {
        test(`sends every header with ${file}`, async ({ request }) => {
            const response = await request.get(path);

            expect(response.status()).toBe(status);
            expectSecurityHeaders(response);
        });
    }

    test('sends every header with a bundle', async ({ request }) => {
        // The name of the bundle changes with each build, so the test reads it from the landing page.
        const html = await (await request.get('/')).text();
        const bundle = /<script src="(main-[\w-]+\.js)"/.exec(html)?.[1] ?? '';
        expect(bundle).not.toBe('');

        const response = await request.get(`/${bundle}`);

        expect(response.status()).toBe(200);
        expectSecurityHeaders(response);
    });
});
