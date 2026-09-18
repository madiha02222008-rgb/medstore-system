export type Lang = "en" | "hi";

export const translations = {
  // Brand / general
  brand: { en: "MedStock Register", hi: "मेडस्टॉक रजिस्टर" },
  brandShort: { en: "MedStock", hi: "मेडस्टॉक" },
  logout: { en: "Logout", hi: "लॉग आउट" },
  cancel: { en: "Cancel", hi: "रद्द करें" },
  save: { en: "Save", hi: "सेव करें" },
  loading: { en: "Loading...", hi: "लोड हो रहा है..." },
  actions: { en: "Actions", hi: "कार्रवाई" },
  date: { en: "Date", hi: "तारीख" },
  status: { en: "Status", hi: "स्थिति" },
  active: { en: "Active", hi: "सक्रिय" },
  inactive: { en: "Inactive", hi: "निष्क्रिय" },

  // Login page
  loginSubtitle: { en: "Enter your email and password to continue.", hi: "जारी रखने के लिए अपना ईमेल और पासवर्ड दर्ज करें।" },
  emailLabel: { en: "Email", hi: "ईमेल" },
  passwordLabel: { en: "Password", hi: "पासवर्ड" },
  loginButton: { en: "Login", hi: "लॉग इन करें" },
  loggingIn: { en: "Logging in...", hi: "लॉग इन हो रहा है..." },
  chooseLanguage: { en: "Choose your language", hi: "अपनी भाषा चुनें" },
  firstLoginNote: {
    en: "For first login use: email admin@medstore.local, password Admin@123 (created during backend setup).",
    hi: "पहली बार लॉग इन के लिए उपयोग करें: ईमेल admin@medstore.local, पासवर्ड Admin@123 (बैकएंड सेटअप के दौरान बनाया गया)।",
  },

  // Nav / roles
  navMedicines: { en: "Medicines & Stock", hi: "दवाइयां व स्टॉक" },
  navStock: { en: "Stock", hi: "स्टॉक" },
  navPurchases: { en: "Purchases", hi: "खरीद" },
  navOrders: { en: "Orders", hi: "ऑर्डर" },
  navPlaceOrder: { en: "Place Order", hi: "ऑर्डर करें" },
  navSales: { en: "Sales", hi: "बिक्री" },
  navNewBill: { en: "New Bill", hi: "नया बिल" },
  navBills: { en: "Bills", hi: "बिल" },
  navParties: { en: "Customers & Suppliers", hi: "ग्राहक व आपूर्तिकर्ता" },
  navPayments: { en: "Payments", hi: "भुगतान" },
  navPaymentsUdhaar: { en: "Payments & Outstanding", hi: "भुगतान व बकाया" },
  navUsers: { en: "Users", hi: "उपयोगकर्ता" },
  navLedger: { en: "Ledger", hi: "लेजर" },

  roleAdmin: { en: "Admin", hi: "एडमिन" },
  roleStaff: { en: "Staff / Salesman", hi: "स्टाफ / सेल्समैन" },
  roleRetailer: { en: "Retailer / Customer", hi: "रिटेलर / ग्राहक" },
  roleAccountant: { en: "Accountant", hi: "अकाउंटेंट" },

  // Medicines page
  medicinesTitle: { en: "Medicines & Stock", hi: "दवाइयां व स्टॉक" },
  newMedicine: { en: "+ New Medicine", hi: "+ नई दवा" },
  name: { en: "Name", hi: "नाम" },
  category: { en: "Category", hi: "श्रेणी" },
  unit: { en: "Unit", hi: "इकाई" },
  mrp: { en: "MRP", hi: "एमआरपी" },
  wholesaleRate: { en: "Wholesale Rate", hi: "थोक दर" },
  lowStockAlert: { en: "Low Stock Alert Qty", hi: "कम स्टॉक चेतावनी मात्रा" },
  currentStock: { en: "Current Stock", hi: "वर्तमान स्टॉक" },
  addMedicine: { en: "Add Medicine", hi: "दवा जोड़ें" },

  // Purchases page
  purchasesTitle: { en: "Purchases", hi: "खरीद" },
  newPurchase: { en: "+ New Purchase", hi: "+ नई खरीद" },
  supplier: { en: "Supplier", hi: "आपूर्तिकर्ता" },
  medicine: { en: "Medicine", hi: "दवा" },
  batchNumber: { en: "Batch Number", hi: "बैच नंबर" },
  expiryDate: { en: "Expiry Date", hi: "समाप्ति तिथि" },
  quantity: { en: "Quantity", hi: "मात्रा" },
  purchaseRate: { en: "Purchase Rate", hi: "खरीद दर" },
  addItem: { en: "Add Item", hi: "आइटम जोड़ें" },
  savePurchase: { en: "Save Purchase", hi: "खरीद सेव करें" },
  total: { en: "Total", hi: "कुल" },
  chooseSupplier: { en: "Select Supplier", hi: "आपूर्तिकर्ता चुनें" },
  chooseMedicine: { en: "Select Medicine", hi: "दवा चुनें" },
  invoiceNo: { en: "Invoice", hi: "इनवॉइस" },
  expiryDatePlaceholder: { en: "Expiry (YYYY-MM-DD)", hi: "समाप्ति तिथि (YYYY-MM-DD)" },

  // Orders page
  ordersTitle: { en: "Orders", hi: "ऑर्डर" },
  placeOrderTitle: { en: "Place an Order", hi: "ऑर्डर करें" },
  sendOrder: { en: "Send Order", hi: "ऑर्डर भेजें" },
  myOrders: { en: "My Orders", hi: "मेरे ऑर्डर" },
  items: { en: "Items", hi: "आइटम" },
  makeInvoice: { en: "Create Invoice", hi: "बिल बनाएं" },
  reject: { en: "Reject", hi: "अस्वीकार करें" },
  noPendingOrders: { en: "No pending orders.", hi: "कोई लंबित ऑर्डर नहीं है।" },
  orderSent: { en: "Order sent!", hi: "ऑर्डर भेज दिया गया!" },
  invoiceCreated: { en: "Invoice created!", hi: "बिल बन गया!" },
  statusPending: { en: "Pending", hi: "लंबित" },
  statusConverted: { en: "Converted", hi: "बिल में बदला" },
  statusRejected: { en: "Rejected", hi: "अस्वीकृत" },

  // Users page
  usersTitle: { en: "Users", hi: "उपयोगकर्ता" },
  newUser: { en: "+ New User", hi: "+ नया उपयोगकर्ता" },
  createUserButton: { en: "Create User", hi: "उपयोगकर्ता बनाएं" },
  userCreated: { en: "New user created!", hi: "नया उपयोगकर्ता बन गया!" },
  role: { en: "Role", hi: "भूमिका" },
  created: { en: "Created", hi: "बना" },
  deactivate: { en: "Deactivate", hi: "निष्क्रिय करें" },
  reactivate: { en: "Reactivate", hi: "पुनः सक्रिय करें" },
  confirmDeactivate: { en: "Deactivate this user? They will not be able to log in.", hi: "इस उपयोगकर्ता को निष्क्रिय करें? यह लॉग इन नहीं कर पाएगा।" },

  // Ledger page
  ledgerTitle: { en: "Ledger", hi: "लेजर" },
  customer: { en: "Customer", hi: "ग्राहक" },
  amount: { en: "Amount", hi: "राशि" },
  mode: { en: "Mode", hi: "माध्यम" },
  billTotal: { en: "Bill Total", hi: "बिल कुल" },

  // Sales page
  salesTitle: { en: "Sales", hi: "बिक्री" },
  newBillTitle: { en: "New Bill", hi: "नया बिल" },
  generateBill: { en: "Generate Bill", hi: "बिल बनाएं" },
  billNo: { en: "Bill No.", hi: "बिल संख्या" },
  paid: { en: "Paid", hi: "भुगतान किया" },
  unpaid: { en: "Unpaid", hi: "अवैतनिक" },
  partial: { en: "Partial", hi: "आंशिक" },
  chooseCustomer: { en: "Select Customer", hi: "ग्राहक चुनें" },
  recentBills: { en: "Recent Bills", hi: "हाल के बिल" },
  bill: { en: "Bill", hi: "बिल" },

  // Payments page
  paymentsTitle: { en: "Payments", hi: "भुगतान" },
  outstandingTitle: { en: "Outstanding (Udhaar) Summary", hi: "बकाया (उधार) सारांश" },
  recordPayment: { en: "Record Payment", hi: "भुगतान दर्ज करें" },
  balance: { en: "Balance", hi: "शेष राशि" },
  duePayments: { en: "Due Payments", hi: "बकाया भुगतान" },
  markPaid: { en: "Mark Paid", hi: "भुगतान दर्ज करें" },
  outstandingByCustomer: { en: "Outstanding Summary (by Customer)", hi: "बकाया सारांश (ग्राहक अनुसार)" },

  // Parties page
  partiesTitle: { en: "Customers & Suppliers", hi: "ग्राहक व आपूर्तिकर्ता" },
  customers: { en: "Customers", hi: "ग्राहक" },
  suppliers: { en: "Suppliers", hi: "आपूर्तिकर्ता" },
  phone: { en: "Phone", hi: "फ़ोन" },
  addCustomer: { en: "Add Customer", hi: "ग्राहक जोड़ें" },
  addSupplier: { en: "Add Supplier", hi: "आपूर्तिकर्ता जोड़ें" },
};

export type TranslationKey = keyof typeof translations;
