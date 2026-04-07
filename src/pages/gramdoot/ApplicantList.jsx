import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApplicants } from '../../context/ApplicantContext';
import CyanSpinner from '../../components/CyanSpinner';

const PAGE_SIZE = 20;

export default function ApplicantList() {
  const { user } = useAuth();
  const { applicants, loadFarmers, loadingFarmers, farmersError, farmersMeta } = useApplicants();
  const navigate = useNavigate();

  useEffect(() => {
    loadFarmers();
  }, [loadFarmers]);

  const [search, setSearch] = useState({ ackId: '', name: '', aadhaar: '', mobile: '' });
  const [applied, setApplied] = useState({ ackId: '', name: '', aadhaar: '', mobile: '' });
  const [page, setPage] = useState(1);

  const visible = useMemo(
    () => applicants.filter((a) => a.status !== 'deleted'),
    [applicants]
  );

  const filtered = useMemo(() => {
    return visible.filter((a) => {
      const s = applied;
      return (
        (!s.ackId || (a.ackId || '').toLowerCase().includes(s.ackId.toLowerCase())) &&
        (!s.name || (a.name || '').toLowerCase().includes(s.name.toLowerCase())) &&
        (!s.aadhaar || (a.aadhaar || '').includes(s.aadhaar)) &&
        (!s.mobile || (a.mobile || '').includes(s.mobile))
      );
    });
  }, [visible, applied]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = () => {
    setApplied({ ...search });
    setPage(1);
  };

  const handleReset = () => {
    const empty = { ackId: '', name: '', aadhaar: '', mobile: '' };
    setSearch(empty);
    setApplied(empty);
    setPage(1);
  };

  const goPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const visiblePages = () => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 3); i += 1) pages.push(i);
    return pages;
  };

  return (
    <main className="app-content-width flex-grow px-4 py-8">
      <h2 className="section-title text-sm font-bold text-gray-800 mb-4">
        SEARCH REGISTERED APPLICANT
      </h2>

      <div className="panel-card-soft flex flex-wrap items-end gap-3 mb-6 p-4">
        {[
          { key: 'ackId', label: 'Acknowledgement ID' },
          { key: 'name', label: 'Applicant Name' },
          { key: 'aadhaar', label: 'Aadhar No' },
          { key: 'mobile', label: 'Mobile No' },
        ].map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">{label}</label>
            <input
              type="text"
              value={search[key]}
              onChange={(e) => setSearch({ ...search, [key]: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="field-input !rounded-xl !px-3 !py-2 text-sm w-44"
            />
          </div>
        ))}
        <div className="flex gap-2 pb-0.5">
          <button
            onClick={handleSearch}
            className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className="text-[#0891b2] font-bold text-sm">
          Registered Applicant List ({farmersMeta.serverCount})
        </p>
        <button
          type="button"
          onClick={loadFarmers}
          className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-xs font-medium px-4 py-1.5 rounded transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
        {/* <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
          API farmers: {farmersMeta.serverCount}
        </span>
        <span className="inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 font-medium text-cyan-700">
          Visible in UI: {visible.length}
        </span> */}
        {farmersMeta.loadedAt && (
          <span className="text-gray-500">
            Last loaded: {new Date(farmersMeta.loadedAt).toLocaleString()}
          </span>
        )}
        {user?.email && (
          <span className="text-gray-500">
            User: {user.email}
          </span>
        )}
      </div>

      {/* {loadingFarmers && (
        <div className="mb-4 rounded border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Loading farmer list from API...
        </div>
      )}

      {farmersError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load farmer list: {farmersError}
        </div>
      )} */}

      <div className="table-shell overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-700 text-xs font-semibold border-b border-gray-200">
              <th className="px-3 py-2.5 text-center border-r border-gray-200 w-10">#</th>
              <th className="px-3 py-2.5 text-center border-r border-gray-200">Ack ID</th>
              <th className="px-3 py-2.5 text-center border-r border-gray-200">Applicant Name</th>
              <th className="px-3 py-2.5 text-center border-r border-gray-200">Aadhaar No</th>
              <th className="px-3 py-2.5 text-center border-r border-gray-200">Mobile No</th>
              <th className="px-3 py-2.5 text-center border-r border-gray-200">Status</th>
              <th className="px-3 py-2.5 text-center">Action</th>
            </tr>
          </thead>
            <tbody>
            {loadingFarmers ? (
              <tr>
                <td colSpan={7} className="py-4">
                  <CyanSpinner label="Loading records..." />
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400 text-sm">
                  No records found.
                </td>
              </tr>
            ) : (
              paginated.map((row, idx) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2 text-center text-gray-500 border-r border-gray-100 text-xs">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-xs text-[#0891b2] border-r border-gray-100">
                    <button
                      onClick={() => navigate(`/portal/registration/${row.id}/view`)}
                      className="text-[#0891b2] hover:underline font-mono text-xs"
                    >
                      {row.ackId || '-'}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.name || '-'}</td>
                  <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.aadhaar || '-'}</td>
                  <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.mobile || '-'}</td>
                  <td className="px-3 py-2 text-center border-r border-gray-100">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {(row.status === 'pending' || row.status === 'rejected') && (
                        <button
                          onClick={() => navigate(`/portal/registration/${row.id}/edit`)}
                          title="Edit Application"
                          className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white p-1.5 rounded-xl transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/portal/registration/${row.id}/view`)}
                        title="View Application"
                        className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white p-1.5 rounded-xl transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>
            Showing <strong>{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}</strong> to{' '}
            <strong>{Math.min(page * PAGE_SIZE, filtered.length)}</strong> of{' '}
            <strong>{filtered.length}</strong> records
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goPage(1)}
              disabled={page === 1}
              className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
            >
              First
            </button>
            {visiblePages().map((p) => (
              <button
                key={p}
                onClick={() => goPage(p)}
                className={`px-2.5 py-1 text-xs border rounded transition-colors ${p === page
                  ? 'bg-[#3eb0c9] text-white border-[#3eb0c9]'
                  : 'border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {p}
              </button>
            ))}
            {totalPages > 3 && page < totalPages && (
              <>
                <span className="px-1 text-gray-400">...</span>
                <button
                  onClick={() => goPage(totalPages)}
                  className="px-2.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => goPage(page + 1)}
              disabled={page === totalPages}
              className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>
            <button
              onClick={() => goPage(totalPages)}
              disabled={page === totalPages}
              className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Approved', cls: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-800' },
  sent_to_bank: { label: 'Sent to Bank', cls: 'bg-blue-100 text-blue-800' },
  processed: { label: 'DBT Processed', cls: 'bg-purple-100 text-purple-800' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status || 'Unknown', cls: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}
