const { processInput } = require("../src/finder");

test("Check output for input2.txt", () => {
  expect(processInput("input1.txt")).toBe("1 13:00-13:59");
});

test("Check output for input2.txt", () => {
  expect(processInput("input2.txt")).toBe("2 08:00-08:59");
});

test("Check output for input3.txt", () => {
  expect(processInput("input3.txt")).toBe("2 08:00-08:59");
});

test("Check output for input4.txt", () => {
  expect(processInput("input4.txt")).toBe("2 12:29-13:28");
});

test("Check output for input6.txt", () => {
  expect(processInput("input5.txt")).toBe("3 13:18-14:17");
});
