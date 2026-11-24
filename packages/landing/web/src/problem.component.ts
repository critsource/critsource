import { Component } from '@angular/core';
import {
    ChipComponent,
    IconArrowDownComponent,
    IconArrowRightComponent,
    SectionComponent,
    SectionIntroComponent,
} from '@critsource/ui-web';

/**
 * The problem section of the landing page, on a surface: why one app beats the four a table uses to run a game. Its
 * intro names the four tools in prose, and a row of chips names them again, followed by an arrow and the highlighted
 * chip that says Critsource holds all four. The copy names no competitor. Both arrows are in the template, and the
 * styles show the one that fits the viewport, so the prerendered HTML is the same for every viewport, as ADR 0013
 * requires.
 */
@Component({
    selector: 'dma-problem',
    templateUrl: './problem.component.html',
    styleUrl: './problem.component.scss',
    imports: [ChipComponent, IconArrowDownComponent, IconArrowRightComponent, SectionComponent, SectionIntroComponent],
})
export class ProblemComponent {}
