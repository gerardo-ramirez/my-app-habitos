'use client';

import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { EmailConfirmationStatus } from './EmailConfirmationStatus';

type AuthView = 'login' | 'register' | 'confirmation';

export const AuthForm = () => {
  const [view, setView] = useState<AuthView>('login');
  const [registeredEmail, setRegisteredEmail] = useState<string>('');

  const handleRegisterSuccess = (email: string) => {
    setRegisteredEmail(email);
    setView('confirmation');
  };

  const handleBackToLogin = () => {
    setView('login');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {view === 'login' && (
        <LoginForm onToggleForm={() => setView('register')} />
      )}
      
      {view === 'register' && (
        <RegisterForm 
          onToggleForm={() => setView('login')}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
      
      {view === 'confirmation' && (
        <EmailConfirmationStatus 
          email={registeredEmail}
          onBackToLogin={handleBackToLogin}
        />
      )}
    </div>
  );
};