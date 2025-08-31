import { ThemeProvider } from "next-themes";
import { AuthProvider } from "../lib/auth-context";

import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider attribute={"class"}>{children}</ThemeProvider>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
