import { type Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadChildren: async () => (await import('@critsource/landing-web')).landingRoutes },
    { path: '', loadChildren: async () => (await import('@critsource/legal-web')).legalRoutes },
];
