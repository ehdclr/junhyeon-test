import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import '@/style/globals.css';

export const metadata: Metadata = {
  title: {
    template: 'Calog | %s',
    default: 'Calog',
  },
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div id="modal" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
