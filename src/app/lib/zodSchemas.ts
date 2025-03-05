import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

export const onboardingSchemaLocale = z.object({
  fullName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(150, { message: "Name must be less than 150 characters" }),
  userName: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(150, { message: "Username must be less than 150 characters" })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Username must be alphanumeric and can include hyphens",
    }),
});

export function onboardingSchema(options?: {
  isUserNameUnique: () => Promise<boolean>;
}) {
  return z.object({
    fullName: z
      .string()
      .min(3, { message: "Name must be at least 3 characters" })
      .max(150, { message: "Name must be less than 150 characters" }),
    userName: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(150, { message: "Username must be less than 150 characters" })
      .regex(/^[a-zA-Z0-9-]+$/, {
        message: "Username must be alphanumeric and can include hyphens",
      })
      .pipe(
        z.string().superRefine((_, ctx) => {
          if (typeof options?.isUserNameUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }
          return options.isUserNameUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Username is already taken",
              });
            }
          });
        })
      ),
  });
}
