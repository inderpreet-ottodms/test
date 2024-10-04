import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule} from '@angular/http';
import { CustomInterceptor } from './services/CustomInterceptor';


import { MasterService } from './services/master/master.service';
import { DataService, DataStatusService } from './services/data.service';
import { AccountService } from './services/account/account.service';
import { CustomValidatorService   } from './services/validator/custom-validator.service';
import { ProfileService   } from './services/profile/profile.service';
import { SettingService } from './services/setting/setting.service';
import { RfqService } from './services/rfq/rfq.service';
import { SupplierService } from './services/supplier/supplier.service';
import { EncryptionService } from './encryption/encryption.service';
import { AppMessageService } from './services/messages/message.service';
import { QmsService } from './services/qms/qms.service';
import { BuyerService } from './services/buyer/buyer.service';
import { SessionExpireService } from './services/session-expire/session-expire.service';

@NgModule({
  imports: [CommonModule, RouterModule, HttpClientModule, HttpModule],
  exports: [RouterModule, HttpClientModule],
  declarations: [],
  providers: [DataService, DataStatusService , AccountService, CustomValidatorService, ProfileService, MasterService, SettingService, SupplierService, BuyerService,
    EncryptionService, RfqService, AppMessageService,QmsService,SessionExpireService,
     { provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor,
      multi: true }
  ] // these should be singleton
})
export class CoreModule { }
