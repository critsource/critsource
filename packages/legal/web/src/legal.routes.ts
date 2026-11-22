import { type Routes } from '@angular/router';
import { AccessibilityPage } from './accessibility.page';
import { PrivacyPage } from './privacy.page';

export const legalRoutes: Routes = [
    { path: 'privacy', component: PrivacyPage, title: 'Privacy - Critsource' },
    { path: 'accessibility', component: AccessibilityPage, title: 'Accessibility - Critsource' },
];
