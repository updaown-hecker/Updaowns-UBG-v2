import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Placeholder props for now
  const placeholderOnSearch = (query: string) => {
    console.log('Search from layout:', query);
  };
  const placeholderOnMenuToggle = () => {
    console.log('Menu toggle from layout');
  };
  const placeholderIsMenuOpen = false;
  const placeholderActiveTab = 'home'; // Or whatever default tab you want
  const placeholderOnTabChange = (tab: string) => {
    console.log('Tab change from layout:', tab);
  };
  const placeholderIsOpen = false; // Assuming navigation open state

  return (
    <div>
      <Header
        onSearch={placeholderOnSearch}
        onMenuToggle={placeholderOnMenuToggle}
        isMenuOpen={placeholderIsMenuOpen}
      />
      <Navigation
        activeTab={placeholderActiveTab}
        onTabChange={placeholderOnTabChange}
        isOpen={placeholderIsOpen}
      />
      <main>{children}</main>
    </div>
  );
};


export default Layout;