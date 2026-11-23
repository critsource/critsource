import { type ElementDimensions } from '@angular/cdk/testing';
import { Component } from '@angular/core';
import { page } from 'vitest/browser';
import { FeaturesComponent } from './features.component';
import {
    type FeatureGroupHarness,
    type FeatureItemHarness,
    type FeaturePreviewHarness,
    FeaturesHarness,
} from '@critsource/landing-web/testing';
import { readColorToken, setupTestEnvironment } from '@critsource/ui-web/testing';

/** The item of a group that holds the DM chip. */
const DM_ITEM = 'Build encounters and custom monsters';

/** What the preview of each group shows, in the order of the groups, as Penpot draws it. */
const PREVIEWS = [
    {
        group: 'Prepare',
        title: 'Fireball',
        context: '3rd-level evocation',
        stats: [
            { term: 'Casting time', value: '1 action' },
            { term: 'Range', value: '150 feet' },
            { term: 'Damage', value: '8d6 fire' },
        ],
        roll: null,
        note: null,
    },
    {
        group: 'Play',
        title: 'Fireball damage',
        context: 'Rolled by Borin, seen by the party',
        stats: [],
        roll: { command: '/roll 8d6', result: '28 fire' },
        note: null,
    },
    {
        group: 'Remember',
        title: 'Session 12',
        context: 'The Sunken Keep · shared with the party',
        stats: [],
        roll: null,
        note: 'The party struck a deal with the river hag: safe passage in exchange for the silver bell.',
    },
];

/** What a preview shows, read the way `PREVIEWS` spells it. */
async function readPreview(preview: FeaturePreviewHarness) {
    const [title, context, stats, roll, note] = await Promise.all([
        preview.getTitle(),
        preview.getContext(),
        preview.getStats(),
        preview.getRoll(),
        preview.getNote(),
    ]);

    return { title, context, stats, roll, note };
}

/** The previews of the Prepare, Play, and Remember groups, in that order. */
async function getPreviews(
    harness: FeaturesHarness,
): Promise<[FeaturePreviewHarness, FeaturePreviewHarness, FeaturePreviewHarness]> {
    const previews = await Promise.all((await harness.getGroups()).map((group) => group.getPreview()));

    expect(previews).toHaveLength(3);
    return previews as [FeaturePreviewHarness, FeaturePreviewHarness, FeaturePreviewHarness];
}

/** The eyebrow, heading, and item texts of a group, as Penpot lists them. */
async function readGroup(group: FeatureGroupHarness) {
    const [eyebrow, heading, items] = await Promise.all([group.getEyebrow(), group.getHeading(), group.getItems()]);

    return { eyebrow, heading, items: await Promise.all(items.map((item) => item.getText())) };
}

/** The boxes of the Prepare, Play, and Remember groups, in that order. */
async function getGroupBoxes(
    harness: FeaturesHarness,
): Promise<[ElementDimensions, ElementDimensions, ElementDimensions]> {
    const boxes = await Promise.all((await harness.getGroups()).map((group) => group.getBox()));

    expect(boxes).toHaveLength(3);
    return boxes as [ElementDimensions, ElementDimensions, ElementDimensions];
}

/** The item that holds the DM chip. */
async function getDmItem(harness: FeaturesHarness): Promise<FeatureItemHarness> {
    const items = (await Promise.all((await harness.getGroups()).map((group) => group.getItems()))).flat();
    const texts = await Promise.all(items.map((item) => item.getText()));
    const item = items[texts.indexOf(DM_ITEM)];

    if (!item) {
        throw new Error(`No item reads "${DM_ITEM}".`);
    }
    return item;
}

/** The boxes of the item that holds the DM chip, its text, and the chip. */
async function getDmBoxes(
    harness: FeaturesHarness,
): Promise<{ item: ElementDimensions; text: ElementDimensions; chip: ElementDimensions }> {
    const { item, text, chip } = await (await getDmItem(harness)).getBoxes();

    if (!chip) {
        throw new Error(`"${DM_ITEM}" has no chip.`);
    }
    return { item, text, chip };
}

