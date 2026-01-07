
import React, { useState, useEffect, useCallback } from 'react';
import DesktopBlocker from './components/DesktopBlocker';
import LandingPage from './app/page';
import LoginPage from './app/login/page';
import SignupPage from './app/signup/page';
import ForgotPasswordPage from './app/forgot-password/page';
import ResetPasswordPage from './app/reset-password/page';
import UserDashboard from './app/user/dashboard/page';
import AdminDashboard from './app/admin/dashboard/page';
import ChatPage from './app/user/chat/[matchId]/page';
import UpgradePage from './app/pro/upgrade/page';
import CheckoutPage from './app/pro/checkout/page';
import PaymentSuccessPage from './app/pro/success/page';
import PaymentFailurePage from './app/pro/failure/page';
import EditProfilePage from './app/user/profile/edit/page';

const App: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');

  const checkViewport = useCallback(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

  useEffect(() => {
    checkViewport();
    window.addEventListener('resize', checkViewport);
    
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('resize', checkViewport);
      window.removeEventListener('hashchange', handleHashChange);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [checkViewport]);

  if (isDesktop) {
    return <DesktopBlocker />;
  }

  // Handle Dynamic Routes
  if (currentHash.startsWith('#/user/chat/')) {
    const matchId = currentHash.replace('#/user/chat/', '');
    return <ChatPage matchId={matchId} />;
  }

  // Hash-based Routing Logic
  switch (currentHash) {
    case '#/login':
      return <LoginPage />;
    case '#/signup':
      return <SignupPage />;
    case '#/forgot-password':
      return <ForgotPasswordPage />;
    case '#/reset-password':
      return <ResetPasswordPage />;
    case '#/user/dashboard':
      return <UserDashboard />;
    case '#/user/profile/edit':
      return <EditProfilePage />;
    case '#/admin/dashboard':
      return <AdminDashboard />;
    case '#/pro/upgrade':
      return <UpgradePage />;
    case '#/pro/checkout':
      return <CheckoutPage />;
    case '#/pro/success':
      return <PaymentSuccessPage />;
    case '#/pro/failure':
      return <PaymentFailurePage />;
    case '#/':
    default:
      return <LandingPage />;
  }
};

export default App;
