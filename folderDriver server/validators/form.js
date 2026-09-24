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
    .min(2, "Min characters should be 2")
    .max(50, "Max characters should be 50")
    .optional()
    .transform(clean),

  email: z
    .string()
    .email("Valid email is required")
    .transform((val) => clean(val).toLowerCase().trim()),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export default form;
