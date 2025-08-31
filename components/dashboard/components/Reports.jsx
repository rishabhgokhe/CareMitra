"use client";

const Reports = () => {
  const reports = [
    { id: 1, patient: "Ravi Kumar", type: "Blood Test", status: "Verified" },
    { id: 2, patient: "Anita Sharma", type: "X-Ray", status: "Pending" },
  ];

  return (
    <section id="reports" className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">Reports</h3>
      <ul className="space-y-3">
        {reports.map((r) => (
          <li key={r.id} className="p-3 border rounded-lg hover:bg-gray-50">
            <p className="font-medium">{r.type} - {r.patient}</p>
            <p className="text-sm text-gray-600">Status: {r.status}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Reports;