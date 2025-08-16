import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";

export const metadata = {
  title: "Gold Bingo Admin",
  description: "Administration panel for Gold Bingo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
