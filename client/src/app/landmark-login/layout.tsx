import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion Administration | Landmark Agency",
  description: "Accès réservé à l'administration Landmark",
  robots: "noindex, nofollow",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
