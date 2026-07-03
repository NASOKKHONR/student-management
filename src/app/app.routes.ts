import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page';
import { EditComponent } from './edit/edit';
import { DeleteComponent } from './delete/delete';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: 'delete/:id', component: DeleteComponent },
  { path: '**', redirectTo: '' }
];
