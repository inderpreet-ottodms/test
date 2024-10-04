import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationError, Router } from '@angular/router';
import { ProductAnalyticService } from './shared/product-analytic/product-analytic';
import { VersionCheckService } from './v2/shared/version-check.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'MFG';

  constructor(private router: Router, private productAnalyticService: ProductAnalyticService, private versionCheckService: VersionCheckService) {
    this.versionCheckService.initVersionCheck(120000); // Check every 2 minutes
    router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      if (evt instanceof NavigationEnd) {
        console.log("evt is instanceof NavigationEnd")
        this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_PAGEVIEW,
          {});
      }
      window.scrollTo(0, 0);
    });
  }

  ngOnInit() {
    window.document.getElementById("indexPageLoader").style.display="none";
  }
}
