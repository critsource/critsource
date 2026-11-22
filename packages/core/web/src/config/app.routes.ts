import { type Route, type Routes } from '@angular/router';
import { NotFoundPage } from '../not-found/not-found.page';

/** The page for an unknown path, which the router matches at `**` and nginx serves from the prerendered `not-found`. */
const notFoundRoute: Route = { component: NotFoundPage, title: 'Page not found - Critsource' };

export const routes: Routes = [
    { path: '', loadChildren: async () => (await import('@critsource/landing-web')).landingRoutes },
    { path: '', loadChildren: async () => (await import('@critsource/legal-web')).legalRoutes },
    { path: 'not-found', ...notFoundRoute },
    { path: '**', ...notFoundRoute },
];
