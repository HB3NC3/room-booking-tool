import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './login/jwt.interceptor';
import { AuthGuard } from './login/auth.guard';
import { DateAdapter, GestureConfig, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CustomDateAdapter, DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CalendarComponent } from './dashboard/calendar/calendar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ManageRoomsComponent } from './manage-rooms/manage-rooms.component';
import { EditableRoomFieldComponent } from './editable-room-field/editable-room-field.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DeletableListItemComponent } from './deletable-list-item/deletable-list-item.component';
import { ErrorInterceptor } from './error/error-interceptor';
import { RegisterFormComponent } from './register-form/register-form.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

const appRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CalendarComponent,
    ManageRoomsComponent,
    EditableRoomFieldComponent,
    AddBookingComponent,
    DeletableListItemComponent,
    RegisterFormComponent,
    ManageUsersComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatCheckboxModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    AuthGuard,
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig},
    {provide: MAT_DATE_LOCALE, useValue: 'hu-HU'},
    {provide: DateAdapter, useClass: CustomDateAdapter}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
