import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Introduce un email válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().optional(),
    email: z
      .string()
      .min(1, "El email es obligatorio")
      .email("Introduce un email válido"),
    confirmEmail: z
      .string()
      .min(1, "Confirma el email")
      .email("Introduce un email válido"),
    password: z
      .string()
      .min(1, "La contraseña es obligatoria")
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirma la contraseña"),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Los emails no coinciden",
    path: ["confirmEmail"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export interface LoginServerPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "member";
  createdAt: string;
  isClub?: boolean;
}

export interface UserSession {
  user: User;
  expiresAt?: string;
}
