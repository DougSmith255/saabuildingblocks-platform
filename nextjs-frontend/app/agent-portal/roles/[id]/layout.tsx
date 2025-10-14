/**
 * Layout for dynamic role pages
 * Provides generateStaticParams to skip static export (auth-protected page)
 */

export const dynamicParams = false; // Don't generate pages for params not in generateStaticParams

export async function generateStaticParams() {
  return []; // Skip static generation for auth-protected dynamic route
}

export default function RoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
