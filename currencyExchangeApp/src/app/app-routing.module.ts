import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ExchangesideComponent } from './exchangeside/exchangeside.component';
import { GraphViewerComponent } from './graph-viewer/graph-viewer.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"convert", component:ExchangesideComponent},
  {path:"graph", component:GraphViewerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
