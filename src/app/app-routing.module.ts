import {NgModule} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';
import {AdminComponent} from './layout/admin/admin.component';
import {AuthGuard} from './shared/auth/auth.guard';
import { ValidateComponent } from './component/extra-pages/validate/validate.component';
import { SourceComponent } from './component/SSO/source/source.component';
import { MaterialsRedirectComponent } from './component/materials-redirect/materials-redirect.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./theme/dashboard/dashboard.module').then(x => x.DashboardModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'profile',
                loadChildren: () => import('./component/profile/profile.module').then(x => x.ProfileModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'rfq',
                loadChildren: () => import('./component/rfq/rfq.module').then(x => x.RfqModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'supplierviews',
                loadChildren: () => import('./component/buyer/supplier-views/supplier-views.module').then(x => x.SupplierViewsModule)
            },
            {
                path: 'partlibrary',
                loadChildren: () => import('./component/parts/part-library/part-library.module').then(x => x.PartLibraryModule)
            },
            {
                path: 'buyerContact',
                loadChildren: () => import('./component/buyer/buyer-contact/buyer-contact.module').then(x => x.BuyerContactModule)
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./theme/dashboard/default/default.module').then(x => x.DefaultModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'supplier',
                loadChildren: () => import('./component/supplier/supplier.module').then(x => x.SupplierModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'globalMessage',
                loadChildren: () => import('./component/buyer/global-message-tab/global-message-tab.module').then(x => x.GlobalMessageTabModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'globalNotification',
                loadChildren: () => import('./component/buyer/global-notification-tab/global-notification-tab.module').then(x => x.GlobalNotificationTabModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'getStarted',
                loadChildren: () => import('./component/buyer/buyer-engagement-flow/buyer-engagement-flow.module').then(x => x.BuyerEngagementFlowModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'followedbuyercontact',
                loadChildren: () => import('./component/supplier/followed-buyer-contact/followed-buyer-contact.module').then(x => x.FollowedBuyerContactModule)
            },
            {
                path: 'materialquoterequest',
                loadChildren: () => import( './theme/dashboard/material/material.quoterequest.module').then(x => x.MaterialQuoteRequestModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'leadstream',
                loadChildren: () => import('./component/supplier/lead-stream/lead-stream.module').then(x => x.LeadStreamModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'publishProfile',
                loadChildren: () => import('./component/publish-profile/publish-profile.module').then(x => x.PublishProfileModule),
                
                canActivate: [AuthGuard]
            },
            {
                path: 'qms',
                loadChildren: () => import('./component/mqs/mqs.module').then(x => x.MqsModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'magiclead',
                loadChildren: () => import('./component/magic-lead/magic-lead.module').then(x => x.MagicLeadModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'packages',
                loadChildren: () => import('./component/growth-package/growth-package.module').then(x => x.GrowthPackageModule),
                canActivate: [AuthGuard]
            }
        ]
    },
    {
        path: '',
        children: [{
            path: 'auth',
            loadChildren: () => import('./theme/auth/auth.module').then(x => x.AuthModule),
        }]
    },
    {
        path: 'login',
        component: ValidateComponent
    },
    {
        path: 'source/:id',
        component: SourceComponent
    },
    {
        path: 'source',
        component: SourceComponent
    },
    {
        path: 'materials-redirect',
        component: MaterialsRedirectComponent
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
    },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
