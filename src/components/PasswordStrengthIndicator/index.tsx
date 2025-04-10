export const PasswordStrengthIndicator = ({
  password,
}: {
  password: string;
}) => {
  if (!password) return null;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  let strength = 0;
  if (hasUpperCase) strength++;
  if (hasLowerCase) strength++;
  if (hasNumbers) strength++;
  if (hasSpecialChar) strength++;
  if (isLongEnough) strength++;

  const getStrengthText = () => {
    if (strength <= 2) return 'Fraca';
    if (strength <= 3) return 'Média';
    if (strength <= 4) return 'Forte';
    return 'Muito forte';
  };

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-green-500';
    return 'bg-green-700';
  };

  return (
    <div className='mt-2'>
      <div className='h-1 w-full bg-gray-200 rounded-full'>
        <div
          className={`h-1 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
      <p className='text-xs mt-1 text-gray-600'>
        Força da senha: {getStrengthText()}
      </p>
    </div>
  );
};
