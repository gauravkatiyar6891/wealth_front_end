import { NgModule } from '@angular/core';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { NgtPwaMockModule } from '@ng-toolkit/pwa';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

@NgModule({
    bootstrap: [AppComponent],

    imports: [
        NgtPwaMockModule,
        BrowserModule.withServerTransition({ appId: 'go4wealth' }),
        AppModule,
        ServerModule,
        NoopAnimationsModule,
        ModuleMapLoaderModule,
        ServerTransferStateModule, // comment
    ]
})
export class AppServerModule { }
