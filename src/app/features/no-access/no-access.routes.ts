import { Routes } from '@angular/router';
import { NoAccess } from './components/no-access';
import { withLangTitle } from '@shared/utils/with-lang-title';
import { NO_ACCESS_TEXTS } from './content/no-access.text';


export const NO_ACCESS_ROUTES: Routes = [
  {
    path: '',
    component: NoAccess,
    title: withLangTitle(NO_ACCESS_TEXTS, 'main'),
  }
];
