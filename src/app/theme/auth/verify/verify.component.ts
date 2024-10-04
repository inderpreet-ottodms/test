import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../core/services/account/account.service';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  constructor(private route: ActivatedRoute, private _accountService: AccountService, private _toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let token = params['token'];
      console.log('Token', token);
      if(token!== undefined && token !== null){
        this._accountService.setEmailActivation(token).subscribe(
          response => {
            if(!response.isError){
              if(response.data){
                this._toastr.success('Email verify successfully.','Success!');
                this.router.navigateByUrl('/auth/login/simple');
              } else{
                this._toastr.warning(response.messages[0],'Warning!');
                this.router.navigateByUrl('/auth/login/simple');
              }
            } else{
              this._toastr.error(response.messages[0],'Error!');
               this.router.navigateByUrl('/auth/login/simple');
            }
          }, error =>{
            this._toastr.error(error.error.messages[0],'Error!');
            this.router.navigateByUrl('/auth/login/simple');
          }
        );
      }
    });
  }

}
