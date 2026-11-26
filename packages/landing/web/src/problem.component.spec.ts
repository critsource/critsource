import { type ElementDimensions } from '@angular/cdk/testing';
import { Component } from '@angular/core';
import { page } from 'vitest/browser';
import { ProblemComponent } from './problem.component';
import { ProblemHarness } from '@critsource/landing-web/testing';
import { readColorToken, setupTestEnvironment } from '@critsource/ui-web/testing';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/** The tools of the section, in the order they draw. */
const TOOLS = ['Rules compendium', 'Character sheets', 'World notes', 'Virtual tabletop'];

type ToolBoxes = [ElementDimensions, ElementDimensions, ElementDimensions, ElementDimensions];

/** The four boxes of the tools, in order. */
async function getToolBoxes(harness: ProblemHarness): Promise<ToolBoxes> {
    const boxes = await harness.getToolBoxes();

    expect(boxes).toHaveLength(4);
    return boxes as ToolBoxes;
}

/** Each box of a row with the box before it, from the second box on. */
function getNeighbors(boxes: ElementDimensions[]): [previous: ElementDimensions, box: ElementDimensions][] {
    return boxes.flatMap((box, index) => {
        const previous = boxes[index - 1];

        return previous ? [[previous, box]] : [];
    });
}

describe('ProblemComponent', () => {
    @Component({
        template: `<dma-problem />`,
        imports: [ProblemComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: ProblemHarness });

        return { harness };
    }

    const { innerWidth, innerHeight } = window;

    afterEach(async () => {
        delete document.documentElement.dataset['theme'];
        await page.viewport(innerWidth, innerHeight);
    });

    it('should introduce the section with a level 2 heading', async () => {
        const { harness } = await setupTest();

        const intro = await harness.getIntro();

        expect(await intro.getText('eyebrow')).toBe('Why Critsource');
        expect(await intro.getText('heading')).toBe('Your game is spread across four tabs');
        expect(await intro.getText('intro')).toBe(
            'The rules live in one app, characters in another, your world’s lore in a third, and the table in a fourth. Critsource brings them together, so what you prepare is there when you play.',
        );
        await expect.element(page.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should name no competitor', async () => {
        const { harness } = await setupTest();

        const text = await (await harness.getSection()).getText();

        expect(text).not.toMatch(/roll20|d&d beyond|foundry|fantasy grounds|notion|obsidian|owlbear/i);
    });

    it.each(['dark', 'light'])('should draw the section on the surface background in the %s theme', async (theme) => {
        document.documentElement.dataset['theme'] = theme;
        const { harness } = await setupTest();

        const { background } = await (await harness.getSection()).getLook();

        expect(background).toBe(readColorToken('--color-background-surface'));
    });

    it('should name the four tools in chips, in the order of the intro', async () => {
        const { harness } = await setupTest();

        const tools = await harness.getTools();

        expect(await Promise.all(tools.map((tool) => tool.getText()))).toEqual(TOOLS);
    });

    it.each(['dark', 'light'])(
        'should draw the tools raised, with no border and muted text in the %s theme',
        async (theme) => {
            document.documentElement.dataset['theme'] = theme;
            const { harness } = await setupTest();

            const looks = await Promise.all((await harness.getTools()).map((tool) => tool.getLook()));

            expect(looks).toEqual(
                Array(4).fill({
                    background: readColorToken('--color-background-raised'),
                    borderColor: TRANSPARENT,
                    color: readColorToken('--color-foreground-muted'),
                }),
            );
        },
    );

    it.each(['dark', 'light'])(
        'should highlight the result with an accent border and no fill in the %s theme',
        async (theme) => {
            document.documentElement.dataset['theme'] = theme;
            const { harness } = await setupTest();

            const result = await harness.getResult();

            expect(await result.getText()).toBe('Critsource: all four in one place');
            expect(await result.getLook()).toEqual({
                background: TRANSPARENT,
                borderColor: readColorToken('--color-accent-text'),
                color: readColorToken('--color-foreground-default'),
            });
        },
    );

    it('should show one arrow only', async () => {
        const { harness } = await setupTest();

        expect(await harness.getVisibleArrow()).not.toBeNull();
    });

    describe('on narrow screens', () => {
        beforeEach(async () => {
            await page.viewport(390, 844);
        });

        it('should wrap the four tools onto two lines, 8 px apart, inside the content', async () => {
            const { harness } = await setupTest();

            const [rules, characters, world, tabletop] = await getToolBoxes(harness);

            expect(characters.top).toBe(rules.top);
            expect(tabletop.top).toBe(world.top);
            expect(world.top - (rules.top + rules.height)).toBeCloseTo(8);
            expect(characters.left - (rules.left + rules.width)).toBeCloseTo(8);
            expect(tabletop.left - (world.left + world.width)).toBeCloseTo(8);
            expect(characters.left + characters.width).toBeLessThanOrEqual(window.innerWidth - 20);
        });

        it('should pad the tools 12 by 16 px', async () => {
            const { harness } = await setupTest();

            expect(await harness.getToolSpacing()).toEqual({ block: 12, inline: 16 });
        });

        it('should point the arrow down, centered between the tools and the result', async () => {
            const { harness } = await setupTest();

            const [tools, arrow, result] = await Promise.all([
                getToolBoxes(harness),
                harness.getArrowBox(),
                harness.getResultBox(),
            ]);
            const last = tools[3];

            expect(await harness.getVisibleArrow()).toBe('arrow-down');
            expect(arrow.top - (last.top + last.height)).toBeCloseTo(12);
            expect(arrow.left + arrow.width / 2).toBeCloseTo(window.innerWidth / 2);
            expect(result.top - (arrow.top + arrow.height)).toBeCloseTo(12);
        });

        it('should fill the content with the result, and center its text', async () => {
            const { harness } = await setupTest();

            const box = await harness.getResultBox();

            expect(box.left).toBe(20);
            expect(box.width).toBeCloseTo(window.innerWidth - 40);
            expect(await harness.getResultAlignment()).toBe('center');
        });
    });

    describe('on wide screens', () => {
        beforeEach(async () => {
            await page.viewport(1440, 900);
        });

        it('should pad the tools 12 by 20 px', async () => {
            const { harness } = await setupTest();

            expect(await harness.getToolSpacing()).toEqual({ block: 12, inline: 20 });
        });

        it('should set the tools in one row, 12 px apart, each 42 px high', async () => {
            const { harness } = await setupTest();

            const boxes = await getToolBoxes(harness);

            expect(new Set(boxes.map(({ top }) => top)).size).toBe(1);
            expect(boxes.map(({ height }) => height)).toEqual([42, 42, 42, 42]);
            for (const [previous, box] of getNeighbors(boxes)) {
                expect(box.left - (previous.left + previous.width)).toBeCloseTo(12);
            }
        });

        it('should point the arrow right, between the tools and the result, centered on them', async () => {
            const { harness } = await setupTest();

            const [tools, arrow, result] = await Promise.all([
                getToolBoxes(harness),
                harness.getArrowBox(),
                harness.getResultBox(),
            ]);
            const last = tools[3];

            expect(await harness.getVisibleArrow()).toBe('arrow-right');
            expect(arrow.left - (last.left + last.width)).toBeCloseTo(12);
            expect(result.left - (arrow.left + arrow.width)).toBeCloseTo(12);
            expect(arrow.top + arrow.height / 2).toBeCloseTo(last.top + last.height / 2);
            expect(result.top).toBe(last.top);
        });
    });
});
