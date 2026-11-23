import { Component } from '@angular/core';
import { page } from 'vitest/browser';
import { LandingPage } from './landing.page';
import { type CallsToActionButtonBox, LandingPageHarness } from '@critsource/landing-web/testing';
import { readColorToken, setupTestEnvironment } from '@critsource/ui-web/testing';

/** The red, green, and blue channels of a color. */
type Rgb = [number, number, number];

/** The channels of a color that `getComputedStyle` returns, such as `'rgb(16, 20, 25)'`. */
function parseRgb(color: string): Rgb {
    const channels = (color.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);

    expect(channels, color).toHaveLength(3);
    return channels as Rgb;
}

/** The relative luminance of a color, as WCAG 2.2 defines it. */
function luminance(color: Rgb): number {
    const [red, green, blue] = color.map((channel) => {
        const value = channel / 255;

        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    }) as Rgb;

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/** The contrast ratio of two colors, as WCAG 2.2 defines it. */
function contrast(first: Rgb, second: Rgb): number {
    const luminances = [luminance(first), luminance(second)];

    return (Math.max(...luminances) + 0.05) / (Math.min(...luminances) + 0.05);
}

/** The color of the page where the glow is brightest: the accent color over the page, at the glow opacity. */
function readBrightestGlow(): Rgb {
    const opacity = Number(getComputedStyle(document.documentElement).getPropertyValue('--opacity-glow'));
    const background = parseRgb(readColorToken('--color-background-page'));
    const accent = parseRgb(readColorToken('--color-accent-default'));

    const mix = (channel: 0 | 1 | 2) => background[channel] * (1 - opacity) + accent[channel] * opacity;

    return [mix(0), mix(1), mix(2)];
}

/** The boxes of the star and idea buttons of the calls to action, in that order. */
async function getButtonBoxes(harness: LandingPageHarness): Promise<[CallsToActionButtonBox, CallsToActionButtonBox]> {
    const boxes = await (await harness.getCallsToAction()).getButtonBoxes();

    expect(boxes).toHaveLength(2);
    return boxes as [CallsToActionButtonBox, CallsToActionButtonBox];
}

describe('LandingPage', () => {
    @Component({
        template: `<dma-landing-page />`,
        imports: [LandingPage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: LandingPageHarness });

        return { harness };
    }

    const { innerWidth, innerHeight } = window;

    afterEach(async () => {
        delete document.documentElement.dataset['theme'];
        await page.viewport(innerWidth, innerHeight);
    });

    it('should say that there is nothing to try yet in a status chip', async () => {
        const { harness } = await setupTest();

        const chip = await harness.getChip();

        expect(await chip.getText()).toBe('In early development: nothing to try yet');
        expect((await chip.getLook()).borderColor).toBe(readColorToken('--color-border-control'));
    });

    it('should have one level 1 heading that says what Critsource is', async () => {
        const { harness } = await setupTest();

        expect(await harness.countHeadings()).toBe(1);
        expect(await harness.getText('heading')).toBe(
            'Prepare, play, and remember your 5e campaign in one open-source app',
        );
    });

    it('should list what the app holds in the lede', async () => {
        const { harness } = await setupTest();

        expect(await harness.getText('lede')).toBe(
            'Compendium, dice, characters, worlds, maps, session notes, and a virtual tabletop, for players and DMs.',
        );
    });

    it('should offer the calls to action', async () => {
        const { harness } = await setupTest();

        const buttons = await (await harness.getCallsToAction()).getButtons();

        expect(await Promise.all(buttons.map((button) => button.getText()))).toEqual([
            'Star Critsource on GitHub',
            'Share an idea in Discussions',
        ]);
    });

    it('should explain how to follow releases under the calls to action', async () => {
        const { harness } = await setupTest();

        expect(await harness.getText('hint')).toBe(
            'Want to hear when it launches? On GitHub, choose Watch, then Custom, then Releases.',
        );
    });

    it('should preview the app in the hero, starting on Play', async () => {
        const { harness } = await setupTest();

        expect(await (await (await harness.getPreview()).getTabList()).getSelectedLabel()).toBe('Play');
    });

    it('should follow the hero with the features section', async () => {
        const { harness } = await setupTest();

        expect(await (await harness.getFeatures()).getId()).toBe('features');
    });

    it('should follow the features section with the get-involved section', async () => {
        const { harness } = await setupTest();

        const intro = await (await harness.getGetInvolved()).getIntro();

        expect(await intro.getText('heading')).toBe('Help shape Critsource before it launches');
    });

    it('should follow the get-involved section with the FAQ', async () => {
        const { harness } = await setupTest();

        expect(await (await harness.getFaq()).getId()).toBe('faq');
    });

    it('should hide the glow from assistive technology', async () => {
        const { harness } = await setupTest();

        expect(await (await harness.getGlow()).getAriaHidden()).toBe('true');
    });

    it.each(['dark', 'light'])(
        'should keep the text at least 4.5:1 against the brightest point of the glow in the %s theme',
        async (theme) => {
            document.documentElement.dataset['theme'] = theme;
            const { harness } = await setupTest();
            const glow = readBrightestGlow();

            for (const text of ['heading', 'lede', 'hint'] as const) {
                const { color } = await harness.getTextLook(text);

                expect(contrast(parseRgb(color), glow), text).toBeGreaterThanOrEqual(4.5);
            }
        },
    );

    describe('on narrow screens', () => {
        beforeEach(async () => {
            await page.viewport(390, 844);
        });

        it('should set the heading at 34 px', async () => {
            const { harness } = await setupTest();

            expect((await harness.getTextLook('heading')).fontSize).toBe('34px');
        });

        it('should set the hint 20 px under the calls to action', async () => {
            const { harness } = await setupTest();

            expect(await harness.getHintOffset()).toBeCloseTo(20);
        });

        it('should set the preview below the text, 28 px under it and as wide', async () => {
            const { harness } = await setupTest();

            const [text, preview] = await Promise.all([harness.getTextBox(), (await harness.getPreview()).getBox()]);

            expect(preview.top - (text.top + text.height)).toBeCloseTo(28);
            expect(preview.left).toBe(text.left);
            expect(preview.width).toBe(text.width);
        });

        it('should keep the three tabs of the preview in one row, with no scroll buttons', async () => {
            const { harness } = await setupTest();

            const tabList = await (await harness.getPreview()).getTabList();

            expect(await tabList.isScrollable()).toBe(false);
            expect(await tabList.getScrollButtonEdges()).toEqual([]);
        });

        it('should stack the calls to action at full width, the primary first', async () => {
            const { harness } = await setupTest();

            const [width, [star, idea]] = await Promise.all([
                (await harness.getCallsToAction()).getWidth(),
                getButtonBoxes(harness),
            ]);

            expect(star).toMatchObject({ top: 0, width });
            expect(idea.top).toBeGreaterThan(star.top);
            expect(idea.width).toBe(width);
        });
    });

    describe('on wide screens', () => {
        beforeEach(async () => {
            await page.viewport(1440, 900);
        });

        it('should set the heading at 54 px', async () => {
            const { harness } = await setupTest();

            expect((await harness.getTextLook('heading')).fontSize).toBe('54px');
        });

        it('should set the hint 24 px under the calls to action', async () => {
            const { harness } = await setupTest();

            expect(await harness.getHintOffset()).toBeCloseTo(24);
        });

        it('should set the preview 64 px beside the text, centered on it', async () => {
            const { harness } = await setupTest();

            const [text, preview] = await Promise.all([harness.getTextBox(), (await harness.getPreview()).getBox()]);

            expect(text.width).toBe(580);
            expect(preview.left - (text.left + text.width)).toBeCloseTo(64);
            expect(preview.top + preview.height / 2).toBeCloseTo(text.top + text.height / 2, 0);
        });
    });
});
