import { adminDb } from "@/lib/firebase-admin-config";
import { Timestamp } from "firebase-admin/firestore";
import moment from "moment";

const DATA =  [
  {
    "uid": "",
    "name": "elok",
    "email": "eloklisabetha90@gmail.com",
    "customerId": "sNKnJ234HEct5ASZ9zXp",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "KYyy2vYtnHCjL3vgh3MC",
    "productName": "Silver 3 Months",
    "price": 1500000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1739232000,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "createdAt": {
      "_seconds": 1731310956,
      "_nanoseconds": 886000000
    },
    "lastUpdated": {
      "_seconds": 1731310956,
      "_nanoseconds": 886000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "0iBebCa1h7Ukg9lhxlcn"
  },
  {
    "uid": "",
    "name": "darren",
    "email": "darren.suciono@gmail.com",
    "customerId": "XjujEEUODokAs9KHeo42",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1752019200,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "createdAt": {
      "_seconds": 1731313823,
      "_nanoseconds": 352000000
    },
    "lastUpdated": {
      "_seconds": 1731313823,
      "_nanoseconds": 352000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "2JbabZBNpIaps7DnMy41"
  },
  {
    "uid": "",
    "name": "Hendra Agustian",
    "email": "agustianhendra16@gmail.com",
    "customerId": "QCC93i82BrkYdBISaGDU",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1749168000,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "receiptUrl": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/transfer-receipt%2F1731314800-WhatsApp%20Image%202024-06-06%20at%2013.36.27.webp?alt=media&token=7308ddfd-84f4-410d-b6eb-1c869fded586",
    "createdAt": {
      "_seconds": 1731314803,
      "_nanoseconds": 609000000
    },
    "lastUpdated": {
      "_seconds": 1731314803,
      "_nanoseconds": 609000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "5GGkBgfosRT40ZauFPx9"
  },
  {
    "uid": "",
    "name": "Rifki Maulana",
    "email": "rifkimaulanaya@gmail.com",
    "customerId": "cDQbtuopOx4wRKOOZxH9",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1750982400,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "receiptUrl": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/transfer-receipt%2F1731323833-WhatsApp%20Image%202024-06-27%20at%2018.32.48.webp?alt=media&token=d5912f2d-cdb1-4a61-9b17-238170e285dc",
    "createdAt": {
      "_seconds": 1731323840,
      "_nanoseconds": 941000000
    },
    "lastUpdated": {
      "_seconds": 1731323840,
      "_nanoseconds": 941000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "7QgVTUEqikCJK9AnxwJx"
  },
  {
    "uid": "",
    "name": "Filip Natanael",
    "email": "filipnatanael@gmail.com",
    "customerId": "fNKmF7TEE0QZvYTUAvql",
    "productId": "KYyy2vYtnHCjL3vgh3MC",
    "productName": "Silver 3 Months",
    "price": 1500000,
    "expiredAt": {
      "_seconds": 1733097600,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "receiptUrl": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/transfer-receipt%2F1731315663-WhatsApp%20Image%202024-09-01%20at%2017.57.05.webp?alt=media&token=e2346e9c-6aeb-442e-8550-99f76ea27eb3",
    "createdAt": {
      "_seconds": 1731315672,
      "_nanoseconds": 112000000
    },
    "lastUpdated": {
      "_seconds": 1731315672,
      "_nanoseconds": 112000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "affiliatePercentage": 30,
    "affiliatorCustomerId": "boMEZRhEzgDxLVtf9ZaG",
    "affiliateCommission": 450000,
    "affiliator": {
      "id": "boMEZRhEzgDxLVtf9ZaG",
      "exchange_name": "",
      "uid": "",
      "createdAt": {
        "_seconds": 1725513048,
        "_nanoseconds": 359000000
      },
      "companyId": "byscript",
      "exchange_thumbnail": "",
      "phoneNumber": "6287881807000",
      "city": "Jakarta",
      "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
      "name": "Giovanni Satrio Putra",
      "email": "giovannisatrio@gmail.com",
      "lastUpdatedBy": {
        "uid": "dimK3jZlIsScKq8qTZkhLdn2OTD3",
        "email": "giovannisatrio@gmail.com"
      },
      "isNewUser": false,
      "lastLogin": {
        "_seconds": 1731166456,
        "_nanoseconds": 719000000
      },
      "numberOfLogin": 7,
      "token": "ya29.a0AeDClZCtFieLUt2Xot8zXnEfMdloj_moVEP4gg4FZ6B46uVgQMDoRr5P08jQNn1iDWJMuidTRMaTTpIOZcrnLa6KhuKdrPFGtTdSRId1gI0VOO9afE-7aAzmDqeF5NQ7leFMDKDbJqCi9yvLPYpmWHI51r6AQ3LIIl52aCgYKAYMSARMSFQHGX2Mihfwwf70kAroWo-z__Tdodg0171",
      "lastUpdated": {
        "_seconds": 1731169090,
        "_nanoseconds": 12000000
      },
      "affiliateClicks": 1
    },
    "affiliateLevel": 1,
    "photoURL": "",
    "id": "80MrnNoxmHdOPDrE0KIW"
  },
  {
    "uid": "",
    "name": "Randy Priyatna",
    "email": "randepe@gmail.com",
    "customerId": "16SX03GIxSNycjqnfRMK",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1758499200,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "receiptUrl": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/transfer-receipt%2F1731323666-payment_randy.webp?alt=media&token=68582123-e53e-44fa-825a-a44dded41fcc",
    "createdAt": {
      "_seconds": 1731323669,
      "_nanoseconds": 909000000
    },
    "lastUpdated": {
      "_seconds": 1731323669,
      "_nanoseconds": 909000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "E1BMuuaQ3tYZhH50EDpy"
  },
  {
    "uid": "",
    "name": "abi",
    "email": "abi.bayu@gmail.com",
    "customerId": "JYU4OCl35VEltfZAbNhD",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1745625600,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "createdAt": {
      "_seconds": 1731313711,
      "_nanoseconds": 131000000
    },
    "lastUpdated": {
      "_seconds": 1731313711,
      "_nanoseconds": 131000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "EKUGjfmx7y6sUaz9cjst"
  },
  {
    "uid": "",
    "name": "Alexander Surya",
    "email": "alexahongsurya@gmail.com",
    "customerId": "ZVX059dV8wbeqcGVLrro",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1745712000,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "createdAt": {
      "_seconds": 1731324378,
      "_nanoseconds": 248000000
    },
    "lastUpdated": {
      "_seconds": 1731324378,
      "_nanoseconds": 248000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "EYJi8tVJ2vNEvvZ95Rmb"
  },
  {
    "uid": "",
    "name": "Dymas Rizqy I",
    "email": "dymasrizqi@gmail.com",
    "customerId": "SYANNVrVBh5m6Uz1mo4K",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "KYyy2vYtnHCjL3vgh3MC",
    "productName": "Silver 3 Months",
    "price": 1500000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1739232000,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "createdAt": {
      "_seconds": 1731310895,
      "_nanoseconds": 815000000
    },
    "lastUpdated": {
      "_seconds": 1731310895,
      "_nanoseconds": 815000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "GWyyg2X288vlgjX7VxPD"
  },
  {
    "uid": "",
    "name": "azmi ryan",
    "email": "azmindonesia@gmail.com",
    "customerId": "naYyGAIRvdPdLBf2kqwz",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "KYyy2vYtnHCjL3vgh3MC",
    "productName": "Silver 3 Months",
    "price": 1500000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "receiptUrl": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/transfer-receipt%2F1731314683-IMG_1090.webp?alt=media&token=2effc05c-b776-42b4-9299-37bf615554c8",
    "paymentStatus": "PAID",
    "expiredAt": {
      "_seconds": 1733875200,
      "_nanoseconds": 0
    },
    "createdAt": {
      "_seconds": 1731314700,
      "_nanoseconds": 885000000
    },
    "lastUpdated": {
      "_seconds": 1731314700,
      "_nanoseconds": 885000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "JcbrqkqybZ6DZR2nPMmA"
  },
  {
    "uid": "",
    "name": "Alvin 2",
    "email": "altisari02@gmail.com",
    "customerId": "fxxrcHlLv2H7NPPVLE7J",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1751155200,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "createdAt": {
      "_seconds": 1731324424,
      "_nanoseconds": 819000000
    },
    "lastUpdated": {
      "_seconds": 1731324424,
      "_nanoseconds": 819000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "JyiYxJsRF8AQ26gx60X5"
  },
  {
    "uid": "",
    "name": "Giovanni Satrio Putra",
    "email": "giovannisatrio@gmail.com",
    "customerId": "boMEZRhEzgDxLVtf9ZaG",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1752019200,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "receiptUrl": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/transfer-receipt%2F1731149305-WhatsApp%20Image%202024-07-19%20at%2023.11.30.webp?alt=media&token=f830cb13-0b47-4900-b445-459bf57348f3",
    "createdAt": {
      "_seconds": 1731149315,
      "_nanoseconds": 217000000
    },
    "lastUpdated": {
      "_seconds": 1731149315,
      "_nanoseconds": 217000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "NBGjqOoEWEZGOVSZbI0N"
  },
  {
    "uid": "",
    "name": "Alvin",
    "email": "alvinalbertha92@gmail.com",
    "customerId": "QGgf2kAq8bbRitPdYC83",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1740355200,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "createdAt": {
      "_seconds": 1731315719,
      "_nanoseconds": 177000000
    },
    "lastUpdated": {
      "_seconds": 1731315719,
      "_nanoseconds": 177000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "NHejyDDK6S5g2kRcbAUG"
  },
  {
    "uid": "",
    "name": "Fadzri",
    "email": "blokn139@gmail.com",
    "customerId": "q5hZv67oYadt4bmTiKSu",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1755216000,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "receiptUrl": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/transfer-receipt%2F1731323527-WhatsApp%20Image%202024-08-15%20at%2014.42.48.webp?alt=media&token=f2e34685-3e3a-46f5-a274-00692c1c4311",
    "createdAt": {
      "_seconds": 1731323531,
      "_nanoseconds": 49000000
    },
    "lastUpdated": {
      "_seconds": 1731323531,
      "_nanoseconds": 49000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "QliI5tWDjRm7GiyEXp61"
  },
  {
    "uid": "",
    "name": "Andrew",
    "email": "aooo.nft@gmail.com",
    "customerId": "jWv2ORgZg8YohrcuLoXG",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1756425600,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "receiptUrl": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/transfer-receipt%2F1731315492-transfer%20andrew.webp?alt=media&token=50ebae31-ba6f-4ded-a914-691c1b63e5c7",
    "createdAt": {
      "_seconds": 1731315521,
      "_nanoseconds": 239000000
    },
    "lastUpdated": {
      "_seconds": 1731315521,
      "_nanoseconds": 239000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "Ts5Ke8PzmY2hk02YP3hv"
  },
  {
    "uid": "",
    "name": "Nine",
    "email": "9nahriamusfira@gmail.com",
    "customerId": "m645A8ezqC6oGcqd8UWO",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "KYyy2vYtnHCjL3vgh3MC",
    "productName": "Silver 3 Months",
    "price": 1500000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1736208000,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "receiptUrl": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/transfer-receipt%2F1731313343-WhatsApp%20Image%202024-10-07%20at%2020.31.53.webp?alt=media&token=9cd829d8-ddc4-4ac8-8b15-fd070ccd7a65",
    "createdAt": {
      "_seconds": 1731313350,
      "_nanoseconds": 175000000
    },
    "lastUpdated": {
      "_seconds": 1731313350,
      "_nanoseconds": 175000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "UZEJJUAOzsvbE3HeMm7W"
  },
  {
    "uid": "",
    "name": "patrick agustinus nugroho",
    "email": "nugrohopatrick18@gmail.com",
    "customerId": "PvWd947O63HNFGjSm5RR",
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "expiredAt": {
      "_seconds": 1755043200,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "receiptUrl": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/transfer-receipt%2F1731323466-WhatsApp%20Image%202024-08-13%20at%2022.03.52.webp?alt=media&token=66986b52-fd3f-4677-a643-fbc9b4ad01ba",
    "createdAt": {
      "_seconds": 1731323469,
      "_nanoseconds": 788000000
    },
    "lastUpdated": {
      "_seconds": 1731323469,
      "_nanoseconds": 788000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "affiliatorCustomerId": "boMEZRhEzgDxLVtf9ZaG",
    "affiliateCommission": 1500000,
    "affiliator": {
      "id": "boMEZRhEzgDxLVtf9ZaG",
      "exchange_name": "",
      "uid": "",
      "createdAt": {
        "_seconds": 1725513048,
        "_nanoseconds": 359000000
      },
      "companyId": "byscript",
      "exchange_thumbnail": "",
      "phoneNumber": "6287881807000",
      "city": "Jakarta",
      "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
      "name": "Giovanni Satrio Putra",
      "email": "giovannisatrio@gmail.com",
      "lastUpdatedBy": {
        "uid": "dimK3jZlIsScKq8qTZkhLdn2OTD3",
        "email": "giovannisatrio@gmail.com"
      },
      "isNewUser": false,
      "lastLogin": {
        "_seconds": 1731166456,
        "_nanoseconds": 719000000
      },
      "numberOfLogin": 7,
      "token": "ya29.a0AeDClZCtFieLUt2Xot8zXnEfMdloj_moVEP4gg4FZ6B46uVgQMDoRr5P08jQNn1iDWJMuidTRMaTTpIOZcrnLa6KhuKdrPFGtTdSRId1gI0VOO9afE-7aAzmDqeF5NQ7leFMDKDbJqCi9yvLPYpmWHI51r6AQ3LIIl52aCgYKAYMSARMSFQHGX2Mihfwwf70kAroWo-z__Tdodg0171",
      "lastUpdated": {
        "_seconds": 1731169090,
        "_nanoseconds": 12000000
      },
      "affiliateClicks": 1
    },
    "affiliatePercentage": 30,
    "affiliateLevel": 1,
    "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocIfKyrWE9CBGm10g5e453lbyGZmo4PfKHnzRJSPUcOEgo037rcF=s96-c",
    "id": "UZnor0QFKohy1Tew0eJr"
  },
  {
    "uid": "",
    "name": "Hendy",
    "email": "bigtimes888@gmail.com",
    "customerId": "c3BKGkdFymmPv4SXRwbK",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "KYyy2vYtnHCjL3vgh3MC",
    "productName": "Silver 3 Months",
    "price": 1500000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1735171200,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "receiptUrl": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/transfer-receipt%2F1731314148-WhatsApp%20Image%202024-09-26%20at%2008.02.07.webp?alt=media&token=0b55ccaf-ca1d-47eb-bcb4-3b10898ac54a",
    "createdAt": {
      "_seconds": 1731314155,
      "_nanoseconds": 810000000
    },
    "lastUpdated": {
      "_seconds": 1731314155,
      "_nanoseconds": 810000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "ZlS2MYDsa2TxKqmHVJzr"
  },
  {
    "uid": "",
    "name": "michelle chintya",
    "email": "michellechintya179@gmail.com",
    "customerId": "Mv6ohFSG5PCX62TRyDiC",
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "expiredAt": {
      "_seconds": 1760745600,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "receiptUrl": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/transfer-receipt%2F1731323755-WhatsApp%20Image%202024-10-17%20at%2021.37.06%20(1).webp?alt=media&token=0e34e023-8347-4896-92ec-811c283d5e76",
    "createdAt": {
      "_seconds": 1731323759,
      "_nanoseconds": 560000000
    },
    "lastUpdated": {
      "_seconds": 1731323759,
      "_nanoseconds": 560000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "affiliatorCustomerId": "boMEZRhEzgDxLVtf9ZaG",
    "affiliateCommission": 1500000,
    "affiliator": {
      "id": "boMEZRhEzgDxLVtf9ZaG",
      "exchange_name": "",
      "uid": "",
      "createdAt": {
        "_seconds": 1725513048,
        "_nanoseconds": 359000000
      },
      "companyId": "byscript",
      "exchange_thumbnail": "",
      "phoneNumber": "6287881807000",
      "city": "Jakarta",
      "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
      "name": "Giovanni Satrio Putra",
      "email": "giovannisatrio@gmail.com",
      "lastUpdatedBy": {
        "uid": "dimK3jZlIsScKq8qTZkhLdn2OTD3",
        "email": "giovannisatrio@gmail.com"
      },
      "isNewUser": false,
      "lastLogin": {
        "_seconds": 1731166456,
        "_nanoseconds": 719000000
      },
      "numberOfLogin": 7,
      "token": "ya29.a0AeDClZCtFieLUt2Xot8zXnEfMdloj_moVEP4gg4FZ6B46uVgQMDoRr5P08jQNn1iDWJMuidTRMaTTpIOZcrnLa6KhuKdrPFGtTdSRId1gI0VOO9afE-7aAzmDqeF5NQ7leFMDKDbJqCi9yvLPYpmWHI51r6AQ3LIIl52aCgYKAYMSARMSFQHGX2Mihfwwf70kAroWo-z__Tdodg0171",
      "lastUpdated": {
        "_seconds": 1731169090,
        "_nanoseconds": 12000000
      },
      "affiliateClicks": 1
    },
    "affiliatePercentage": 30,
    "affiliateLevel": 1,
    "photoURL": "",
    "id": "eHSVGKwndAOzNYtfrCCF"
  },
  {
    "uid": "",
    "name": "agres",
    "email": "agress321@gmail.com",
    "customerId": "IOszdV8lbzH4yavi8Nxa",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1749340800,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "createdAt": {
      "_seconds": 1731313784,
      "_nanoseconds": 52000000
    },
    "lastUpdated": {
      "_seconds": 1731313784,
      "_nanoseconds": 52000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "n0sJAvCSLoKHDef0uiSs"
  },
  {
    "uid": "",
    "name": "Muhammad Nashir",
    "email": "mnashir76787@gmail.com",
    "customerId": "nRhEo8AgUYX0dfFdyIi8",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "TRBmPwtubl8FVP9E7oKM",
    "productName": "Diamond 12 Months",
    "price": 5000000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1746230400,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "receiptUrl": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/transfer-receipt%2F1731314455-WhatsApp%20Image%202024-05-03%20at%2016.38.33.webp?alt=media&token=b217a5f0-9021-432a-ad0d-08c4b19e3acf",
    "createdAt": {
      "_seconds": 1731314460,
      "_nanoseconds": 202000000
    },
    "lastUpdated": {
      "_seconds": 1731314460,
      "_nanoseconds": 202000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "oBqjOU3gpAc4nuOjDeWY"
  },
  {
    "uid": "",
    "name": "Tanti",
    "email": "tantimardiana08@gmail.com",
    "customerId": "n85QKKguHIIV5gJVrYw4",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "KYyy2vYtnHCjL3vgh3MC",
    "productName": "Silver 3 Months",
    "price": 1500000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 1739232000,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "createdAt": {
      "_seconds": 1731313102,
      "_nanoseconds": 457000000
    },
    "lastUpdated": {
      "_seconds": 1731313102,
      "_nanoseconds": 457000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "p6FMyNswTbLoispI37IE"
  },
  {
    "uid": "",
    "name": "Tanti",
    "email": "tantimardiana08@gmail.com",
    "customerId": "n85QKKguHIIV5gJVrYw4",
    "affiliatorCustomerId": "",
    "affiliator": {},
    "productId": "Lw3eFbbGKKj8CfgRNlAY",
    "productName": "Special Lifetime!",
    "price": 8500000,
    "affiliateCommission": 0,
    "affiliatePercentage": 0,
    "expiredAt": {
      "_seconds": 4133894400,
      "_nanoseconds": 0
    },
    "paymentStatus": "PAID",
    "createdAt": {
      "_seconds": 1745406823,
      "_nanoseconds": 727000000
    },
    "lastUpdated": {
      "_seconds": 1745406823,
      "_nanoseconds": 727000000
    },
    "createdBy": "CADyUn6k7qMkhn89ftO4Gr4zGpw2",
    "companyId": "byscript",
    "id": "yATVR6ZYMbGfWfl6NWVw"
  }
];
function getMostRecentSubscriptions(subscriptionsArray) {
  const userMap = {};

  for (const sub of subscriptionsArray) {
    const customerId = sub.customerId;
    const createdAt = sub.createdAt?._seconds ? new Date(sub.createdAt._seconds * 1000) : new Date();

    if (!userMap[customerId] || new Date(userMap[customerId].createdAt._seconds * 1000) < createdAt) {
      userMap[customerId] = sub;
    }
  }

  // Convert map back to an array
  return Object.values(userMap);
}

export async function GET() {

  try {
    const processed = getMostRecentSubscriptions(DATA).map(sub => ({
      uid: sub.uid,
      customerId : sub.customerId,
      paymentStatus: sub.paymentStatus,
      expiredAt: sub.expiredAt,
      productName: sub.productName,
      name : sub.name,
      isPremium:sub.expiredAt._seconds > moment().unix(),
      comparison : `now ${moment().format('llll')} expired ${moment.unix(sub.expiredAt._seconds).format('llll')}`,
      lastSubscriptionId : sub.id
    }));
    console.log(`datalength : ${DATA.length}`);

    const resultPromise = await Promise.allSettled(processed.map(async(sub) => {
      try {
        return await adminDb.collection('customers').doc(sub.customerId).update({
          uid: sub.uid,
          paymentStatus: sub.paymentStatus,
          productName: sub.productName,
          isPremium:sub.expiredAt._seconds > moment().unix(),
          lastSubscriptionId : sub.lastSubscriptionId
        })
      } catch (error) {
        console.log(error.message)
        throw new Error(error.message)
      }
      
    }))
    return Response.json({
      processed,
      resultPromise,
      length:processed.length,
      status: true,
    });

  
    // let result = [];
    // let q = adminDb
    //   .collection('subscriptions')
    //   .where('uid', '==', '')

    // const querySnapshot = await q
    //   // .limit(20)
    //   .get();


    // const snapshot = await q
    //   .count()
    //   .get();
    // console.log(snapshot.data().count);
    // querySnapshot.forEach((doc) => {
    //   result.push({ ...doc.data(), id: doc.id });
    // })


    // return Response.json({
    //   result,
    //   status: true,
    // });


  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}