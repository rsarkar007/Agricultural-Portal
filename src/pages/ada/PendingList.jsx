import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApplicants } from "../../context/ApplicantContext";
import { Check, Eye, Trash2, Edit } from "lucide-react";

export default function PendingList() {
  const { applicants, loadFarmers } = useApplicants();
  const navigate = useNavigate();

  const [search, setSearch] = useState({
    ack: "",
    name: "",
    aadhaar: "",
    mobile: "",
  });

  const [gramPanchayat, setGramPanchayat] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadFarmers();
  }, []);

  // ✅ RESET FUNCTION
  const handleReset = () => {
    setSearch({
      ack: "",
      name: "",
      aadhaar: "",
      mobile: "",
    });
    setGramPanchayat("");
    setSuccessMessage("");
  };

  // 🔍 FILTER ONLY PENDING
  const list = useMemo(() => {
    return applicants
      .filter((a) => a.status === "pending")
      .filter(
        (a) =>
          (a.ackId || "").includes(search.ack) &&
          (a.aadhaar || "").includes(search.aadhaar) &&
          (a.name || "")
            .toLowerCase()
            .includes(search.name.toLowerCase()) &&
          (a.mobile || "").includes(search.mobile) &&
          (gramPanchayat === "" || (a.gramPanchayat || "") === gramPanchayat)
      );
  }, [applicants, search, gramPanchayat]);

  // Handle Approve
  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/applicants/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        setSuccessMessage("Your details are updated successfully");
        loadFarmers();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error approving applicant:", error);
    }
  };

  return (
    <main className="w-full px-3 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto">

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        <h2 className="text-xl sm:text-2xl text-gray-700 mb-6">
          PENDING SEARCH APPLICATION
        </h2>

        {/* SEARCH */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">

          <input
            placeholder="Acknowledgement ID"
            value={search.ack}
            className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearch({ ...search, ack: e.target.value })}
          />

          <input
            placeholder="Applicant Name"
            value={search.name}
            className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
          />

          <input
            placeholder="Aadhaar No"
            value={search.aadhaar}
            className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setSearch({ ...search, aadhaar: e.target.value })
            }
          />

          <input
            placeholder="Mobile No"
            value={search.mobile}
            className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setSearch({ ...search, mobile: e.target.value })
            }
          />

          <select
            value={gramPanchayat}
            onChange={(e) => setGramPanchayat(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gram Panchayat</option>
            <option>ANCHURI</option>
            <option>ANDARTHOLE</option>
            <option>BANKURA(MUNICIPALITY)</option>
            <option>JAGADALLA-I</option>
            <option>JAGADALLA-II</option>
            <option>KALPATHAR</option>
            <option>KENJAKURA</option>
            <option>KOLKATA</option>
          </select>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-2">

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
              Search
            </button>

            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer">
              Download
            </button>

            <button
              onClick={handleReset}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
            >
              Reset
            </button>

          </div>
        </div>

        {/* BULK */}
        <h3 className="text-lg sm:text-xl mb-2">Bulk Approve</h3>
        <hr className="mb-4" />

        {/* FILE */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="file"
            className="block w-full sm:w-[300px] text-sm border rounded
            file:mr-4 file:py-2 file:px-4
            file:bg-gray-400 file:text-white
            hover:file:bg-gray-500"
          />

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
            Upload CSV
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer">
            Uploaded CSV List
          </button>
        </div>

        {/* TITLE */}
        <div className="flex justify-between mb-3">
          <h4 className="text-blue-600 font-semibold">
            Pending Applicant List
          </h4>

          <p className="text-green-700 font-semibold">
            **Click to view button for Reject & Revert
          </p>
        </div>

        {/* TABLE */}
        <div className="w-full overflow-x-auto md:overflow-visible border border-gray-300">

          {list.length === 0 ? (
            <div className="w-full p-8 text-center">
              <p className="text-gray-500 text-lg font-semibold">
                No records found
              </p>
            </div>
          ) : (
            <table className="w-full text-xs border border-gray-300">

              <thead className="bg-gray-200">
                <tr className="text-gray-700 text-xs">

                  <th className="border px-3 py-2">#</th>
                  <th className="border px-3 py-2">Acknowledgement ID</th>
                  <th className="border px-3 py-2">Applicant Name</th>
                  <th className="border px-3 py-2">Aadhaar No</th>
                  <th className="border px-3 py-2">Mobile No</th>
                  <th className="border px-3 py-2">Bank Name</th>
                  <th className="border px-3 py-2">Branch Name</th>
                  <th className="border px-3 py-2">Account Number</th>
                  <th className="border px-3 py-2">IFSC</th>
                  <th className="border px-3 py-2">Present in KB(N)</th>
                  <th className="border px-3 py-2">Applied for Yuvasathi</th>
                  <th className="border px-3 py-2 text-center">Action</th>

                </tr>
              </thead>

              <tbody>
                {list.map((row, i) => {
                  const bank = row.fullForm || row.farmer_bank || {};

                  return (
                    <tr key={row.id} className="text-center">

                      <td className="border px-3 py-2">{i + 1}</td>
                      <td className="border px-3 py-2">{row.ackId}</td>
                      <td className="border px-3 py-2">{row.name}</td>
                      <td className="border px-3 py-2">{row.aadhaar}</td>
                      <td className="border px-3 py-2">{row.mobile || "-"}</td>

                      <td className="border px-3 py-2">
                        {bank.bankName || bank.bank_name || "-"}
                      </td>

                      <td className="border px-3 py-2">
                        {bank.branchName || bank.branch_name || "-"}
                      </td>

                      <td className="border px-3 py-2">
                        {bank.accountNumber || bank.account_number || "-"}
                      </td>

                      <td className="border px-3 py-2">
                        {bank.ifscCode || bank.ifsc_code || "-"}
                      </td>

                      <td className="border px-3 py-2">No</td>

                      <td className="border px-3 py-2">
                        {row.applied_for_yuvasathi === true
                          ? "Yes"
                          : row.applied_for_yuvasathi === false
                          ? "No"
                          : "-"}
                      </td>

                      <td className="border px-2 py-1">
                        <div className="flex justify-center gap-1">

                          <button
                            onClick={() => navigate(`/ada/view-application/${row.id}`)}
                            className="w-7 h-7 flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-white rounded-sm cursor-pointer"
                            title="View Application"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => navigate(`/portal/ada/registration/${row.id}/edit`)}
                            className="w-7 h-7 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-sm cursor-pointer"
                            title="Edit Application"
                          >
                            <Edit size={14} />
                          </button>

                          <button
                            onClick={() => handleApprove(row.id)}
                            className="w-7 h-7 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-sm cursor-pointer"
                            title="Approve"
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          )}
        </div>

      </div>
    </main>
  );
}