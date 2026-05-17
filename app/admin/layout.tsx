import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Inmarco',
  description: 'Inmarco Admin Analytics Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
