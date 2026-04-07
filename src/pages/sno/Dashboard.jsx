import React, { useEffect, useMemo } from 'react';
import { useApplicants } from '../../context/ApplicantContext';
import { useDataDirs } from '../../context/DataDirsContext';

export default function SNODashboard() {
  const { applicants, loadFarmers } = useApplicants();
  const { gpName } = useDataDirs();

  useEffect(() => {
    loadFarmers();
  }, [loadFarmers]);

  const visible = useMemo(
    () => applicants.filter((applicant) => applicant.status !== 'deleted'),
    [applicants]
  );

  const gpRows = useMemo(() => {
    const grouped = {};

    visible.forEach((applicant) => {
      const gpId = applicant.fullForm?.gramPanchayat || '';
      const key = gpId || '-';

      if (!grouped[key]) {
        grouped[key] = { total: 0, approved: 0, rejected: 0, pending: 0 };
      }

      grouped[key].total += 1;

      if (['approved', 'sent_to_bank', 'processed'].includes(applicant.status)) {
        grouped[key].approved += 1;
      } else if (applicant.status === 'rejected') {
        grouped[key].rejected += 1;
      } else {
        grouped[key].pending += 1;
      }
    });

    return Object.entries(grouped).sort(([left], [right]) => {
      const leftName = gpName(left) || left;
      const rightName = gpName(right) || right;
      return leftName.localeCompare(rightName);
    });
  }, [visible, gpName]);

  const totals = gpRows.reduce(
    (accumulator, [, value]) => ({
      total: accumulator.total + value.total,
      approved: accumulator.approved + value.approved,
      rejected: accumulator.rejected + value.rejected,
      pending: accumulator.pending + value.pending,
    }),
    { total: 0, approved: 0, rejected: 0, pending: 0 }
  );

  const downloadCSV = () => {
    const header = 'Sl No,Gram Panchayat,Total Submitted,Approved,Rejected,Pending\n';
    const rows = gpRows
      .map(([gpId, value], index) => `${index + 1},"${gpName(gpId) || gpId}",${value.total},${value.approved},${value.rejected},${value.pending}`)
      .join('\n');
    const total = `Total,,${totals.total},${totals.approved},${totals.rejected},${totals.pending}`;
    const blob = new Blob([header + rows + '\n' + total], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'sno_dashboard_summary.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="grow w-full px-0 py-0">
      <div className="app-content-width px-4 py-8">
        <h2 className="section-title text-sm font-bold text-gray-800 text-center mb-6 uppercase">
          Dashboard Summary
        </h2>

        <div className="panel-card-soft px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <button
            onClick={downloadCSV}
            className="bg-[#4caf50] hover:bg-[#388e3c] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            Download CSV
          </button>
          <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
            Quick Registration Application Count :
            <span className="inline-flex items-center justify-center bg-[#555] text-white text-xs font-bold rounded-full h-7 px-3 min-w-7">
              {visible.length}
            </span>
          </div>
        </div>

        <div className="table-shell overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-gray-700 text-xs font-semibold border-b border-gray-300">
                <th className="px-4 py-2.5 text-center border-r border-gray-200 w-16">Sl No</th>
                <th className="px-4 py-2.5 text-center border-r border-gray-200">Gram Panchayat</th>
                <th className="px-4 py-2.5 text-center border-r border-gray-200">Total Submitted Application</th>
                <th className="px-4 py-2.5 text-center border-r border-gray-200">Approved Application</th>
                <th className="px-4 py-2.5 text-center border-r border-gray-200">Rejected Application</th>
                <th className="px-4 py-2.5 text-center">Pending Application</th>
              </tr>
            </thead>
            <tbody>
              {gpRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                    No applications found.
                  </td>
                </tr>
              ) : (
                gpRows.map(([gpId, value], index) => (
                  <tr
                    key={gpId}
                    className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                  >
                    <td className="px-4 py-2 text-center text-gray-500 border-r border-gray-100">{index + 1}</td>
                    <td className="px-4 py-2 text-center border-r border-gray-100">
                      {gpName(gpId) || gpId}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-600 border-r border-gray-100">{value.total}</td>
                    <td className="px-4 py-2 text-center text-gray-600 border-r border-gray-100">{value.approved}</td>
                    <td className="px-4 py-2 text-center text-gray-600 border-r border-gray-100">{value.rejected}</td>
                    <td className="px-4 py-2 text-center text-gray-600">{value.pending}</td>
                  </tr>
                ))
              )}
              {gpRows.length > 0 && (
                <tr className="bg-gray-100 font-semibold text-gray-700 border-t-2 border-gray-300">
                  <td className="px-4 py-2 text-center border-r border-gray-200" colSpan={2}>Total</td>
                  <td className="px-4 py-2 text-center border-r border-gray-200">{totals.total}</td>
                  <td className="px-4 py-2 text-center border-r border-gray-200">{totals.approved}</td>
                  <td className="px-4 py-2 text-center border-r border-gray-200">{totals.rejected}</td>
                  <td className="px-4 py-2 text-center">{totals.pending}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
