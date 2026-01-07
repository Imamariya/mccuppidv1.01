
import React, { useState, useEffect, useCallback } from 'react';
import DesktopBlocker from './components/DesktopBlocker';
import LandingPage from './app/page';
import LoginPage from './app/login/page';
import SignupPage from './app/signup/page';
import UserDashboard from './app/user/dashboard/page';
import AdminDashboard from './app/admin/dashboard/page';
import ChatPage from './app/user/chat/[matchId]/page';

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
    case '#/user/dashboard':
      return <UserDashboard />;
    case '#/admin/dashboard':
      return <AdminDashboard />;
    case '#/':
    default:
      return <LandingPage />;
  }
};

export default App;
