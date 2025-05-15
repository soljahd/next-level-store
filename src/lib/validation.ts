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
  street: z.string().min(1, 'Street name is too short').max(100, 'Street name is too long'),
  postcode: z.string().regex(/^\d+$/, 'Please enter a valid postcode').length(6, 'Please enter a valid postcode'),
  country: z.string().min(1, 'Please select a country'),
  city: z.string().min(1, 'Please enter a city'),
  isDefault: z.boolean(),
});

export const registerScheme = loginScheme.extend({
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
  shippingAddress: addressScheme,
  billingAddress: addressScheme.optional(),
});

export type LoginFormData = z.infer<typeof loginScheme>;
export type AddressFormData = z.infer<typeof addressScheme>;
export type RegisterFormData = z.infer<typeof registerScheme>;