describe('FeaturesComponent', () => {
    @Component({
        template: `<dma-features />`,
        imports: [FeaturesComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: FeaturesHarness });

        return { harness };
    }

    const { innerWidth, innerHeight } = window;

    afterEach(async () => {
        delete document.documentElement.dataset['theme'];
        await page.viewport(innerWidth, innerHeight);
    });

    it('should take the features id, which the header links to', async () => {
        const { harness } = await setupTest();

        expect(await harness.getId()).toBe('features');
    });

    it('should introduce the section with a level 2 heading', async () => {
        const { harness } = await setupTest();

        const intro = await harness.getIntro();

        expect(await intro.getText('eyebrow')).toBe('Features');
        expect(await intro.getText('heading')).toBe('Everything for the game, from prep to the last session');
        expect(await intro.getText('intro')).toBe(
            'Grouped by when you use them. Tools marked DM are for dungeon masters; everything else is open to all players.',
        );
        await expect.element(page.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should group the features by when in the game you use them, each under a level 3 heading', async () => {
        const { harness } = await setupTest();

        const groups = await Promise.all((await harness.getGroups()).map(readGroup));

        expect(groups).toEqual([
            {
                eyebrow: 'Before the session',
                heading: { text: 'Prepare', level: 3 },
                items: [
                    'Build worlds and write their lore',
                    'Draw maps of worlds and their locations',
                    'Create characters and keep spell books',
                    DM_ITEM,
                ],
            },
            {
                eyebrow: 'At the table',
                heading: { text: 'Play', level: 3 },
                items: [
                    'Run sessions on a virtual tabletop',
                    'Roll dice where everyone can see them',
                    'Look up any rule in the compendium',
                    'Track combat with a 5e rules engine',
                ],
            },
            {
                eyebrow: 'After the session',
                heading: { text: 'Remember', level: 3 },
                items: [
                    'Keep notes of every session',
                    'Manage campaigns and their sessions',
                    'Share worlds, maps, and notes with your party',
                    'Make any of them public',
                ],
            },
        ]);
    });

    it('should list the items of each group as a list', async () => {
        await setupTest();

        expect(page.getByRole('list').all()).toHaveLength(3);
        expect(page.getByRole('listitem').all()).toHaveLength(12);
    });

    it('should mark only the tool for dungeon masters with a DM chip, in text', async () => {
        const { harness } = await setupTest();

        const items = (await Promise.all((await harness.getGroups()).map((group) => group.getItems()))).flat();
        const chips = await Promise.all(
            items.map(async (item) => [await item.getText(), await (await item.getChip())?.getText()]),
        );

        expect(chips.filter(([, chip]) => chip !== undefined)).toEqual([[DM_ITEM, 'DM']]);
    });

    it('should draw the DM chip as the DM kind', async () => {
        const { harness } = await setupTest();

        const chip = await (await getDmItem(harness)).getChip();

        expect(chip).not.toBeNull();
        expect((await chip?.getLook())?.background).toBe(readColorToken('--color-secondary-default'));
    });

    it('should link to the planned features in the README', async () => {
        const { harness } = await setupTest();

        const link = await harness.getLink();

        expect(await link.getText()).toBe('See every planned feature in the README');
        expect(await link.hasArrow()).toBe(true);
        expect(await harness.getLinkHref()).toBe('https://github.com/critsource/critsource#features');
    });

    it.each(PREVIEWS)('should preview $title under the items of $group', async ({ group, ...expected }) => {
        const { harness } = await setupTest();

        const groups = await harness.getGroups();
        const headings = await Promise.all(groups.map(async (each) => (await each.getHeading()).text));
        const preview = await groups[headings.indexOf(group)]?.getPreview();

        if (!preview) {
            throw new Error(`The ${group} group has no preview.`);
        }
        expect(await readPreview(preview)).toEqual(expected);
    });

    it('should mark every preview as a concept, in text', async () => {
        const { harness } = await setupTest();

        const texts = await Promise.all(
            (await getPreviews(harness)).map(async (preview) => await (await preview.getConcept()).getText()),
        );

        expect(texts).toEqual(['Concept', 'Concept', 'Concept']);
    });

    it('should leave each stat of the spell to assistive technology as a term and its definition', async () => {
        await setupTest();

        const terms = page.getByRole('term');
        const definitions = page.getByRole('definition');

        expect(terms.all()).toHaveLength(3);
        for (const [index, { term, value }] of PREVIEWS[0]?.stats.entries() ?? []) {
            await expect.element(terms.nth(index)).toHaveTextContent(term);
            await expect.element(definitions.nth(index)).toHaveTextContent(value);
        }
    });

    it('should set each preview 16 px under the items of its group', async () => {
        const { harness } = await setupTest();

        for (const group of await harness.getGroups()) {
            const [list, preview] = await Promise.all([
                group.getListBox(),
                group.getPreview().then(async (each) => await each.getBox()),
            ]);

            expect(preview.top - (list.top + list.height)).toBeCloseTo(16);
        }
    });

    it.each(['dark', 'light'])('should draw the previews in the colors of the %s theme', async (theme) => {
        document.documentElement.dataset['theme'] = theme;
        const { harness } = await setupTest();
        const [prepare, play, remember] = await getPreviews(harness);

        const [looks, roll, result] = await Promise.all([
            Promise.all([prepare, play, remember].map(async (preview) => await preview.getLook())),
            play.getLook('roll'),
            play.getLook('result'),
        ]);

        expect(looks.map(({ background }) => background)).toEqual(
            Array(3).fill(readColorToken('--color-background-raised')),
        );
        expect(roll.background).toBe(readColorToken('--color-background-sunken'));
        expect(result.color).toBe(readColorToken('--color-accent-text'));
    });

    describe('on narrow screens', () => {
        beforeEach(async () => {
            await page.viewport(390, 844);
        });

        it('should pad each preview 16 px, with its parts 12 px apart', async () => {
            const { harness } = await setupTest();

            const spacings = await Promise.all((await getPreviews(harness)).map((preview) => preview.getSpacing()));

            expect(spacings).toEqual(Array(3).fill({ paddingBlock: 16, paddingInline: 16, gap: 12 }));
        });

        it('should pad the roll box 12 px', async () => {
            const { harness } = await setupTest();
            const [, play] = await getPreviews(harness);

            const { paddingBlock, paddingInline } = await play.getSpacing('roll');

            expect({ paddingBlock, paddingInline }).toEqual({ paddingBlock: 12, paddingInline: 12 });
        });

        it('should stack the groups 16 px apart in the order of the game', async () => {
            const { harness } = await setupTest();

            const [prepare, play, remember] = await getGroupBoxes(harness);

            expect(play.left).toBe(prepare.left);
            expect(remember.left).toBe(prepare.left);
            expect(play.top - (prepare.top + prepare.height)).toBeCloseTo(16);
            expect(remember.top - (play.top + play.height)).toBeCloseTo(16);
        });

        it('should set the DM chip 8 px after the text of its item, on its first line', async () => {
            const { harness } = await setupTest();

            const { text, chip } = await getDmBoxes(harness);

            expect(chip.top).toBe(text.top);
            expect(chip.left - (text.left + text.width)).toBeCloseTo(8);
        });

        it('should set the text of an item 4 px further from its bullet than on wide screens', async () => {
            const { harness } = await setupTest();

            const narrow = await getDmBoxes(harness);
            await page.viewport(1440, 900);
            const wide = await getDmBoxes(harness);

            expect(narrow.text.left - narrow.item.left - (wide.text.left - wide.item.left)).toBeCloseTo(4);
        });
    });

    describe('on wide screens', () => {
        beforeEach(async () => {
            await page.viewport(1440, 900);
        });

        it('should set the groups side by side 24 px apart in the order of the game, at the same size', async () => {
            const { harness } = await setupTest();

            const [prepare, play, remember] = await getGroupBoxes(harness);

            expect(play.top).toBe(prepare.top);
            expect(remember.top).toBe(prepare.top);
            expect(play.left - (prepare.left + prepare.width)).toBeCloseTo(24);
            expect(remember.left - (play.left + play.width)).toBeCloseTo(24);
            expect(play.width).toBeCloseTo(prepare.width);
            expect(play.height).toBe(prepare.height);
        });

        it('should pad each preview 16 by 20 px, with its parts 8 px apart', async () => {
            const { harness } = await setupTest();

            const spacings = await Promise.all((await getPreviews(harness)).map((preview) => preview.getSpacing()));

            expect(spacings).toEqual(Array(3).fill({ paddingBlock: 16, paddingInline: 20, gap: 8 }));
        });

        it('should pad the roll box 12 by 16 px', async () => {
            const { harness } = await setupTest();
            const [, play] = await getPreviews(harness);

            const { paddingBlock, paddingInline } = await play.getSpacing('roll');

            expect({ paddingBlock, paddingInline }).toEqual({ paddingBlock: 12, paddingInline: 16 });
        });

        it('should set the stats of the spell side by side, 20 px apart', async () => {
            const { harness } = await setupTest();
            const [prepare] = await getPreviews(harness);

            const boxes = await prepare.getStatBoxes();

            expect(boxes).toHaveLength(3);
            const [castingTime, range, damage] = boxes as [ElementDimensions, ElementDimensions, ElementDimensions];
            expect(range.top).toBe(castingTime.top);
            expect(damage.top).toBe(castingTime.top);
            expect(range.left - (castingTime.left + castingTime.width)).toBeCloseTo(20);
            expect(damage.left - (range.left + range.width)).toBeCloseTo(20);
        });

        it('should set the DM chip 8 px after the text of its item', async () => {
            const { harness } = await setupTest();

            const { text, chip } = await getDmBoxes(harness);

            expect(chip.top).toBe(text.top);
            expect(chip.left - (text.left + text.width)).toBeCloseTo(8);
        });
    });
});
