import React, { useEffect, useMemo, useState } from 'react';
import { listMembers, normalizeMember, toggleMemberActive } from '../../api/client';
import { useNotification } from '../../context/NotificationContext';
import CyanSpinner from '../../components/CyanSpinner';

export default function MemberPage() {
  const { notifySuccess, notifyError } = useNotification();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);
  const [search, setSearch] = useState({
    name: '',
    email: '',
    mobile: '',
    role: '',
  });

  const loadMembers = async () => {
    setLoading(true);
    setError('');

    try {
      const rows = await listMembers();
      setMembers(rows.map(normalizeMember));
    } catch (e) {
      setMembers([]);
      setError(e.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filtered = useMemo(() => {
    return members
      .filter((m) => (m.name || '').toLowerCase().includes(search.name.toLowerCase()))
      .filter((m) => (m.email || '').toLowerCase().includes(search.email.toLowerCase()))
      .filter((m) => (m.mobile || '').includes(search.mobile))
      .filter((m) => search.role === '' || (m.role || '').toLowerCase() === search.role.toLowerCase());
  }, [members, search]);

  const roles = useMemo(() => {
    return [...new Set(members.map((m) => m.role).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }, [members]);

  const handleReset = () => {
    setSearch({ name: '', email: '', mobile: '', role: '' });
  };

  const isActive = (status) => {
    if (typeof status === 'boolean') return status;
    const normalized = String(status || '').toLowerCase();
    return normalized === 'active' || normalized === 'approved' || normalized === 'true' || normalized === '1';
  };

  const handleToggleActive = async (member) => {
    const nextActive = !isActive(member.active ?? member.status);

    try {
      setError('');
      setActingId(member.id);
      setMembers((prev) =>
        prev.map((item) =>
          item.id === member.id
            ? { ...item, active: nextActive, status: nextActive ? 'active' : 'inactive' }
            : item
        )
      );

      const updated = await toggleMemberActive(member.id);

      if (updated && typeof updated === 'object' && Object.keys(updated).length > 0) {
        const normalized = normalizeMember(updated);
        setMembers((prev) => prev.map((item) => (item.id === member.id ? { ...item, ...normalized } : item)));
      }
      await loadMembers();
      notifySuccess(`Member ${nextActive ? 'activated' : 'deactivated'} successfully`);
    } catch (e) {
      setMembers((prev) =>
        prev.map((item) =>
          item.id === member.id
            ? { ...item, active: !nextActive, status: !nextActive ? 'active' : 'inactive' }
            : item
        )
      );
      const message = e.message || 'Failed to toggle member status';
      setError(message);
      notifyError(message);
    } finally {
      setActingId(null);
    }
  };

  return (
    <main className="grow w-full px-4 py-8">
      <div className="app-content-width">
        <h2 className="section-title text-base font-bold text-gray-700 uppercase mb-4">
          Search Member
        </h2>

        <div className="mb-6">
          <div className="panel-card-soft flex flex-wrap gap-3 items-end p-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Name</label>
              <input
                placeholder="Search by name"
                value={search.name}
                onChange={(e) => setSearch({ ...search, name: e.target.value })}
                className="field-input !rounded-xl !px-3 !py-2 text-sm w-48"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Email</label>
              <input
                placeholder="Search by email"
                value={search.email}
                onChange={(e) => setSearch({ ...search, email: e.target.value })}
                className="field-input !rounded-xl !px-3 !py-2 text-sm w-52"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Mobile No</label>
              <input
                placeholder="Search by mobile"
                value={search.mobile}
                onChange={(e) => setSearch({ ...search, mobile: e.target.value })}
                className="field-input !rounded-xl !px-3 !py-2 text-sm w-40"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Role</label>
              <select
                value={search.role}
                onChange={(e) => setSearch({ ...search, role: e.target.value })}
                className="field-input !rounded-xl !px-3 !py-2 text-sm w-44"
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pb-0.5">
              <button
                type="button"
                onClick={loadMembers}
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

        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <p className="text-[#0891b2] font-bold text-sm">
            Member List ({filtered.length})
          </p>
          <button
            type="button"
            onClick={loadMembers}
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
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Name</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Email</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Phone Number</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Role</th>
                <th className="px-3 py-2.5 text-center border-r border-gray-200">Status</th>
                <th className="px-3 py-2.5 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-4">
                    <CyanSpinner label="Loading members..." />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                    No members found.
                  </td>
                </tr>
              ) : (
                filtered.map((member, index) => (
                  <tr key={member.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    {(() => {
                      const active = isActive(member.active ?? member.status);
                      const busy = actingId === member.id;

                      return (
                        <>
                          <td className="px-3 py-2 text-center text-gray-500 border-r border-gray-100 text-xs">
                            {index + 1}
                          </td>
                          <td className="px-3 py-2 text-center text-gray-700 text-xs border-r border-gray-100">
                            {member.name || '-'}
                          </td>
                          <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                            {member.email || '-'}
                          </td>
                          <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                            {member.mobile || '-'}
                          </td>
                          <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                            {member.role || '-'}
                          </td>
                          <td className="px-3 py-2 text-center border-r border-gray-100">
                            {active ? (
                              <span className="text-green-600 font-semibold text-xs">Active</span>
                            ) : (
                              <span className="text-red-600 font-semibold text-xs">Inactive</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <label className={`relative inline-flex items-center ${busy ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={active}
                                disabled={busy}
                                onChange={() => handleToggleActive(member)}
                              />
                              <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-green-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-full" />
                            </label>
                          </td>
                        </>
                      );
                    })()}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
