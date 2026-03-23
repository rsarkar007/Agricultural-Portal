import React, { useState, useMemo, useEffect } from "react";
import { useApplicants } from "../context/ApplicantContext";

export default function MemberPage() {

  const { applicants, loadFarmers } = useApplicants();

  useEffect(() => {
    loadFarmers(); // ✅ SAME API AS PENDING LIST
  }, []);

  const [search, setSearch] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
  });

  // 🔥 FILTER FROM API
  const filtered = useMemo(() => {
    return applicants
      .filter((a) => a.status !== "deleted")
      .filter((a) =>
        (a.name || "").toLowerCase().includes(search.name.toLowerCase())
      )
      .filter((a) =>
        (a.email || "").toLowerCase().includes(search.email.toLowerCase())
      )
      .filter((a) =>
        (a.mobile || "").includes(search.mobile)
      )
      .filter((a) =>
        search.role === "" || (a.role || "Gramdoot") === search.role
      );
  }, [applicants, search]);

  const handleReset = () => {
    setSearch({
      name: "",
      email: "",
      mobile: "",
      role: "",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Emblem_of_West_Bengal.svg"
            className="w-10"
          />
          <div>
            <h1 className="text-blue-700 font-semibold">
              Government of West Bengal
            </h1>
            <p className="text-xs text-gray-600">
              Department of Agriculture
            </p>
          </div>
        </div>

        <div className="text-sm">adabankura1@gmail.com</div>
      </div>

      {/* NAVBAR */}
      <div className="bg-blue-700 text-white px-6 py-2 flex justify-between">
        <div className="flex gap-6">
          <span>Dashboard</span>
          <span>MIS</span>
          <span>Applicant List</span>
          <span className="font-semibold">Members</span>
        </div>
        <div>Download App ⬇</div>
      </div>

      {/* CONTENT */}
      <div className="p-6 max-w-7xl mx-auto">

        <h2 className="text-xl text-gray-700 mb-6">
          SEARCH MEMBER
        </h2>

        {/* SEARCH */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">

          <input
            placeholder="Search by name"
            value={search.name}
            onChange={(e) =>
              setSearch({ ...search, name: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />

          <input
            placeholder="Search by email"
            value={search.email}
            onChange={(e) =>
              setSearch({ ...search, email: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />

          <input
            placeholder="Search by mobile"
            value={search.mobile}
            onChange={(e) =>
              setSearch({ ...search, mobile: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />

          <select
            value={search.role}
            onChange={(e) =>
              setSearch({ ...search, role: e.target.value })
            }
            className="border px-3 py-2 rounded"
          >
            <option value="">All Roles</option>
            <option>Gramdoot</option>
            <option>AUDIT GD</option>
          </select>

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Search
          </button>

          <button
            onClick={handleReset}
            className="bg-cyan-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>

        </div>

        {/* TABLE */}
        <h3 className="text-blue-600 font-semibold mb-2">
          Member List
        </h3>

        <div className="overflow-x-auto border">

          <table className="w-full text-sm border">

            <thead className="bg-gray-200">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Phone Number</th>
                <th className="border px-3 py-2">Role</th>
                <th className="border px-3 py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id} className="text-center">

                  <td className="border px-3 py-2">{i + 1}</td>
                  <td className="border px-3 py-2">{m.name}</td>
                  <td className="border px-3 py-2">
                    {m.email || "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {m.mobile || "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {m.role || "Gramdoot"}
                  </td>

                  <td className="border px-3 py-2">
                    {m.status === "approved" ? (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}