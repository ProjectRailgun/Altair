import { NgModule } from '@angular/core';
import { UserService } from './user.service';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Authentication } from './authentication.service';
import { PersistStorage } from './persist-storage';

@NgModule({
    providers: [
        UserService,
        Authentication,
        PersistStorage
    ],
    imports: [
        HttpModule,
        RouterModule
    ]
})
export class UserServiceModule {

}

export * from './user.service';
export * from './authentication.service';
export * from './persist-storage';
