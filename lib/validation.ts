import { z, ZodIssue } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Dirección de correo inválida" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

export const validateLogin = (data: unknown) => {
  try {
    loginSchema.parse(data);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const emailError = error.issues.find((e: ZodIssue) => e.path[0] === 'email');
      const passwordError = error.issues.find((e: ZodIssue) => e.path[0] === 'password');
      return {
        email: emailError ? emailError.message : undefined,
        password: passwordError ? passwordError.message : undefined,
      };
    }
    return { email: 'Ocurrió un error inesperado', password: 'Ocurrió un error inesperado' };
  }
};
