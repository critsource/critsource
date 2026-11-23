import { Component } from '@angular/core';
import { page, userEvent } from 'vitest/browser';
import { FaqComponent } from './faq.component';
import { FaqHarness } from '@critsource/landing-web/testing';
import { type DisclosureHarness, readColorToken, setupTestEnvironment } from '@critsource/ui-web/testing';

/** The questions of the FAQ, each with its answer, in the order they draw. */
const QUESTIONS = [
    {
        question: 'Is it free?',
        answer: 'The code is free and MIT-licensed. Whether the hosted version has paid options isn’t decided yet.',
    },
    {
        question: 'When can I use it?',
        answer: 'Critsource is in early development, and nothing is usable yet. Watch releases on GitHub to hear when the first feature ships.',
    },
    {
        question: 'Which rules does it cover?',
        answer: 'The 2014 fifth-edition rules from the System Reference Document 5.1 (SRD 5.1), which Wizards of the Coast publishes under the Creative Commons Attribution 4.0 license. Material from other books isn’t included.',
    },
    {
        question: 'Is it official?',
        answer: 'No. Critsource is an unofficial fan project and is not affiliated with Wizards of the Coast. Dungeons & Dragons and D&D are trademarks of Wizards of the Coast LLC.',
    },
    {
        question: 'Can I bring my homebrew?',
        answer: 'Yes, that’s part of the plan. You’ll add your own spells, monsters, and items on top of the SRD 5.1 rules, and find them in the compendium next to the rest.',
    },
    {
        question: 'Can I run it on my own server?',
        answer: 'That’s planned. The code is MIT-licensed, so you’re free to run your own copy once there’s an app to run. The hosted version gets the most support.',
    },
    {
        question: 'Who builds it?',
        answer: 'One lead maintainer builds Critsource in the open on GitHub. Anyone can ask a question, suggest an idea, or report a bug in Discussions, and contributors who keep at it can become maintainers.',
    },
];

/** The question with the given summary. */
async function getQuestion(harness: FaqHarness, question: string): Promise<DisclosureHarness> {
    const questions = await harness.getQuestions();
    const summaries = await Promise.all(questions.map((disclosure) => disclosure.getSummaryText()));
    const disclosure = questions[summaries.indexOf(question)];

    if (!disclosure) {
        throw new Error(`The FAQ has no question "${question}".`);
    }
    return disclosure;
}

describe('FaqComponent', () => {
    @Component({
        template: `<dma-faq />`,
        imports: [FaqComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: FaqHarness });

        return { harness };
    }

    const { innerWidth, innerHeight } = window;

    afterEach(async () => {
        await page.viewport(innerWidth, innerHeight);
    });

    it('should introduce the section with a level 2 heading and no intro text', async () => {
        const { harness } = await setupTest();

        const intro = await harness.getIntro();

        expect(await intro.getText('eyebrow')).toBe('FAQ');
        expect(await intro.getText('heading')).toBe('Questions people ask');
        expect(await intro.getText('intro')).toBeNull();
        await expect.element(page.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should have the id that the FAQ link of the header targets', async () => {
        const { harness } = await setupTest();

        expect(await harness.getId()).toBe('faq');
    });

    it('should fill the section with the surface background', async () => {
        const { harness } = await setupTest();

        const { background } = await (await harness.getSection()).getLook();

        expect(background).toBe(readColorToken('--color-background-surface'));
    });

    it('should answer the seven questions', async () => {
        const { harness } = await setupTest();

        const questions = await Promise.all(
            (await harness.getQuestions()).map(async (disclosure) => ({
                question: await disclosure.getSummaryText(),
                answer: await disclosure.getPanelText(),
            })),
        );

        expect(questions).toEqual(QUESTIONS);
    });

    it('should start with "Is it free?" and "When can I use it?" open, and the rest closed', async () => {
        const { harness } = await setupTest();

        const open = await Promise.all((await harness.getQuestions()).map((disclosure) => disclosure.isOpen()));

        expect(open).toEqual([true, true, false, false, false, false, false]);
    });

    it('should keep the answers of closed questions findable', async () => {
        const { harness } = await setupTest();

        const findable = await Promise.all(
            (await harness.getQuestions()).map((disclosure) => disclosure.isPanelFindable()),
        );

        expect(findable).toEqual(QUESTIONS.map(() => true));
    });

    it('should open a closed question when its summary is clicked', async () => {
        const { harness } = await setupTest();

        await userEvent.click(page.getByText('Who builds it?'));

        const question = await getQuestion(harness, 'Who builds it?');

        expect(await question.isOpen()).toBe(true);
        expect(await question.getIcon()).toBe('minus');
    });

    it('should close an open question when its summary is clicked', async () => {
        const { harness } = await setupTest();

        await userEvent.click(page.getByText('Is it free?'));

        const question = await getQuestion(harness, 'Is it free?');

        expect(await question.isOpen()).toBe(false);
        expect(await question.getIcon()).toBe('plus');
    });

    describe('on narrow screens', () => {
        beforeEach(async () => {
            await page.viewport(390, 844);
        });

        it('should draw each question as a row across the full width of the content', async () => {
            const { harness } = await setupTest();

            const { width } = await (await harness.getSection()).getContentBox();
            const widths = await Promise.all(
                (await harness.getQuestions()).map(async (disclosure) => (await disclosure.getSize()).width),
            );

            expect(widths).toEqual(QUESTIONS.map(() => width));
        });
    });

    describe('on wide screens', () => {
        beforeEach(async () => {
            await page.viewport(1440, 900);
        });

        it('should keep each question at the measure, 720 px wide', async () => {
            const { harness } = await setupTest();

            const widths = await Promise.all(
                (await harness.getQuestions()).map(async (disclosure) => (await disclosure.getSize()).width),
            );

            expect(widths).toEqual(QUESTIONS.map(() => 720));
        });
    });
});
