import { type ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from '@critsource/core-web';
import { serverRoutes } from './server.routes';

export const serverConfig: ApplicationConfig = mergeApplicationConfig(appConfig, {
    providers: [provideServerRendering(withRoutes(serverRoutes))],
});
