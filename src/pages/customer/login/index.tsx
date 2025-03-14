import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from '@/config/firebase/firebase';
import { ConfirmationResult, signOut } from 'firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/router';

const PhoneAuth = () => {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState<null | ConfirmationResult>(
    null,
  );
  const [message, setMessage] = useState('');

  const sendOtp = async () => {
    try {
      await signOut(auth);
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
          },
        );
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier,
      );
      setConfirmation(confirmationResult);
      setMessage('OTP enviado!');
      router.replace('/customer/home');
    } catch (error) {
      console.error('Erro ao enviar OTP:', error);
      setMessage('Falha ao enviar OTP.');
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await confirmation?.confirm(otp);
      const idToken = await result?.user.getIdToken();
      console.log('Usuário autenticado com ID Token:', idToken);
    } catch (error) {
      console.error('Erro ao verificar OTP:', error);
      setMessage('Código inválido.');
    }
  };

  return (
    <div>
      <h2>Autenticação via OTP</h2>
      <input
        type='text'
        placeholder='Número de telefone'
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={sendOtp}>Enviar OTP</button>

      {confirmation && (
        <>
          <input
            type='text'
            placeholder='Digite o código OTP'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verificar OTP</button>
        </>
      )}

      <div id='recaptcha-container'></div>
      <p>{message}</p>
    </div>
  );
};

export default PhoneAuth;
