import { RenderMode, type ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    { path: '', renderMode: RenderMode.Prerender },
    // The build skips catch-all routes, so this fixed route is what writes not-found/index.html, which nginx serves with
    // status 404 for every unknown path.
    { path: 'not-found', renderMode: RenderMode.Prerender },
    { path: '**', renderMode: RenderMode.Client },
];
