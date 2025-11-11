import { Routes } from '@angular/router';
import { withLangTitle } from '@shared/utils/with-lang-title';
import { NotFound } from './components/not-found';
import { NOT_FOUND_TEXTS } from './content/not-found.text';


export const NOT_FOUND_ROUTES: Routes = [
  {
    path: '',
    component: NotFound,
    title: withLangTitle(NOT_FOUND_TEXTS, 'main'),
  }
];
