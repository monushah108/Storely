import * as z from "zod";
import sanitizeHtml from "sanitize-html";

const clean = (value) =>
  sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  });

const form = z.object({
  name: z
    .string()
    .min(5, "Min characters should be 5")
    .max(25, "Max characters should be 25")
    .optional()
    .transform(clean),

  email: z.string().email("Valid email is required").transform(clean),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(10, "Password must be at most 10 characters"),
});

export default form;
