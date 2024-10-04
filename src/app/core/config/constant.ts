export const appConstants = {
  storage: {
    'USER': '   ',
    'USERNAME': '',
  },
  pattern: {
    'NAME': /^[a-zA-Z . \-\']*$/,
    'CITY': /^[a-zA-Z . \-\']*$/,
    'DECIMAL_VALID': '^[0-9]+([,.][0-9]+)?$'
  },
  defaultAwsPath: '',
  // manufacturingLocation: {
  //   'United States': '4',
  //   'M & CA': '6',
  //   'Asia': '3',
  //   'Canada': '5',
  //   'EMEA': '2',
  //   'USA & Canada': '7',
  // },
  paysForShippingCode: {
    'Manufacturer': 13,
    'Buyer': 1
  },
  NDAType: {
    'No NDA Needed': 'RFX_SECURITYTYPE_NO_SECURE',
    'Single Confirm': 'RFX_SECURITYTYPE_TOTALY_SECURE',
    'Double Confirm': 'RFX_SECURITYTYPE_TOTALY_SECURE_CONFIDENTIALITY_AGR'
  },
  RFQStatusKey: {
    'RFX_BUYERSTATUS_PENDING_RELEASE': 'RFX_BUYERSTATUS_PENDING_RELEASE'
  },

  settingDefault:{
  'decimalValueDefault':null
  },
  downloadCustomerCSVFile:{
    'downloadCustomerCSVFile': 'https://s3.us-east-2.amazonaws.com/mfg.mp2020/MyCustomers.csv'

    },
  blacklistedBookType: 'BOOK_BOOKTYPE_BLACKLISTED',
  hotlistedBookType : 'BOOK_BOOKTYPE_HOTLIST',
  AccountType:{
          Basic :'Basic',
          GrowthPackage : 'Growth Package',
          Gold :'Gold',
          Platinum :'Platinum',
          Starter:'Starter' 
      },
  UserLocation:{
    Asia :'Asia',
    Europe :'Europe'
  },
  UserRole:{
    Supplier :'Supplier',
    Buyer : 'Buyer',
    Seller:'Seller'
  },
  RfqBuyerStatus:{
    Offline :20,
    AnotherMFG:16,
    AnotherNonMFG:17,
    Awarded:6
  },
  ForManufacturers:{
  POST_MANU:'Post Manufacturing Job'

  }
};


export const qmsConstants = {
 isQMSTrailModelShown : false
}

