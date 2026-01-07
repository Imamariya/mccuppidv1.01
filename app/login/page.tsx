
import React, { useState, useEffect } from 'react';
import LoginForm from '../../components/LoginForm';

const LoginPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative min-h-screen w-full flex flex-col bg-zinc-950 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-10">
          <header className="text-center space-y-2">
            <h1 
              className="text-white text-3xl font-brand italic cursor-pointer"
              onClick={() => window.location.hash = '#/'}
            >
              MalluCupid
            </h1>
            <p className="text-zinc-400 text-sm font-medium tracking-wide">
              Welcome back, your heart awaits.
            </p>
          </header>

          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
            <LoginForm />
          </div>

          <footer className="text-center space-y-4 pt-4">
            <p className="text-zinc-500 text-sm">
              Don't have an account?{' '}
              <button 
                onClick={() => window.location.hash = '#/signup'}
                className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
              >
                Sign Up
              </button>
            </p>
            <button 
              onClick={() => window.location.hash = '#/'}
              className="text-zinc-500 text-xs font-medium uppercase tracking-widest hover:text-zinc-300 transition-colors"
            >
              ← Back to Landing
            </button>
          </footer>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
    </div>
  );
};

export default LoginPage;
