const lib = require("./../lib");
const db = require("./../db");
const mail = require("./../mail");

describe("absolute", () => {
  it("should return positive if input is positive", () => {
    const result = lib.absolute(1);
    expect(result).toBe(1);
  });

  it("should return positive if input is negative", () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });

  it("should return zero if input is zero", () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
});

describe("greet", () => {
  it("should return the provided name", () => {
    const result = lib.greet("Xyz");
    expect(result).toContain("Xyz");
    expect(result).toMatch(/Xyz/);
  });
});

describe("getCurrencies", () => {
  it("should return USD, AUD, EUR", () => {
    const result = lib.getCurrencies();

    // proper way
    expect(result).toContain("EUR");
    expect(result).toContain("USD");
    expect(result).toContain("AUD");

    // best way
    expect(result).toEqual(expect.arrayContaining(["EUR", "USD", "AUD"]));
  });
});

describe("getProduct", () => {
  it("should return product with the given id", () => {
    const result = lib.getProduct("1");
    expect(result).toEqual({ id: "1", price: 10 }); // we need to list all properties of object
    expect(result).toMatchObject({ id: "1" }); // we don't need to list all properties of object, only subset will suffice
    expect(result).toHaveProperty("id", "1");
  });
});

describe("registerUser", () => {
  it("should throw exception if username is falsy", () => {
    // null
    // NaN
    // ''
    // undefined
    // false
    // 0
    const args = [null, NaN, undefined, "", 0, false];
    args.forEach((arg) => {
      expect(() => {
        lib.registerUser(arg);
      }).toThrow();
    });
  });

  it("should return user object", () => {
    const result = lib.registerUser("testuser");
    expect(result).toHaveProperty("username", "testuser");
    expect(result.id).toBeGreaterThan(0);
  });
});

describe("applyDiscount", () => {
  it("should apply 10% discount if customer has more than 10 points", () => {
    db.getCustomerSync = function (customerId) {
      console.log("Fake customer data used");
      return { customerId: customerId, points: 20 };
    };
    const order = { customerId: 1, totalPrice: 10 };
    lib.applyDiscount(order);
    expect(order.totalPrice).toBe(9);
  });

  it("should not apply 10% discount if customer has less than 10 points", () => {
    db.getCustomerSync = function (customerId) {
      console.log("Fake customer data used");
      return { customerId: customerId, points: 9 };
    };
    const order = { customerId: 1, totalPrice: 10 };
    lib.applyDiscount(order);
    expect(order.totalPrice).toBe(10);
  });
});

describe("notifyCustomer", () => {
  it("should send an email to the customer", () => {
    db.getCustomerSync = function (customerId) {
      return { email: "test" };
    };
    let mailSent = false;
    mail.send = function (to, subject) {
      mailSent = true;
    };
    lib.notifyCustomer({ customerId: 1 });
    expect(mailSent).toBe(true);
  });

  it("should send an email to the customer using jest mock function", () => {
    db.getCustomerSync = jest.fn().mockReturnValue({ email: "test" });
    mail.send = jest.fn();

    lib.notifyCustomer({ customerId: 1 });

    expect(mail.send).toHaveBeenCalled();
    expect(mail.send.mock.calls[0][0]).toBe("test");
    expect(mail.send.mock.calls[0][1]).toMatch(/order/);
  });
});
