class AppBase {
  static DOMAIN_SERVER = 'http://localhost:8080';
  static API_SERVER = this.DOMAIN_SERVER + '/api';
  static API_CUSTOMER = this.API_SERVER + '/customers';
}

class Customer {
  constructor(id, fullName, email, phone, address, balance) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.balance = balance;
  }
}
