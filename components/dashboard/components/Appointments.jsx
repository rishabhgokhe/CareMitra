"use client";

const Appointments = () => {
  const appts = [
    { id: 1, patient: "Ravi Kumar", doctor: "Dr. Mehta", time: "10:30 AM" },
    { id: 2, patient: "Anita Sharma", doctor: "Dr. Verma", time: "11:00 AM" },
  ];

  return (
    <section id="appointments" className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
      <ul className="space-y-3">
        {appts.map((a) => (
          <li key={a.id} className="p-3 border rounded-lg hover:bg-gray-50">
            <p className="font-medium">{a.patient}</p>
            <p className="text-sm text-gray-600">{a.doctor} • {a.time}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Appointments;