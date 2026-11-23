import { Component } from '@angular/core';
import { page, userEvent } from 'vitest/browser';
import { TabbedPreviewComponent } from './tabbed-preview.component';
import { TabbedPreviewHarness, type TabbedPreviewPanelHarness } from '@critsource/landing-web/testing';
import { readColorToken, setupTestEnvironment } from '@critsource/ui-web/testing';

/** What each panel shows, in the order of the tabs, as Penpot draws it. */
const PANELS = [
    {
        tab: 'Prepare',
        title: 'Encounter',
        context: 'The Sunken Keep · Level 4 party',
        rows: [
            { name: 'Goblin boss', tag: 'Boss', value: 'CR 1', current: true },
            { name: 'Goblin archer ×3', tag: null, value: 'CR 1/4', current: false },
            { name: 'Wolf ×2', tag: null, value: 'CR 1/4', current: false },
        ],
        chips: ['Spells:', 'Fireball', 'Shield'],
        inset: '/cast Fireball → 8d6 fire',
    },
    {
        tab: 'Play',
        title: 'Initiative',
        context: 'Round 2 · The Sunken Keep',
        rows: [
            { name: 'Aria, elf ranger', tag: 'Current turn', value: '18', current: true },
            { name: 'Goblin boss', tag: null, value: '14', current: false },
            { name: 'Borin, dwarf cleric', tag: null, value: '9', current: false },
        ],
        chips: ['Aria:', 'Hunter’s mark', 'Concentrating'],
        inset: '/roll 1d20 + 7 → 19 to hit',
    },
    {
        tab: 'Remember',
        title: 'Session 12',
        context: 'The Sunken Keep · shared with the party',
        rows: [
            { name: 'Deal with the river hag', tag: 'Latest', value: '12', current: true },
            { name: 'Crossed the flooded gate', tag: null, value: '11', current: false },
            { name: 'Met Borin at the ferry', tag: null, value: '10', current: false },
        ],
        chips: ['Shared with:', 'Aria', 'Borin'],
        inset: 'Safe passage from the river hag, for the silver bell.',
    },
];

/** What a panel shows, read the way `PANELS` spells it. */
async function readPanel(panel: TabbedPreviewPanelHarness) {
    const [title, context, rows, chips, inset] = await Promise.all([
        panel.getTitle(),
        panel.getContext(),
        panel.getRows(),
        panel.getChips(),
        panel.getInset(),
    ]);

    return {
        title,
        context,
        rows: await Promise.all(
            rows.map(async (row) => ({
                name: await row.getName(),
                tag: await row.getTag(),
                value: await row.getValue(),
                current: await row.isCurrent(),
            })),
        ),
        chips,
        inset,
    };
}

describe('TabbedPreviewComponent', () => {
    @Component({
        template: `<dma-tabbed-preview />`,
        imports: [TabbedPreviewComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: TabbedPreviewHarness });

        return { harness };
    }

    const { innerWidth, innerHeight } = window;

    afterEach(async () => {
        delete document.documentElement.dataset['theme'];
        await page.viewport(innerWidth, innerHeight);
    });

    it('should offer a tab for each part of the game, in a named tab list', async () => {
        const { harness } = await setupTest();

        expect(await (await harness.getTabList()).getLabels()).toEqual(['Prepare', 'Play', 'Remember']);
        await expect.element(page.getByRole('tablist', { name: 'Preview of Critsource' })).toBeInTheDocument();
    });

    it('should start on Play, and show only its panel', async () => {
        const { harness } = await setupTest();

        expect(await (await harness.getTabList()).getSelectedLabel()).toBe('Play');
        expect(await harness.getShownPanels()).toEqual([false, true, false]);
    });

    it.each(PANELS)('should show the $title of $tab in its panel', async ({ tab, ...expected }) => {
        const { harness } = await setupTest();

        await userEvent.click(page.getByRole('tab', { name: tab }));

        expect(await readPanel(await harness.getShownPanel())).toEqual(expected);
    });

    it('should mark every panel as a concept', async () => {
        const { harness } = await setupTest();

        const concepts = await Promise.all((await harness.getPanels()).map((panel) => panel.getConcept()));

        expect(concepts).toEqual(['Concept', 'Concept', 'Concept']);
    });

    it('should explain the tabs in a caption under the panel', async () => {
        const { harness } = await setupTest();

        expect(await harness.getCaption()).toBe('The tabs switch the preview between the three parts of the game.');
    });

    it.each(['Prepare', 'Remember'])('should show the panel of %s when its tab is clicked', async (label) => {
        const { harness } = await setupTest();

        await userEvent.click(page.getByRole('tab', { name: label }));

        expect(await (await harness.getTabList()).getSelectedLabel()).toBe(label);
        expect(await (await harness.getShownPanel()).getTitle()).toBe(PANELS.find(({ tab }) => tab === label)?.title);
    });

    it.each([
        { key: '{ArrowLeft}', label: 'Prepare' },
        { key: '{ArrowRight}', label: 'Remember' },
    ])('should move from Play to $label on $key', async ({ key, label }) => {
        const { harness } = await setupTest();
        const tabList = await harness.getTabList();

        await (await tabList.getTab('Play')).focus();
        await userEvent.keyboard(key);

        expect(await tabList.getSelectedLabel()).toBe(label);
        expect(await tabList.getFocusedLabel()).toBe(label);
        expect(await (await harness.getShownPanel()).getTitle()).toBe(PANELS.find(({ tab }) => tab === label)?.title);
    });

    it('should wrap from Remember to Prepare on the right arrow key', async () => {
        const { harness } = await setupTest();
        const tabList = await harness.getTabList();

        await userEvent.click(page.getByRole('tab', { name: 'Remember' }));
        await userEvent.keyboard('{ArrowRight}');

        expect(await tabList.getSelectedLabel()).toBe('Prepare');
    });

    it.each(['dark', 'light'])('should draw the preview and its panel in the colors of the %s theme', async (theme) => {
        document.documentElement.dataset['theme'] = theme;
        const { harness } = await setupTest();
        const panel = await harness.getShownPanel();

        const [preview, box, current, other, highlight, inset] = await Promise.all([
            harness.getLook(),
            panel.getLook(),
            panel.getRows().then(([row]) => row?.getLook()),
            panel.getRows().then(([, row]) => row?.getLook()),
            panel.getLook('highlight'),
            panel.getLook('inset'),
        ]);

        expect(preview.background).toBe(readColorToken('--color-background-surface'));
        expect(box.background).toBe(readColorToken('--color-background-raised'));
        expect(current).toMatchObject({
            background: readColorToken('--color-background-surface'),
            borderColor: readColorToken('--color-accent-text'),
            valueColor: readColorToken('--color-foreground-default'),
        });
        expect(other).toMatchObject({
            background: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            valueColor: readColorToken('--color-foreground-muted'),
        });
        expect(highlight).toMatchObject({
            borderColor: readColorToken('--color-secondary-default'),
            color: readColorToken('--color-secondary-default'),
        });
        expect(inset.background).toBe(readColorToken('--color-background-sunken'));
    });
});
