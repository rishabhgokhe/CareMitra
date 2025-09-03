"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchPatients } from "@/utils/fetchPatients";
import { jsPDF } from "jspdf";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

const exportCSV = (patients) => {
  const headers = ["Name", "Age", "Email", "Phone", "Gender", "Blood Group"];
  const rows = patients.map((p) => [
    p.name,
    p.age,
    p.email,
    p.phone,
    p.gender,
    p.blood_group,
  ]);
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((e) => e.join(",")).join("\n");
  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "patients.csv";
  link.click();
};

const exportPDF = (patients) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Patient Report", 20, 20);
  let y = 40;
  patients.forEach((p, i) => {
    doc.setFontSize(12);
    doc.text(`${i + 1}. ${p.name} (${p.age})`, 20, y);
    doc.text(`Email: ${p.email || "N/A"}`, 20, y + 10);
    doc.text(`Phone: ${p.phone || "N/A"}`, 20, y + 20);
    doc.text(`Gender: ${p.gender || "N/A"}`, 20, y + 30);
    doc.text(`Blood Group: ${p.blood_group || "N/A"}`, 20, y + 40);
    y += 60;
  });
  doc.save("patients.pdf");
};

const PatientsTable = () => {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      const { success, data, error } = await fetchPatients(
        [
          "id",
          "name",
          "email",
          "dob",
          "phone",
          "gender",
          "blood_group",
          "created_at",
        ],
        page * limit,
        page * limit + limit - 1
      );
      if (!success) {
        toast.error(error);
      } else {
        setPatients(data);
      }
      setLoading(false);
    };
    loadPatients();
  }, [page]);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.phone || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-background rounded-2xl p-6 shadow border border-border">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold tracking-tight">
            Your Patients
          </h3>
          <Badge
            variant="secondary"
            className="text-xs font-medium px-2 py-0.5"
          >
            {filteredPatients.length}
          </Badge>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                Export CSV
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Export CSV?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will download all visible patients in CSV format.
                  Continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    exportCSV(filteredPatients);
                    toast.success("CSV download started 📥");
                  }}
                >
                  Yes, export
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                Export PDF
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Export PDF?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will generate a PDF report of all visible patients.
                  Continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    exportPDF(filteredPatients);
                    toast.success("PDF generated 📄");
                  }}
                >
                  Yes, export
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Input
        type="text"
        placeholder="Search patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ) : filteredPatients.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center">
          No patients found.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Added On</TableHead>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((p) => (
              <TableRow
                key={p.id}
                onClick={() => router.push(`/patients/${p.id}`)}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.age}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>{p.phone || "—"}</TableCell>
                <TableCell>{p.gender || "—"}</TableCell>
                <TableCell>{p.blood_group || "—"}</TableCell>
                <TableCell>
                  {p.created_at
                    ? new Date(p.created_at).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/patients/${p.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page + 1}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </section>
  );
};

export default PatientsTable;
