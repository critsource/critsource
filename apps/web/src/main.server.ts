import { type ApplicationRef } from '@angular/core';
import { type BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { RootComponent } from '@critsource/core-web';
import { serverConfig } from '@critsource/core-web/server';

export default async function bootstrap(context: BootstrapContext): Promise<ApplicationRef> {
    return await bootstrapApplication(RootComponent, serverConfig, context);
}
