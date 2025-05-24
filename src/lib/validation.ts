import { z } from 'zod';
import dayjs from 'dayjs';

export const loginScheme = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .regex(/^\S(.*\S)?$/, 'Password must not contain leading or trailing whitespace')
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
      'Password must contain at least one uppercase letter (A-Z), one lowercase letter (a-z) and one digit (0-9)',
    )
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password is too long'),
});

export const addressScheme = z.object({
  streetName: z
    .string()
    .regex(/^\S(.*\S)?$/, 'Street must not contain leading or trailing whitespace')
    .regex(/^(?=.*[a-zA-Z]).+$/, 'Please enter a correct street address')
    .min(1, 'Please enter a street address')
    .max(100, 'Street name is too long'),
  postalCode: z.string().regex(/^\d+$/, 'Please enter a valid postcode').length(6, 'Please enter a valid postcode'),
  country: z.string().min(1, 'Please select a country'),
  city: z
    .string()
    .regex(/^\S(.*\S)?$/, 'City must not contain leading or trailing whitespace')
    .regex(/^[a-zA-Z]+$/, 'Please enter a correct city')
    .min(1, 'Please enter a city')
    .max(100, 'City name is too long'),
  isDefault: z.boolean(),
});

export const userScheme = z.object({
  firstName: z
    .string()
    .regex(/^[a-zA-Zа-яА-Я]+$/, 'Please enter a correct first name')
    .min(1, 'First name is too short')
    .max(20, 'First name is too long'),
  lastName: z
    .string()
    .regex(/^[a-zA-Zа-яА-Я]+$/, 'Please enter a correct last name')
    .min(1, 'Last name is too short')
    .max(20, 'Last name is too long'),
  dateOfBirth: z
    .custom<dayjs.Dayjs>((value) => dayjs.isDayjs(value) && value.isValid(), 'Please enter a valid date of Birth')
    .refine((date) => date.isBefore(dayjs()), 'Please enter a valid date of Birth')
    .refine((date) => dayjs().diff(date, 'year') >= 13, 'Age must be at least 13 years')
    .refine((date) => dayjs().diff(date, 'year') <= 125, 'Incorrect date of Birth. Too old'),
});

export const registerScheme = loginScheme.extend({
  ...userScheme.shape,
  shippingAddress: addressScheme,
  billingAddress: addressScheme.optional(),
});

export const profileEditScheme = z.object({
  firstName: userScheme.shape.firstName,
  lastName: userScheme.shape.lastName,
  dateOfBirth: userScheme.shape.dateOfBirth,
  email: loginScheme.shape.email,
});

export const passwordChangeScheme = z
  .object({
    currentPassword: loginScheme.shape.password,
    newPassword: loginScheme.shape.password,
    repeatPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: "Passwords don't match",
    path: ['repeatPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from old password',
    path: ['newPassword'],
  });

export const addressEditScheme = z.object({
  addressType: z.array(z.string().min(1, 'Wrong selection')).max(2, 'Wrong selection'),
  streetName: addressScheme.shape.streetName,
  postalCode: addressScheme.shape.postalCode,
  country: addressScheme.shape.country,
  city: addressScheme.shape.city,
  isShippingDefault: z.boolean(),
  isBillingDefault: z.boolean(),
});

export const authStateScheme = z.object({
  state: z.object({
    isLoggedIn: z.boolean(),
    user: loginScheme.nullable(),
  }),
  version: z.number(),
});

export type LoginFormData = z.infer<typeof loginScheme>;
export type AddressFormData = z.infer<typeof addressScheme>;
export type userFormData = z.infer<typeof userScheme>;
export type RegisterFormData = z.infer<typeof registerScheme>;
export type profileEditFormData = z.infer<typeof profileEditScheme>;
export type passwordChangeFormData = z.infer<typeof passwordChangeScheme>;
export type addressEditFormData = z.infer<typeof addressEditScheme>;
export type AuthStateData = z.infer<typeof authStateScheme>;
