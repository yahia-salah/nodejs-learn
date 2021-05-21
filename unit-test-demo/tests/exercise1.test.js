const fizzBuzz = require("./../exercise1").fizzBuzz;

describe("fizzBuzz", () => {
  it("should thorw exception if input not number", () => {
    const args = ["", null, undefined, false];
    args.forEach((arg) => {
      expect(() => {
        fizzBuzz(arg);
      }).toThrow();
    });
  });

  it("should return FizzBuzz if input is divisible by 3 and 5", () => {
    const result = fizzBuzz(15);
    expect(result).toBe("FizzBuzz");
  });

  it("should return Fizz if input is divisible by 3 and not 5", () => {
    const result = fizzBuzz(6);
    expect(result).toBe("Fizz");
  });

  it("should return Buzz if input is divisible by 5 and not 3", () => {
    const result = fizzBuzz(10);
    expect(result).toBe("Buzz");
  });

  it("should return input if input is not divisible by 3 nor 5", () => {
    const result = fizzBuzz(11);
    expect(result).toBe(11);
  });
});
