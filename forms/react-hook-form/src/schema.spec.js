import * as yup from "yup";

describe("Schema", () => {
  const schema = yup
    .number()
    .transform(v => (v === "" ? null : v))
    .nullable();
  it.each([null, 1, 1.2, undefined, "0"])("should validate %s", async value => {
    await expect(schema.validate(value)).resolves.toEqual(value);
  });

  it.each([NaN, "hello", ""])("should not validate %s", async value => {
    await expect(schema.validate(value)).rejects.toEqual({});
  });
});
