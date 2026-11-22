import { ComponentHarness, type TestElement } from '@angular/cdk/testing';
import {
    FooterHarness,
    HeaderHarness,
    LinkGroupHarness,
    MobileMenuHarness,
    SkipLinkHarness,
} from '@critsource/ui-web/testing';

/** Reads the shell of the web client: the Skip link, the Header, the Mobile menu, the main content, and the Footer. */
export class RootHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-root';

    private readonly skipLinkLocator = this.locatorFor(SkipLinkHarness);
    private readonly headerLocator = this.locatorFor(HeaderHarness);
    private readonly mobileMenuLocator = this.locatorFor(MobileMenuHarness);
    private readonly mainLocator = this.locatorFor('main');
    private readonly footerLocator = this.locatorFor(FooterHarness);
    private readonly footerLinkGroupsLocator = this.locatorForAll(LinkGroupHarness);

    public async getSkipLink(): Promise<SkipLinkHarness> {
        return await this.skipLinkLocator();
    }

    public async getHeader(): Promise<HeaderHarness> {
        return await this.headerLocator();
    }

    public async getMobileMenu(): Promise<MobileMenuHarness> {
        return await this.mobileMenuLocator();
    }

    /** The `<main>` element, which holds the router outlet. */
    public async getMain(): Promise<TestElement> {
        return await this.mainLocator();
    }

    public async getFooter(): Promise<FooterHarness> {
        return await this.footerLocator();
    }

    /** The link groups of the shell, which sit in the footer. */
    public async getLinkGroups(): Promise<LinkGroupHarness[]> {
        return await this.footerLinkGroupsLocator();
    }
}
