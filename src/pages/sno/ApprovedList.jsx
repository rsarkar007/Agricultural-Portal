import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApplicants } from '../../context/ApplicantContext';

export default function SNODDAApprovedList() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const gpFilter = params.get('gp') || '';

  const { applicants, loadFarmers } = useApplicants();

  const [ackInput, setAckInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [filters, setFilters] = useState({ ack: '', name: '', aadhaar: '', mobile: '' });

  useEffect(() => {
    loadFarmers();
  }, [loadFarmers]);

  const handleSearch = () => {
    setFilters({
      ack: ackInput,
      name: nameInput,
      aadhaar: aadhaarInput,
      mobile: mobileInput,
    });
  };

  const handleReset = () => {
    setAckInput('');
    setNameInput('');
    setAadhaarInput('');
    setMobileInput('');
    setFilters({ ack: '', name: '', aadhaar: '', mobile: '' });
  };

  const list = useMemo(() => {
    let rows = applicants
      .filter((applicant) => applicant.status === 'approved')
      .filter((applicant) => applicant.status !== 'deleted');

    if (gpFilter) {
      rows = rows.filter((applicant) => (applicant.fullForm?.gramPanchayat || '-') === gpFilter);
    }

    if (filters.ack) {
      rows = rows.filter((applicant) => applicant.ackId?.toLowerCase().includes(filters.ack.toLowerCase()));
    }

    if (filters.name) {
      rows = rows.filter((applicant) => applicant.name?.toLowerCase().includes(filters.name.toLowerCase()));
    }

    if (filters.aadhaar) {
      rows = rows.filter((applicant) => applicant.aadhaar?.includes(filters.aadhaar));
    }

    if (filters.mobile) {
      rows = rows.filter((applicant) => applicant.mobile?.includes(filters.mobile));
    }

    return rows;
  }, [applicants, filters, gpFilter]);

  return (
    <main className="flex-grow w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-4">
          Search DDA Approved Applicant
        </h2>

        <div className="mb-6">
          <div className="flex flex-wrap gap-3 items-end">
            <FilterInput label="Acknowledgement ID" value={ackInput} onChange={setAckInput} />
            <FilterInput label="Applicant Name" value={nameInput} onChange={setNameInput} />
            <FilterInput label="Aadhar No" value={aadhaarInput} onChange={setAadhaarInput} narrow />
            <FilterInput label="Mobile No" value={mobileInput} onChange={setMobileInput} narrow />

            <div className="flex gap-2 pb-0.5">
              <button
                type="button"
                onClick={handleSearch}
                className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-5 py-1.5 rounded"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium px-5 py-1.5 rounded"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <p className="text-[#0891b2] font-bold text-sm">
            DDA Approved Applicant List ({list.length})
          </p>
          <button
            type="button"
            onClick={loadFarmers}
            className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-xs font-medium px-4 py-1.5 rounded"
            title="Reload latest data"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-xs font-semibold border-b border-gray-200">
                <th className="px-3 py-2.5 text-center border-r border-gray-200 w-10">#</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Acknowledgement ID</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Khetmajur ID</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Applicant Name</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Aadhaar No</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Mobile No</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Bank Name</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Branch Name</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Account Number</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">IFSC</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Present in KB(N)</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Applied for Yuvasathi</th>
                <th className="px-3 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-10 text-gray-400 text-sm">
                    No approved applications found.
                  </td>
                </tr>
              ) : (
                list.map((row, index) => {
                  const khetmajurId = row.khetmajurId || row.khetmajur_id || row.id;

                  return (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 text-center text-gray-500 border-r border-gray-100 text-xs">{index + 1}</td>
                      <td className="px-3 py-2 text-center font-mono text-xs text-[#0891b2] border-r border-gray-100">{row.ackId || '-'}</td>
                      <td className="px-3 py-2 text-center text-gray-700 text-xs border-r border-gray-100">{khetmajurId}</td>
                      <td className="px-3 py-2 text-center text-gray-700 text-xs border-r border-gray-100">{row.name || '-'}</td>
                      <td className="px-3 py-2 text-center font-mono text-xs text-gray-600 border-r border-gray-100">{row.aadhaar || '-'}</td>
                      <td className="px-3 py-2 text-center font-mono text-xs text-gray-600 border-r border-gray-100">{row.mobile || '-'}</td>
                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{row.bank_name || row.fullForm?.bankName || '-'}</td>
                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{row.branch_name || row.fullForm?.branchName || '-'}</td>
                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{row.account_number || row.fullForm?.accountNumber || '-'}</td>
                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{row.ifsc || row.fullForm?.ifscCode || '-'}</td>
                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{toYesNo(row.present_in_kbn ?? row.present_in_kb_n)}</td>
                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{toYesNo(row.applied_yuvasathi ?? row.applied_for_yuvasathi)}</td>
                      <td className="px-3 py-2 text-center">
                        <ActionBtn onClick={() => navigate(`/portal/sno/registration/${row.id}/view`)} title="View Application">
                          <EyeIcon />
                        </ActionBtn>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function FilterInput({ label, value, onChange, narrow = false }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-600">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`border border-gray-300 rounded px-3 py-1.5 text-sm ${narrow ? 'w-40' : 'w-52'} focus:outline-none focus:border-[#3eb0c9]`}
      />
    </div>
  );
}

function ActionBtn({ onClick, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white p-1.5 rounded transition-colors"
    >
      {children}
    </button>
  );
}

function toYesNo(value) {
  if ([true, 'true', 1, '1'].includes(value)) return 'Yes';
  if ([false, 'false', 0, '0'].includes(value)) return 'No';
  return '-';
}

const EyeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
