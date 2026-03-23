import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicants } from '../../context/ApplicantContext';
import { useDataDirs } from '../../context/DataDirsContext';

export default function ADADeletedApplicantList() {
    const navigate = useNavigate();
    const { applicants, loadFarmers } = useApplicants();
    const { gramPanchayats } = useDataDirs();

    const [filters, setFilters] = useState({
        ack: '',
        name: '',
        aadhaar: '',
        mobile: '',
        gp: '',
    });

    useEffect(() => {
        loadFarmers();
    }, []);

    // 🔴 FILTER ONLY DELETED APPLICANTS
    const deletedApplicants = useMemo(() => {
        return applicants
            ?.filter(app => app.status === 'deleted' || app.is_deleted === true)
            ?.filter(app => {
                return (
                    (!filters.ack || app.acknowledgement_id?.toLowerCase().includes(filters.ack.toLowerCase())) &&
                    (!filters.name || app.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
                    (!filters.aadhaar || app.aadhaar?.includes(filters.aadhaar)) &&
                    (!filters.mobile || app.mobile?.includes(filters.mobile)) &&
                    (!filters.gp || app.gram_panchayat === filters.gp)
                );
            });
    }, [applicants, filters]);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleReset = () => {
        setFilters({
            ack: '',
            name: '',
            aadhaar: '',
            mobile: '',
            gp: '',
        });
    };

    return (
        <main className="w-full px-4 md:px-6 lg:px-8 py-6">

            {/* 🔹 TITLE */}
            <h1 className="text-2xl font-semibold text-gray-700 mb-6">
                DELETED SEARCH APPLICATION
            </h1>

            {/* 🔹 SEARCH BAR */}
            <div className="bg-white p-4 rounded-md shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">

                    <input
                        type="text"
                        name="ack"
                        value={filters.ack}
                        onChange={handleChange}
                        placeholder="Search by acknowledgment"
                        className="border px-3 py-2 rounded-md"
                    />

                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleChange}
                        placeholder="Search by name"
                        className="border px-3 py-2 rounded-md"
                    />

                    <input
                        type="text"
                        name="aadhaar"
                        value={filters.aadhaar}
                        onChange={handleChange}
                        placeholder="Search by Aadhaar"
                        className="border px-3 py-2 rounded-md"
                    />

                    <input
                        type="text"
                        name="mobile"
                        value={filters.mobile}
                        onChange={handleChange}
                        placeholder="Search by mobile"
                        className="border px-3 py-2 rounded-md"
                    />

                    <select
                        name="gp"
                        value={filters.gp}
                        onChange={handleChange}
                        className="border px-3 py-2 rounded-md"
                    >
                        <option value="">Select Gram Panchayat</option>
                        {gramPanchayats?.map((gp, i) => (
                            <option key={i} value={gp.name}>{gp.name}</option>
                        ))}
                    </select>

                    <div className="flex gap-2">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Search
                        </button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                            Download
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-cyan-500 text-white px-4 py-2 rounded-md"
                        >
                            Reset
                        </button>
                    </div>

                </div>
            </div>

            {/* 🔹 TABLE */}
            <h2 className="text-lg font-semibold text-blue-600 mb-4">
                Deleted Applicant List
            </h2>

            <div className="overflow-x-auto bg-white rounded-md shadow-sm">
                <table className="min-w-full text-sm text-left border">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="px-3 py-2 border">#</th>
                            <th className="px-3 py-2 border">Acknowledgement ID</th>
                            <th className="px-3 py-2 border">Applicant Name</th>
                            <th className="px-3 py-2 border">Aadhaar No</th>
                            <th className="px-3 py-2 border">Mobile No</th>
                            <th className="px-3 py-2 border">Bank Name</th>
                            <th className="px-3 py-2 border">Branch Name</th>
                            <th className="px-3 py-2 border">Account Number</th>
                            <th className="px-3 py-2 border">IFSC</th>
                            <th className="px-3 py-2 border">Present in KB(N)</th>
                            <th className="px-3 py-2 border">Applied for Yuvasathi</th>
                            <th className="px-3 py-2 border">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {deletedApplicants?.length > 0 ? (
                            deletedApplicants.map((app, index) => (
                                <tr key={app.id} className="border-t">

                                    <td className="px-3 py-2 border">{index + 1}</td>

                                    <td className="px-3 py-2 border text-blue-600">
                                        {app.acknowledgement_id}
                                    </td>

                                    <td className="px-3 py-2 border">
                                        {app.name}
                                    </td>

                                    <td className="px-3 py-2 border">{app.aadhaar}</td>

                                    <td className="px-3 py-2 border">
                                        {app.mobile}
                                    </td>

                                    <td className="px-3 py-2 border">{app.bank_name}</td>
                                    <td className="px-3 py-2 border">{app.branch_name}</td>
                                    <td className="px-3 py-2 border">{app.account_number}</td>
                                    <td className="px-3 py-2 border">{app.ifsc}</td>

                                    <td className="px-3 py-2 border">
                                        {app.present_in_kbn ? 'Yes' : 'No'}
                                    </td>

                                    <td className="px-3 py-2 border">
                                        {app.applied_yuvasathi ? 'Yes' : 'No'}
                                    </td>

                                    <td className="px-3 py-2 border text-center">
                                        <button
                                            onClick={() => navigate(`/portal/ada/registration/${app.id}/view`)}
                                            className="text-blue-500"
                                        >
                                            👁
                                        </button>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12" className="text-center py-4 text-red-500">
                                    No Records Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </main>
    );
}