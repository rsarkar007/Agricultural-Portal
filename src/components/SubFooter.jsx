import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function SubFooter() {
  const { user } = useAuth();

  if (user) {
    // Portal footer — minimal
    return (
      <footer className="bg-gray-100/90 border-t border-gray-200 mt-auto">
        <div className="app-content-width px-4 py-4 text-center text-sm text-gray-500">
          Copyright &copy; 2026 Department of Agriculture. Govt. of West Bengal. All Rights Reserved
        </div>
      </footer>
    );
  }

  // Public footer — original style
  return (
    <div className="w-full bg-[#f8f9fa] border-t border-gray-200 mt-0 py-4 text-center">
      <div className="app-content-width px-4">
        <p className="text-xs text-gray-500">Copyright &copy; 2026 Department of Agriculture. Govt. of West Bengal. All Rights Reserved</p>
      </div>
    </div>
  );
}
