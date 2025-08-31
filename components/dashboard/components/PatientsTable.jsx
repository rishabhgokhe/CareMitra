"use client";

const PatientsTable = () => {
  const patients = [
    { id: 1, name: "Ravi Kumar", age: 45, condition: "Diabetes" },
    { id: 2, name: "Anita Sharma", age: 32, condition: "Hypertension" },
    { id: 3, name: "Sunil Yadav", age: 28, condition: "Asthma" },
  ];

  return (
    <section id="patients" className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">Patients</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="py-2">Name</th>
            <th className="py-2">Age</th>
            <th className="py-2">Condition</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{p.name}</td>
              <td className="py-2">{p.age}</td>
              <td className="py-2">{p.condition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default PatientsTable;