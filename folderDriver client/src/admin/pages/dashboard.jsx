import { FaUsers, FaFolder, FaCloud, FaArrowUp } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Admin 👋</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        <Card title="Total Users" value="1,240" icon={<FaUsers />} />

        <Card title="Files" value="8,942" icon={<FaFolder />} />

        <Card title="Storage Used" value="84 GB" icon={<FaCloud />} />

        <Card title="Growth" value="+12%" icon={<FaArrowUp />} />
      </div>

      {/* Charts & Activity */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Analytics</h2>

          <div className="h-72 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
            Chart goes here
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Recent Activity</h2>

          <div className="space-y-4">
            <Activity text="John uploaded 4 files" time="2 min ago" />

            <Activity text="Emma created account" time="10 min ago" />

            <Activity text="Alex deleted folder" time="20 min ago" />

            <Activity text="Storage upgraded" time="1 hour ago" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-semibold text-lg mb-5">Recent Users</h2>

        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left text-gray-500">
              <th className="pb-3">Name</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            <tr className="h-14">
              <td>John Doe</td>
              <td>User</td>
              <td>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Active
                </span>
              </td>
            </tr>

            <tr className="h-14">
              <td>Emma Watson</td>
              <td>Staff</td>
              <td>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  Online
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex justify-between">
      <div>
        <p className="text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
      </div>

      <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
        {icon}
      </div>
    </div>
  );
}

function Activity({ text, time }) {
  return (
    <div className="border-l-2 border-indigo-500 pl-4">
      <p className="font-medium">{text}</p>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
  );
}
