import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {/* pt-24 provides space for the fixed navbar */}
          <main className="pt-24 px-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
