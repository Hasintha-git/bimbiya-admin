import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignInComponent } from './pages/pre-login/sign-in/sign-in.component';
import { SignUpComponent } from './pages/pre-login/sign-up/sign-up.component';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { OrderStatusChangeComponent } from './pages/component/order-status-change/order-status-change.component';
import { NotFoundComponent } from './pages/component/not-found/not-found.component';
import { Interceptor } from './services/intercept/intercept.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { StorageService } from './services/local-storage.service';
const INTERCEPTORS = [{
  provide: HTTP_INTERCEPTORS,
  useClass: Interceptor,
  multi: true
},
  {
    provide: LocationStrategy, useClass: HashLocationStrategy
  }
];
@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    OrderStatusChangeComponent,
    NotFoundComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatNativeDateModule,
    MatMenuModule,
    MatCheckboxModule,
    MatInputModule,
    MatRadioModule,
    HttpClientModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    MatDialogModule,
    ToastrModule.forRoot({
      timeOut: 5000, // 5 seconds
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true
    }),
  ],
  providers: [
    INTERCEPTORS,
    StorageService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
