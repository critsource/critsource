import { type ElementDimensions } from '@angular/cdk/testing';
import { Component } from '@angular/core';
import { page } from 'vitest/browser';
import { GetInvolvedComponent } from './get-involved.component';
import { type GetInvolvedCardHarness, GetInvolvedHarness } from '@critsource/landing-web/testing';
import { readColorToken, setupTestEnvironment } from '@critsource/ui-web/testing';

/** The Follow the project, Share an idea, and Help build it cards, in that order. */
async function getCards(
    harness: GetInvolvedHarness,
): Promise<[GetInvolvedCardHarness, GetInvolvedCardHarness, GetInvolvedCardHarness]> {
    const cards = await harness.getCards();

    expect(cards).toHaveLength(3);
    return cards as [GetInvolvedCardHarness, GetInvolvedCardHarness, GetInvolvedCardHarness];
}

/** The boxes of the three cards, in order. */
async function getCardBoxes(
    harness: GetInvolvedHarness,
): Promise<[ElementDimensions, ElementDimensions, ElementDimensions]> {
    const boxes = await Promise.all((await getCards(harness)).map(async (card) => (await card.getBoxes()).card));

    return boxes as [ElementDimensions, ElementDimensions, ElementDimensions];
}

/** The boxes of the Follow the project card, its Star button, and the hint under it. */
async function getFollowBoxes(
    harness: GetInvolvedHarness,
): Promise<{ card: ElementDimensions; button: ElementDimensions; hint: ElementDimensions }> {
    const [follow] = await getCards(harness);
    const { card, button, hint } = await follow.getBoxes();

    if (!button || !hint) {
        throw new Error('The Follow the project card has no button or no hint.');
    }
    return { card, button, hint };
}

describe('GetInvolvedComponent', () => {
    @Component({
        template: `<dma-get-involved />`,
        imports: [GetInvolvedComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: GetInvolvedHarness });

        return { harness };
    }

    const { innerWidth, innerHeight } = window;

    afterEach(async () => {
        await page.viewport(innerWidth, innerHeight);
    });

    it('should introduce the section with a level 2 heading', async () => {
        const { harness } = await setupTest();

        const intro = await harness.getIntro();

        expect(await intro.getText('eyebrow')).toBe('Get involved');
        expect(await intro.getText('heading')).toBe('Help shape Critsource before it launches');
        expect(await intro.getText('intro')).toBe(
            'There’s nothing to play yet, but you can follow along and tell us what your table needs.',
        );
        await expect.element(page.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should offer three ways to take part, each under a level 3 heading', async () => {
        const { harness } = await setupTest();

        const cards = await Promise.all(
            (await getCards(harness)).map(async (card) => ({
                heading: await card.getHeading(),
                text: await card.getText(),
            })),
        );

        expect(cards).toEqual([
            {
                heading: { text: 'Follow the project', level: 3 },
                text: 'Star the repository, and watch its releases to hear when the first feature ships.',
            },
            {
                heading: { text: 'Share an idea', level: 3 },
                text: 'Ask a question or suggest a feature in GitHub Discussions. Real questions become this page’s FAQ.',
            },
            {
                heading: { text: 'Help build it', level: 3 },
                text: 'Code, design, docs, or testing: the contributing guide explains where to start.',
            },
        ]);
    });

    it('should link the primary Star button to the repository, with the watch hint', async () => {
        const { harness } = await setupTest();

        const [follow] = await getCards(harness);
        const [star] = await follow.getButtons();

        expect(await star?.getText()).toBe('Star Critsource on GitHub');
        expect((await star?.getLook())?.background).toBe(readColorToken('--color-accent-default'));
        expect(await follow.getHrefs()).toEqual(['https://github.com/critsource/critsource']);
        expect(await follow.getHint()).toBe('Watch, then Custom, then Releases');
    });

    it('should set the hint in the caption size and the muted color', async () => {
        const { harness } = await setupTest();

        const [follow] = await getCards(harness);

        expect(await follow.getTextLook('hint')).toEqual({
            color: readColorToken('--color-foreground-muted'),
            fontSize: '13px',
        });
    });

    it('should link the secondary Open Discussions button to Discussions', async () => {
        const { harness } = await setupTest();

        const [, share] = await getCards(harness);
        const [discussions] = await share.getButtons();

        expect(await discussions?.getText()).toBe('Open Discussions');
        expect((await discussions?.getLook())?.borderColor).toBe(readColorToken('--color-border-strong'));
        expect(await share.getHrefs()).toEqual(['https://github.com/critsource/critsource/discussions']);
        expect(await share.getHint()).toBeNull();
    });

    it('should link to the contributing guide and the code of conduct with standalone links', async () => {
        const { harness } = await setupTest();

        const [, , build] = await getCards(harness);
        const links = await build.getLinks();

        expect(await build.getButtons()).toEqual([]);
        expect(await Promise.all(links.map((link) => link.getText()))).toEqual([
            'Read the contributing guide',
            'Read the code of conduct',
        ]);
        expect(await Promise.all(links.map((link) => link.hasArrow()))).toEqual([true, true]);
        expect(await build.getHrefs()).toEqual([
            'https://github.com/critsource/critsource/blob/main/CONTRIBUTING.md',
            'https://github.com/critsource/critsource/blob/main/CODE_OF_CONDUCT.md',
        ]);
    });

    it('should collect no personal data, so it has no form', async () => {
        const { harness } = await setupTest();

        expect(await harness.countFormControls()).toBe(0);
    });

    describe('on narrow screens', () => {
        beforeEach(async () => {
            await page.viewport(390, 844);
        });

        it('should stack the cards 12 px apart at the same width', async () => {
            const { harness } = await setupTest();

            const [follow, share, build] = await getCardBoxes(harness);

            expect(share.top - (follow.top + follow.height)).toBeCloseTo(12);
            expect(build.top - (share.top + share.height)).toBeCloseTo(12);
            expect([share.left, build.left]).toEqual([follow.left, follow.left]);
            expect([share.width, build.width]).toEqual([follow.width, follow.width]);
        });

        it('should fill the card with the Star button, and keep the hint 12 px under it', async () => {
            const { harness } = await setupTest();

            const { card, button, hint } = await getFollowBoxes(harness);

            expect(button.width).toBeCloseTo(card.width - 40);
            expect(hint.top - (button.top + button.height)).toBeCloseTo(12);
        });
    });

    describe('on wide screens', () => {
        beforeEach(async () => {
            await page.viewport(1440, 900);
        });

        it('should set the cards side by side 24 px apart, at the same width and height', async () => {
            const { harness } = await setupTest();

            const [follow, share, build] = await getCardBoxes(harness);

            expect(share.left - (follow.left + follow.width)).toBeCloseTo(24);
            expect(build.left - (share.left + share.width)).toBeCloseTo(24);
            expect([share.top, build.top]).toEqual([follow.top, follow.top]);
            expect([share.width, build.width]).toEqual([follow.width, follow.width]);
            expect([share.height, build.height]).toEqual([follow.height, follow.height]);
        });

        it('should fit the Star button to its label, and keep the hint 16 px under it', async () => {
            const { harness } = await setupTest();

            const { card, button, hint } = await getFollowBoxes(harness);

            expect(button.width).toBeLessThan(card.width - 56);
            expect(hint.top - (button.top + button.height)).toBeCloseTo(16);
        });
    });
});
