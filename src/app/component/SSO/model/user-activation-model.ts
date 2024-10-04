import { Injectable } from "@angular/core";

@Injectable()
export class UserActivationModel {
    id: number;
    email: string;
    userLogin: string;
    activationKey: string;
}