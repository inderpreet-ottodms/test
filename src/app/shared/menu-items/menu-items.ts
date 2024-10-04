import {Injectable} from '@angular/core';
import {AccountService} from '../../core/services/account/account.service';
export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  target?: boolean;
  name: string;
  type?: string;
  children?: ChildrenItems[];
}

export interface MainMenuItems {
  state: string;
  short_label?: string;
  main_state?: string;
  target?: boolean;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

export interface Menu {
  label: string;
  role: string [];
  main: MainMenuItems[];
  isMqs?: string;
  isLeadMagic?: string;
}

const MENUITEMS = [
  {
    label: '',
    role: ['Buyer'],
    isMqs:'no',
    isLeadMagic:'no',
    main: [
      {
        state: 'rfq',
        short_label: 'D',
        name: 'RFQs',
        type: 'sub',
        icon: 'ti-write',
        children: [
          {
            state: 'editrfq',
            name: 'Create an RFQ',
            title: 'mnu_create_an_rfq'
          },
          {
            state: 'draftrfqs',
            // tslint:disable-next-line:quotemark
            name: "Draft RFQs",
            title: 'mnu_draft_rfqs'
          },
          {
            state: 'myrfq',
            // tslint:disable-next-line:quotemark
            name: "RFQs",
            title: 'mnu_my_rfqs'
          },
          {
            state: 'mycompanyrfq',
            // tslint:disable-next-line:quotemark
            name: "Company RFQs",
            title: 'mnu_my_company_rfqs'
          },
          {
            state: 'myqoutes',
            // tslint:disable-next-line:quotemark
            name: "Quotes",
            title: 'mnu_my_quotes'
          },
          {
            state: 'markforquoting',
            name: 'Marked For Quoting',
            title: 'mnu_marked_for_quoting'
          },
          {
            state: 'myorders',
            name: 'Orders',
            title: 'mnu_my_orders'
          },
          {
            state: 'rfqnda',
            // tslint:disable-next-line:quotemark
            name: "NDAs",
            title: 'mnu_ndas_to_approve'
          }
        ]
      }
    ],
  },
  {
    label: '',
    role:  ['Buyer'],
    isMqs:'no',
    isLeadMagic: 'no',
    main: [
      {
        state: 'partlibrary',
        short_label: 'D',
        name: 'Parts',
        type: 'link',
        icon: 'ti-hummer',
        title: 'mnu_parts'
      }
    ],
  },
  {
    label: '',
    role:  ['Buyer'],
    isMqs:'no',
    isLeadMagic: 'no',
    main: [
      {
        state: 'buyerContact',
        short_label: 'D',
        name: 'Contact List',
        type: 'link',
        icon: 'ti-agenda',
        title: 'mnu_contact_list'
      }
    ],
  },
  {
    label: '',
    role:  ['Buyer'],
    isMqs:'no',
    isLeadMagic: 'no',
    main: [
      {
        state: 'supplierviews',
        short_label: 'D',
        name: 'Profile Views',
        type: 'link',
        icon: 'ti-wand',
        title: 'mnu_profile_views'
      }
    ],
  },
  {
    label: '',
    role: ['Supplier'],
    isMqs:'no',
    isLeadMagic: 'no',
    main: [
      {
        state: 'supplier',
        short_label: 'D',
        name: 'RFQs',
        type: 'sub',
        icon: 'ti-write',
        title: 'mnu_rfqs',
        children: [
          {
            state: 'supplierMyRfq',
            name: 'RFQs',
            title: 'mnu_my_rfqs',
          },
          {
            state: 'myunlockedrfq',
            name: 'Unlocked RFQs',
            title: 'mnu_unlocked_rfqs',
          },
          {
            state: 'myQuotes',
            name: 'Quotes',
            title: 'mnu_my_quotes',
          },
          {
            state: 'myCompanyQuotes',
            name: 'Company Quotes',
            title: 'mnu_my_company_quotes',
          },
          {
            state: 'quotesinprogress',
            name: 'Quotes In Progress',
            title: 'mnu_quotes_in_progress',
          },
          {
            state: 'awardedRfq',
            name: ' Awarded RFQs',
            title: 'mnu_my_awarded_rfqs',
          },
          {
            state: 'myorders',
            name: 'Orders',
            title: 'mnu_my_orders'
          },
        ]
      }
    ],
  },
  {
    label: '',
    role: ['Supplier'],
    isMqs:'no',
    isLeadMagic: 'no',
    main: [
      {
        state: 'materialquoterequest',
        name: 'Get Materials',
        type: 'link',
        icon: 'icon_getmaterial',
        title: 'mnu_getmaterial',
      }
    ],
  },

  {
    label: '',
    role: ['Supplier'],
    isMqs:'no',
    isLeadMagic: 'no',
    main: [
      {
        state: 'leadstream',
        short_label: 'D',
        name: 'Leadstream',
        type: 'link',
        icon: 'ti-user',
        title: 'mnu_leadstream',
      }
    ],
  },
  {
    label: '',
    role: ['Supplier'],
    isMqs:'no',
    isLeadMagic:'no',
    main: [
      {
        state: 'followedbuyercontact',
        short_label: 'D',
        name: 'MFG Contacts',
        type: 'link',
        icon: 'ti-agenda',
        title: 'mnu_mfg_contacts',
      }
    ],
  },

  {
    label: '',
    role: ['Supplier', 'Buyer'],
    isMqs:'no',
    isLeadMagic: 'no',
    main: [
      {
        state: 'globalMessage',
        short_label: 'D',
        name: 'Messages',
        type: 'link',
        icon: 'ti-email',
        title: 'mnu_messages',
      }
    ],
  },
  {
    label: '',
    role: ['Supplier', 'Buyer'],
    isMqs:'no',
    isLeadMagic: 'no',
    main: [
      {
        state: 'globalNotification',
        short_label: 'D',
        name: 'Notifications',
        type: 'link',
        icon: 'ti-bell',
        title: 'mnu_notification',
      }
    ],
  },
  {
    label: '',
    role: ['Supplier'],
    isMqs:'yes',
    isLeadMagic:'no',
    main: [
      {
        state: 'qms',
        short_label: 'D',
        name: 'LiveQuote',
        type: 'sub',
        icon: 'ti-write',
        title: 'mnu_live_quote',
        children: [
          {
            state: 'createquotes',
            name: 'Create a Quote',
            title: 'mnu_create_a_quote',
          },
          {
            state: 'myquotes',
            name: 'My Quotes',
            title: 'mnu_my_quotes',
          },
          {
            state: 'draftquotes',
            name: 'Draft Quotes',
            title: 'mnu_draft_quotes',
          },
          {
            state: 'active',
            name: 'Active Quotes',
            title: 'mnu_active_quotes',
          },
          {
            state: 'qmsexpiredquotes',
            name: 'Expired Quotes',
            title: 'mnu_expired_quotes',
          },
          {
            state: 'myinvoices',
            name: 'My Invoices',
            title: 'mnu_my_invoices',
          },
          {
            state: 'mycompanyinvoices',
            name: 'My Company  Invoices',
            title: 'mnu_my_company_invoices',
          }
        ]
      }
    ],
  },
  {
    label: '',
    role: ['Supplier'],
    isMqs:'yes',
    isLeadMagic: 'no',
    main: [
      {
        state: 'mycustomers',
        short_label: 'D',
        name: 'My Customers',
        type: 'link',
        icon: 'ti-bookmark-alt',
        title: 'mnu_my_customers',
      }
    ],
  },
];

@Injectable()
export class MenuItems {
  role: string;
  userDetailsLocation: any;
  count1: number;
  isMQSEnable: string;
  region: string;
  constructor(private _accountService: AccountService) {}
  getAll(): Menu[] {
    this.role = '';
    this.count1 = 111;
     this.role = localStorage.getItem('Usertype');
     this.isMQSEnable = localStorage.getItem('isMqsEnabled');
     this.userDetailsLocation =  localStorage.getItem('manufacturingLocation');
     // tslint:disable-next-line:max-line-length
      if ( this.userDetailsLocation === 'US' || this.userDetailsLocation === 'Canada' || this.userDetailsLocation === 'USA & Canada') {
        this.region = this.userDetailsLocation;
      } else {
        this.region = null;
      }
    this._accountService.getMessage().subscribe(message => {
      if (message) {
        this.role = message;
      }
     });
     if (this.isMQSEnable === 'true' && this.region !== null) {
      return MENUITEMS.filter( x => x.role.includes(this.role));
     } else if (this.isMQSEnable === 'true' && this.region === null){
      return MENUITEMS.filter(x=>x.isLeadMagic !== 'yes' &&  x.role.includes(this.role));
     } else if (this.isMQSEnable !== 'true' && this.region !== null){
      return MENUITEMS.filter( x=>x.isMqs !== 'yes' && x.role.includes(this.role));
     } else {
      return MENUITEMS.filter(x => x.isMqs !== 'yes' && x.isLeadMagic !== 'yes' &&  x.role.includes(this.role));
     }

  }
}
