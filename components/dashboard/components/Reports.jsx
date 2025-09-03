 "use client";

// const Reports = () => {
//   const reports = [
//     { id: 1, patient: "Ravi Kumar", type: "Blood Test", status: "Verified" },
//     { id: 2, patient: "Anita Sharma", type: "X-Ray", status: "Pending" },
//   ];

//   return (
//     <section id="reports" className="bg-white rounded-2xl p-6 shadow">
//       <h3 className="text-lg font-semibold mb-4">Reports</h3>
//       <ul className="space-y-3">
//         {reports.map((r) => (
//           <li key={r.id} className="p-3 border rounded-lg hover:bg-gray-50">
//             <p className="font-medium">{r.type} - {r.patient}</p>
//             <p className="text-sm text-gray-600">Status: {r.status}</p>
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// };

// export default Reports;

import React, { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { gsap } from 'gsap';
import './CareMitra.css'; // Assuming you'll move the CSS into a separate file

const CareMitraReport = () => {
  // --- State Hooks ---
  const [hospitalName, setHospitalName] = useState('');
  const [doctorProfession, setDoctorProfession] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientDisease, setPatientDisease] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [patientIdView, setPatientIdView] = useState('');
  const [viewedReports, setViewedReports] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [modal, setModal] = useState({ isVisible: false, title: '', message: '' });

  // --- Refs for Quill and UI elements ---
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const creationViewRef = useRef(null);
  const previewViewRef = useRef(null);

  // --- useEffect to initialize Quill editor ---
  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        placeholder: 'Write the report here...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      });
      quillInstance.current.on('text-change', () => {
        setReportContent(quillInstance.current.root.innerHTML);
      });
    }
  }, []);

  // --- Helper Functions ---
  const showCustomModal = (title, message) => {
    setModal({ isVisible: true, title, message });
  };

  const closeCustomModal = () => {
    setModal({ ...modal, isVisible: false });
  };

  const handleSaveAndPreview = () => {
    if (!hospitalName || !doctorProfession || !reportTitle || !patientId || !patientName || !patientAge || !patientDisease) {
      showCustomModal('Error', 'Please fill in all the required fields.');
      return;
    }
    if (!quillInstance.current || quillInstance.current.getText().trim().length === 0) {
      showCustomModal('Error', 'Report content cannot be empty.');
      return;
    }

    setShowPreview(true);
    gsap.fromTo(previewViewRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
  };

  const handleUploadReport = () => {
    if (!reportContent) {
      showCustomModal('Error', 'No report to upload. Please create a report first.');
      return;
    }

    try {
      const reports = JSON.parse(localStorage.getItem(patientId) || '[]');
      const newReport = {
        hospitalName,
        doctorProfession,
        title: reportTitle,
        content: reportContent,
        patientId,
        patientName,
        patientAge,
        patientDisease,
        timestamp: new Date().toISOString()
      };
      reports.push(newReport);
      localStorage.setItem(patientId, JSON.stringify(reports));

      showCustomModal('Success', 'Report uploaded successfully!');
      
      // Reset state and switch back to editor view
      setShowPreview(false);
      setHospitalName('');
      setDoctorProfession('');
      setReportTitle('');
      setPatientId('');
      setPatientName('');
      setPatientAge('');
      setPatientDisease('');
      quillInstance.current?.setContents([]);

    } catch (error) {
      showCustomModal('Error', 'Failed to upload report. Please try again.');
      console.error('Save failed:', error);
    }
  };

  const handleViewReports = () => {
    if (!patientIdView) {
      setViewedReports([]);
      return;
    }
    
    try {
      const reports = JSON.parse(localStorage.getItem(patientIdView) || '[]');
      if (reports.length === 0) {
        setViewedReports([]);
      } else {
        setViewedReports(reports);
      }
    } catch (error) {
      showCustomModal('Error', 'Error loading reports. Invalid data format.');
      setViewedReports([]);
      console.error('Load failed:', error);
    }
  };

  const handleClearEditor = () => {
    setHospitalName('');
    setDoctorProfession('');
    setReportTitle('');
    setPatientId('');
    setPatientName('');
    setPatientAge('');
    setPatientDisease('');
    quillInstance.current?.setContents([]);
  };

  // --- JSX Structure ---
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden w-full">
      <header className="bg-blue-600 text-white p-6 md:p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Care Mitra</h1>
        <p className="mt-1 text-sm md:text-base opacity-90">Doctor's Report and Patient's View</p>
      </header>

      <main className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Doctor's Section */}
          <div className="bg-gray-50 p-6 md:p-8 rounded-xl shadow-inner">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Doctor's Dashboard</h3>
            
            {/* Doctor's Creation View */}
            <div ref={creationViewRef} className={`space-y-4 ${showPreview ? 'hidden' : ''}`}>
              <p className="text-sm text-gray-600">Step 1: Create a new report.</p>
              <div className="flex flex-col gap-4 mb-4">
                <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="Hospital Name" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" value={doctorProfession} onChange={(e) => setDoctorProfession(e.target.value)} placeholder="Doctor's Profession" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Patient ID (e.g., JaneDoe123)" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Patient Name" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} placeholder="Patient Age" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" value={patientDisease} onChange={(e) => setPatientDisease(e.target.value)} placeholder="Patient Disease" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} placeholder="Report Title" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div id="editor-container" ref={quillRef} className="relative border border-gray-300 rounded-lg"></div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleSaveAndPreview} className="flex-1 py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200">
                  Save & Preview
                </button>
                <button onClick={handleClearEditor} className="flex-1 py-3 px-6 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200">
                  Clear Editor
                </button>
              </div>
            </div>

            {/* Doctor's Preview View */}
            <div ref={previewViewRef} className={`space-y-4 ${!showPreview ? 'hidden' : ''}`}>
              <p className="text-sm text-gray-600">Step 2: Review and upload the report.</p>
              <div className="prescription-container shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="prescription-header">
                    <div className="rx-symbol">℞</div>
                    <h1 className="text-xl sm:text-2xl font-bold">PRESCRIPTION</h1>
                  </div>
                  <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                </div>
                <hr className="divider" />
                <div className="my-4 space-y-2">
                  <p className="font-bold text-gray-800">Dr. Alex Johnson, MD</p>
                  <p className="text-sm text-gray-600">{doctorProfession}, {hospitalName}</p>
                  <p className="text-sm text-gray-600">Contact: 555-987-6543</p>
                </div>
                <hr className="divider" />
                <div className="my-4">
                  <p className="font-bold">Patient ID: <span className="font-normal">{patientId}</span></p>
                  <p className="font-bold">Patient Name: <span className="font-normal">{patientName}</span></p>
                  <p className="font-bold">Patient Age: <span className="font-normal">{patientAge}</span></p>
                  <p className="font-bold">Patient Disease: <span className="font-normal">{patientDisease}</span></p>
                  <h2 className="text-xl font-semibold mt-4">{reportTitle}</h2>
                </div>
                <hr className="divider" />
                <div className="prose max-w-none my-4" dangerouslySetInnerHTML={{ __html: reportContent }} />
                <hr className="divider" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleUploadReport} className="flex-1 py-3 px-6 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200">
                  Upload
                </button>
                <button onClick={() => setShowPreview(false)} className="flex-1 py-3 px-6 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200">
                  Back to Editor
                </button>
              </div>
            </div>
          </div>

          {/* Patient's Section */}
          <div className="bg-blue-50 p-6 md:p-8 rounded-xl shadow-inner">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Patient's View</h3>
            <p className="text-gray-600 mb-4">Enter the Patient ID to view their reports.</p>
            <input type="text" value={patientIdView} onChange={(e) => setPatientIdView(e.target.value)} placeholder="Enter Patient ID" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />
            <button onClick={handleViewReports} className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200">
              View Reports
            </button>
            <div id="reportsContainer" className="mt-8 space-y-6">
              {viewedReports.length > 0 ? (
                viewedReports.map((report, index) => (
                  <div key={index} className="prescription-container shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div className="prescription-header">
                        <div className="rx-symbol">℞</div>
                        <h1 className="text-2xl sm:text-3xl font-bold">PRESCRIPTION</h1>
                      </div>
                      <p className="text-sm text-gray-500">{new Date(report.timestamp).toLocaleDateString()}</p>
                    </div>
                    <hr className="divider" />
                    <div className="my-4">
                      <p className="font-bold">Hospital Name: <span className="font-normal">{report.hospitalName}</span></p>
                      <p className="font-bold">Patient ID: <span className="font-normal">{report.patientId}</span></p>
                      <p className="font-bold">Patient Name: <span className="font-normal">{report.patientName}</span></p>
                      <p className="font-bold">Patient Age: <span className="font-normal">{report.patientAge}</span></p>
                      <p className="font-bold">Patient Disease: <span className="font-normal">{report.patientDisease}</span></p>
                      <h2 className="text-xl font-semibold">{report.title}</h2>
                    </div>
                    <hr className="divider" />
                    <div className="prose max-w-none my-4" dangerouslySetInnerHTML={{ __html: report.content }} />
                    <hr className="divider" />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Reports will appear here.</p>
              )}
            </div>
          </div>
        </div>

        {/* Custom Modal for Alerts/Messages */}
        {modal.isVisible && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
              <h4 className="text-lg font-bold mb-2">{modal.title}</h4>
              <p className="text-gray-700 mb-4">{modal.message}</p>
              <button onClick={closeCustomModal} className="py-2 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CareMitraReport;