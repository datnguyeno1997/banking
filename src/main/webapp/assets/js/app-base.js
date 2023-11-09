class Customer {
  constructor(id, fullName, email, phone, locationRegion, balance) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.locationRegion = locationRegion;
    this.balance = balance;
  }
}
class LocationRegion {
  constructor(
      id,
      provinceId,
      provinceName,
      districtId,
      districtName,
      wardId,
      wardName,
      address
  ) {
    this.id = id;
    this.provinceId = provinceId;
    this.provinceName = provinceName;
    this.districtId = districtId;
    this.districtName = districtName;
    this.wardId = wardId;
    this.wardName = wardName;
    this.address = address;
  }
}