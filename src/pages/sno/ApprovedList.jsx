import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  generateADAPaymentFile,
  listADAPendings,
  normalizeFarmer,
} from '../../api/client';

export default function SNODDAApprovedList() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const gpFilter = params.get('gp') || '';

  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [paymentGenerating, setPaymentGenerating] = useState(false);

  const loadApprovedRows = async () => {
    try {
      setLoadingRows(true);
      setActionError('');
      const { items } = await listADAPendings(1);
      setRows(items.map(normalizeFarmer));
    } catch (error) {
      setRows([]);
      setActionError(error.message || 'Failed to load DDA approved list');
    } finally {
      setLoadingRows(false);
    }
  };

  useEffect(() => {
    loadApprovedRows();
  }, []);

  const list = useMemo(() => {
    let filteredRows = rows.filter((applicant) => applicant.status !== 'deleted');

    if (gpFilter) {
      filteredRows = filteredRows.filter((applicant) => (applicant.fullForm?.gramPanchayat || '-') === gpFilter);
    }

    return filteredRows;
  }, [rows, gpFilter]);

  const paymentFilePendingCount = list.length;

  const handleGeneratePaymentFile = async () => {
    try {
      setActionError('');
      setActionSuccess('');
      setPaymentGenerating(true);
      const result = await generateADAPaymentFile();

      if (result?.blob) {
        const url = URL.createObjectURL(result.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename || 'payment_file.csv';
        link.click();
        URL.revokeObjectURL(url);
        setActionSuccess(`Payment file generated: ${result.filename || 'payment_file.csv'}`);
      } else {
        setActionSuccess(result?.message || 'Payment file generated successfully');
      }
    } catch (error) {
      setActionError(error.message || 'Payment file generation failed');
    } finally {
      setPaymentGenerating(false);
    }
  };

  return (
    <main className="flex-grow w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-4">
          DDA Approved Applicant List
        </h2>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleGeneratePaymentFile}
            disabled={paymentGenerating || list.length === 0}
            className="bg-[#3e7fbe] hover:bg-[#336ea6] text-white text-sm font-medium px-5 py-1.5 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {paymentGenerating ? 'Generating...' : 'Generate Payment File'}
          </button>
          <button
            type="button"
            onClick={loadApprovedRows}
            className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-5 py-1.5 rounded transition-colors"
          >
            {loadingRows ? 'Loading...' : 'Refresh'}
          </button>
          <span className="inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
            Payment file pending: {paymentFilePendingCount}
          </span>
        </div>

        {/*{actionError && (
          <div className="mb-3 flex items-start justify-between gap-3 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            <span>{actionError}</span>
            <button
              type="button"
              onClick={() => setActionError('')}
              className="shrink-0 text-red-500 transition-colors hover:text-red-700"
              aria-label="Dismiss error message"
            >
              <CloseIcon />
            </button>
          </div>
        )}*/}

        {actionSuccess && (
          <div className="mb-3 flex items-start justify-between gap-3 rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
            <span>{actionSuccess}</span>
            <button
              type="button"
              onClick={() => setActionSuccess('')}
              className="shrink-0 text-green-500 transition-colors hover:text-green-700"
              aria-label="Dismiss success message"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <p className="text-[#0891b2] font-bold text-sm">
            Approved Applicant List ({list.length})
          </p>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-sm border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-xs font-semibold border-b border-gray-200">
                <th className="px-3 py-2.5 text-center border-r border-gray-200 w-10">#</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Acknowledgement ID</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Khetmajur ID</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Applicant Name</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Aadhaar No</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Send to Bank</th>
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
                    {loadingRows ? 'Loading records...' : 'No approved applications found.'}
                  </td>
                </tr>
              ) : (
                list.map((row, index) => {
                  const khetmajurId = row.khetmajurId || row.khetmajur_id || row.id || '-';

                  return (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 text-center text-gray-500 border-r border-gray-100 text-xs">{index + 1}</td>
                      <td className="px-3 py-2 text-center font-mono text-xs text-[#0891b2] border-r border-gray-100">{row.ackId || '-'}</td>
                      <td className="px-3 py-2 text-center text-gray-700 text-xs border-r border-gray-100">{khetmajurId}</td>
                      <td className="px-3 py-2 text-center text-gray-700 text-xs border-r border-gray-100">{row.name || '-'}</td>
                      <td className="px-3 py-2 text-center font-mono text-xs text-gray-600 border-r border-gray-100">{row.aadhaar || '-'}</td>
                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{bankSendLabel(row.status)}</td>
                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{row.bank_name || row.fullForm?.bankName || '-'}</td>
                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{row.branch_name || row.fullForm?.branchName || '-'}</td>
                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{row.account_number || row.fullForm?.accountNumber || '-'}</td>
                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{row.ifsc || row.fullForm?.ifscCode || '-'}</td>
                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{toYesNo(row.present_in_kbn ?? row.present_in_kb_n)}</td>
                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">{toYesNo(row.applied_yuvasathi ?? row.applied_for_yuvasathi)}</td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => navigate(`/portal/sno/registration/${row.id}/view`)}
                          title="View Application"
                          className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white p-1.5 rounded transition-colors"
                        >
                          <EyeIcon />
                        </button>
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

function toYesNo(value) {
  if ([true, 'true', 1, '1'].includes(value)) return 'Yes';
  if ([false, 'false', 0, '0'].includes(value)) return 'No';
  return '-';
}

function bankSendLabel(status) {
  return ['approved', 'sent_to_bank', 'processed'].includes(status) ? 'Yes' : 'No';
}

function EyeIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
