import { AuthProvider } from '@/app/providers/AuthProvider';

/**
 * Auth Route Group Layout
 * Provides authentication context without header/footer
 */
export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
