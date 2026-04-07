import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApplicants } from '../../context/ApplicantContext';

export default function GramdootDashboard() {
  const { user } = useAuth();
  const { applicants, loadFarmers } = useApplicants();

  // Pull latest farmer list from server on every mount
  useEffect(() => { loadFarmers(); }, []);

  const total = applicants.filter((a) => a.status !== 'deleted').length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* <PortalHeader /> */}

      <main className="app-content-width flex-grow px-3 sm:px-4 md:px-6 py-8 sm:py-10">

        <h2 className="section-title text-sm sm:text-base font-bold text-gray-800 text-center mb-6">
          DASHBOARD SUMMARY
        </h2>

        <div className="panel-card-soft px-5 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-700">

          <span className="font-medium text-center sm:text-left">
            Quick Registration Application Count :
          </span>

          <span className="mx-auto sm:mx-0 inline-flex items-center justify-center bg-gray-600 text-white text-xs sm:text-sm font-bold rounded-full h-8 px-4 min-w-[32px]">
            {total}
          </span>

        </div>

      </main>

      {/* <PortalFooter /> */}
    </div>
  );
}
