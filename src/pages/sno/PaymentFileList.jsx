import React from 'react';

export default function SNOPaymentFileList() {
  return (
    <main className="grow w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-4">
          Payment File List
        </h2>

        <div className="border border-gray-200 rounded bg-white px-6 py-10 text-center">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Payment file list section is ready for SNO.
          </p>
          <p className="text-sm text-gray-500">
            Payment file entries will appear here once this screen is connected to the DBT data source.
          </p>
        </div>
      </div>
    </main>
  );
}
