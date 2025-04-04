export class PasswordService {
  static validatePassword(
    password: string,
    confirmPassword: string,
  ): { isValid: boolean; strength: number } {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password?.length >= 8;

    let strength = 0;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChar) strength++;
    if (isLongEnough) strength++;

    return {
      isValid: !!(
        password &&
        confirmPassword &&
        password === confirmPassword &&
        strength >= 3
      ),
      strength,
    };
  }

  static getPasswordStrengthMessage(strength: number): string {
    if (strength < 3) {
      return 'A senha deve ser mais forte. Inclua letras maiúsculas, minúsculas, números e caracteres especiais.';
    }
    return '';
  }
}
