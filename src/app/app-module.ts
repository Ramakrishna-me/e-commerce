import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Products } from './products/products';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [App, Products],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  bootstrap: [App],
})
export class AppModule {}
