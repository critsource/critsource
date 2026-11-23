import { Component } from '@angular/core';
import { ChipComponent, TabComponent, TabListComponent, TabPanelComponent } from '@critsource/ui-web';

/**
 * The preview in the hero of the landing page: a tab for each part of the game, Prepare, Play, and Remember, with a
 * static panel of what the app will show for it, and a caption under them. It starts on Play. Each panel carries the
 * Concept chip, since nothing it shows is built yet, and the tabs switch only when the reader picks one.
 */
@Component({
    selector: 'dma-tabbed-preview',
    templateUrl: './tabbed-preview.component.html',
    styleUrl: './tabbed-preview.component.scss',
    imports: [ChipComponent, TabComponent, TabListComponent, TabPanelComponent],
})
export class TabbedPreviewComponent {}
