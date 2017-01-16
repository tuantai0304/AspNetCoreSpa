import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { RouterModule } from '@angular/router';

import { AppState } from './app-store';
import { AuthState } from './core/auth-store/auth.store';
import { AuthTokenService } from './core/auth-token/auth-token.service';
import { DataService } from './shared/services/data.service';

/*
 * App Component
 * Top Level Component
 */

@Component({
  selector: 'appc-app',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  private authState$: Observable<AuthState>;

  constructor(
    public translate: TranslateService,
    public titleService: Title,
    private tokens: AuthTokenService,
    private store: Store<AppState>) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }

  public ngOnInit() {
    this.translate.get('TITLE')
      .subscribe(title => this.setTitle(title));

    this.authState$ = this.store.select(state => state.auth);

    // This starts up the token refresh preocess for the app
    this.tokens.startupTokenRefresh()
      .subscribe(
      () => console.info('Startup success'),
      error => console.warn(error)
      );
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}