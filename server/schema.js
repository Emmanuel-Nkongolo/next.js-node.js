const z = require("zod");

const schema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z.string().refine(
    (val) => {
      // Checking if the date string is a valid date
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Invalid date format for date of birth" }
  ),
});

module.exports = schema;
