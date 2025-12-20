import React from 'react';
import { SignupForm } from '@/components/auth/SignupForm';

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <SignupForm />
    </div>
  );
};

export default Signup;
