import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApplicants } from '../../context/ApplicantContext';
import { useDataDirs } from '../../context/DataDirsContext';
import { useNotification } from '../../context/NotificationContext';
import CyanSpinner from '../../components/CyanSpinner';

export default function ADAApprovedApplicantList() {
    const { notifySuccess, notifyError } = useNotification();
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const gpFilter = params.get('gp') || '';

    const { applicants, deleteApplicant, loadFarmers, loadingFarmers } = useApplicants();
    const { districtName, blockName } = useDataDirs();

    useEffect(() => {
        loadFarmers();
    }, []);


    const [ackInput, setAckInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [aadhaarInput, setAadhaarInput] = useState('');
    const [mobileInput, setMobileInput] = useState('');
    const [applied, setApplied] = useState({ ack: '', name: '', aadhaar: '', mobile: '' });

    const [confirmDelete, setConfirmDelete] = useState(null);
    const [actionError, setActionError] = useState('');

    const handleSearch = () => {
        setApplied({
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
        setApplied({ ack: '', name: '', aadhaar: '', mobile: '' });
    };

    const list = useMemo(() => {
        let arr = applicants
            .filter((a) => a.status !== 'deleted')
            .filter((a) => a.status === 'approved');

        if (gpFilter) {
            arr = arr.filter(
                (a) => (a.fullForm?.gramPanchayat || '-') === gpFilter
            );
        }

        if (applied.ack) {
            arr = arr.filter((a) =>
                a.ackId?.toLowerCase().includes(applied.ack.toLowerCase())
            );
        }

        if (applied.name) {
            arr = arr.filter((a) =>
                a.name?.toLowerCase().includes(applied.name.toLowerCase())
            );
        }

        if (applied.aadhaar) {
            arr = arr.filter((a) =>
                a.aadhaar?.includes(applied.aadhaar)
            );
        }

        if (applied.mobile) {
            arr = arr.filter((a) =>
                a.mobile?.includes(applied.mobile)
            );
        }

        return arr;
    }, [applicants, gpFilter, applied]);

    return (
        <>
            <main className="grow w-full px-4 py-8">
                <div className="app-content-width">

                    <h2 className="section-title text-base font-bold text-gray-700 uppercase mb-4">
                        Search Approved Applicant
                    </h2>

                    <div className="mb-6">
                        <div className="panel-card-soft flex flex-wrap gap-3 items-end p-4">
                            <SearchInput label="Acknowledgement ID" value={ackInput} onChange={setAckInput} />
                            <SearchInput label="Applicant Name" value={nameInput} onChange={setNameInput} />
                            <SearchInput label="Aadhar No" value={aadhaarInput} onChange={setAadhaarInput} narrow />
                            <SearchInput label="Mobile No" value={mobileInput} onChange={setMobileInput} narrow />
                            <div className="flex gap-2 pb-0.5">
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {actionError && (
                        <div className="mb-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded">
                            <span className="flex-1">{actionError}</span>
                            <button
                                type="button"
                                onClick={() => setActionError('')}
                                className="text-red-400 hover:text-red-700 text-lg leading-none"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[#0891b2] font-bold text-sm">
                            Approved Applicant List ({list.length})
                        </p>
                        <button
                            type="button"
                            onClick={loadFarmers}
                            className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-xs font-medium px-4 py-1.5 rounded transition-colors"
                        >
                            Refresh
                        </button>
                    </div>

                    <div className="table-shell overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="text-gray-700 text-xs font-semibold border-b border-gray-200">
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200 w-10">#</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Ack ID</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Khetmajur ID</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Applicant Name</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Aadhaar No</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Mobile No</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Bank Name</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Branch Name</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Account Number</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">IFSC</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">KB(N)</th>
                                    <th className="px-3 py-2.5 text-center border-r border-gray-200">Yuvasathi</th>
                                    <th className="px-3 py-2.5 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingFarmers ? (
                                    <tr>
                                        <td colSpan={13} className="py-4">
                                            <CyanSpinner label="Loading records..." />
                                        </td>
                                    </tr>
                                ) : list.length === 0 ? (
                                    <tr>
                                        <td colSpan={13} className="text-center py-10 text-gray-400 text-sm">
                                            No approved applications found.
                                        </td>
                                    </tr>
                                ) : (
                                    list.map((row, idx) => {
                                        const khetmajurId = row.khetmajurId || row.khetmajur_id || row.id;
                                        const yesNo = (value) => {
                                            if ([true, 'true', 1, '1'].includes(value)) return 'Yes';
                                            if ([false, 'false', 0, '0'].includes(value)) return 'No';
                                            return '—';
                                        };
                                        return (
                                            <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="px-3 py-2 text-center text-gray-500 border-r border-gray-100 text-xs">{idx + 1}</td>
                                                <td className="px-3 py-2 text-center font-mono text-xs text-[#0891b2] border-r border-gray-100">{row.ackId}</td>
                                                <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{khetmajurId}</td>
                                                <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.name}</td>
                                                <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.aadhaar}</td>
                                                <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.mobile}</td>
                                                <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.fullForm?.bankName || '—'}</td>
                                                <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.fullForm?.branchName || '—'}</td>
                                                <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.fullForm?.accountNumber || '—'}</td>
                                                <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{row.fullForm?.ifscCode || '—'}</td>
                                                <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{yesNo(row.present_in_kb_n)}</td>
                                                <td className="px-3 py-2 text-center text-xs border-r border-gray-100">{yesNo(row.applied_for_yuvasathi)}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <ActionBtn title="View Application" onClick={() => navigate(`/portal/ada/registration/${row.id}/view`)}>
                                                            <EyeIcon />
                                                        </ActionBtn>
                                                        <ActionBtn color="red" title="Delete" onClick={() => setConfirmDelete(row)}>
                                                            <TrashIcon />
                                                        </ActionBtn>
                                                    </div>
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

            {confirmDelete && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <h4 className="font-bold text-gray-800 text-sm">Confirm Delete</h4>
                            <button
                                type="button"
                                onClick={() => setConfirmDelete(null)}
                                className="text-gray-400 hover:text-gray-700 text-xl leading-none"
                            >
                                ×
                            </button>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-sm text-gray-700 mb-1">
                                Are you sure you want to delete this application?
                            </p>
                            <p className="text-xs text-gray-500 mb-5">
                                Ack ID: <strong>{confirmDelete.ackId}</strong> | <strong>{confirmDelete.name}</strong>
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setConfirmDelete(null)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-5 py-1.5 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            await deleteApplicant(confirmDelete.id);
                                            notifySuccess('Application deleted successfully');
                                            setConfirmDelete(null);
                                        } catch (e) {
                                            const message = e.message || 'Delete failed';
                                            setActionError(message);
                                            notifyError(message);
                                        }
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-1.5 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function SearchInput({ label, value, onChange, narrow = false }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-600">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`field-input !rounded-xl !px-3 !py-2 text-sm ${narrow ? 'w-40' : 'w-52'}`}
      />
    </div>
  );
}

function ActionBtn({ color = 'cyan', title, onClick, children, disabled = false }) {
  const colorMap = {
    cyan: 'bg-[#3eb0c9] hover:bg-[#2a9ab0]',
    green: 'bg-green-600 hover:bg-green-700',
    orange: 'bg-orange-500 hover:bg-orange-600',
    blue: 'bg-blue-600 hover:bg-blue-700',
    red: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`${colorMap[color]} text-white p-1.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

const EyeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
