import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular-vite';
import { MobileMenuComponent } from './mobile-menu.component';
import { withSelectedTheme } from '../../../.storybook/theme';
import { Theme } from '../../theme';
import { ButtonComponent } from '../button';
import { HeaderComponent } from '../header';
import { IconGithubComponent } from '../icon';
import { LogoComponent } from '../logo';
import { NavLinkComponent } from '../nav-link';

/** The content of the menu, as the page projects it. */
const content = `
    <a href="#"><dma-logo size="small" /></a>
    <a dma-nav-link kind="row" href="#" aria-current="page">Compendium</a>
    <a dma-nav-link kind="row" href="#">Characters</a>
    <a dma-nav-link kind="row" href="#">Campaigns</a>
    <a dma-button kind="quiet" href="#"><dma-icon-github />GitHub</a>
`;

const meta = {
    title: 'Regions/Mobile menu',
    component: MobileMenuComponent,
    decorators: [
        moduleMetadata({
            imports: [HeaderComponent, LogoComponent, NavLinkComponent, ButtonComponent, IconGithubComponent],
        }),
        withSelectedTheme(Theme.System),
    ],
    parameters: { layout: 'fullscreen' },
    // The menu shows below the desktop breakpoint only, at the size of the Mobile menu in Penpot.
    globals: { viewport: { value: 'mobile1', isRotated: false } },
} satisfies Meta<MobileMenuComponent>;

export default meta;

type Story = StoryObj<MobileMenuComponent>;

/**
 * The menu open over the page, as the Menu button of Header leaves it. The docs page shows the story in an iframe, so
 * the modal covers the story rather than the docs page.
 */
export const Open: Story = {
    render: () => ({ template: `<dialog dma-mobile-menu>${content}</dialog>` }),
    play: ({ canvasElement }) => {
        canvasElement.querySelector<HTMLDialogElement>('dialog[dma-mobile-menu]')?.showModal();
    },
};

/**
 * The menu open at 280 px, narrower than the labels of Close and the Theme picker need: Close shows its icon alone, so it
 * stays clear of the link home, and the options of the picker show theirs, so they stay inside its border.
 */
export const OpenNarrow: Story = {
    ...Open,
    globals: { viewport: { value: 'narrow', isRotated: false } },
    parameters: {
        viewport: {
            options: { narrow: { name: '280 px', styles: { width: '280px', height: '640px' }, type: 'mobile' } },
        },
    },
};

/**
 * The closed menu below Header. Press Menu to open it, and Close or Escape to close it again. Below 304 px, Menu and
 * Close both show their icons alone, so the bar keeps its look when the menu opens.
 */
export const WithHeader: Story = {
    render: () => ({
        template: `
            <header dma-header (menuPressed)="mobileMenu.showModal()">
                <a href="#"><dma-logo size="small" /></a>
            </header>
            <dialog dma-mobile-menu #mobileMenu>${content}</dialog>
        `,
    }),
};
