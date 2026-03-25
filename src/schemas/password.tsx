
import { z } from "zod";

const passwordSchema = z.string().min(6).max(60);

  const validatePassword = (password: string) => {
    if (!password) return { isValid: false, error: "" };
    const result = passwordSchema.safeParse(password);
    return {
      isValid: result.success,
      error: result.success ? "" : "A senha deve ter pelo menos 6 caracteres",
    };
  };

export { validatePassword };
