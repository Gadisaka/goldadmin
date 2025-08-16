import "./globals.css";

export const metadata = {
  title: "Gold Bingo Admin",
  description: "Administration panel for Gold Bingo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
