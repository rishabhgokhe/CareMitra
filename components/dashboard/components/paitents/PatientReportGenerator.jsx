"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PatientReportGenerator({
  patient,
  appointments,
  records,
  prescriptions,
}) {
  const generateReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Patient Report", 14, 20);

    // Patient Info
    doc.setFontSize(12);
    doc.text("Patient Information", 14, 30);
    autoTable(doc, {
      startY: 35,
      head: [["Name", "Email", "Phone", "Age"]],
      body: [
        [
          patient?.name || "N/A",
          patient?.email || "N/A",
          patient?.phone || "N/A",
          patient?.age || "N/A",
        ],
      ],
    });

    // Appointments
    doc.text("Appointments", 14, doc.lastAutoTable.finalY + 10);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Date", "Hospital", "Status", "Notes"]],
      body: (appointments || []).map((a) => [
        a.scheduled_at ? new Date(a.scheduled_at).toLocaleString() : "N/A",
        a.hospital_name || "N/A",
        a.status || "N/A",
        a.notes || "N/A",
      ]),
    });

    // Records
    doc.text("Medical Records", 14, doc.lastAutoTable.finalY + 10);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Title", "Description"]],
      body: (records || []).map((r) => [r.title || "N/A", r.description || ""]),
    });

    // Prescriptions
    doc.text("Prescriptions", 14, doc.lastAutoTable.finalY + 10);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Medicine", "Dosage", "Duration"]],
      body: (prescriptions || []).map((rx) => [
        rx.medicine || "N/A",
        rx.dosage || "N/A",
        rx.duration || "N/A",
      ]),
    });

    // Save PDF
    doc.save(`${patient?.name || "patient"}_report.pdf`);
  };

  return (
    <div className="mt-6 flex justify-end">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="flex items-center gap-2 cursor-pointer"
            variant="link"
          >
            <FileDown className="w-4 h-4" /> Generate Report
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Patient Report</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a PDF containing patient details, appointments,
              medical records, and prescriptions. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={generateReport}
              className="cursor-pointer"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
