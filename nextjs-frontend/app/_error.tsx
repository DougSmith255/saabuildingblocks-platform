/**
 * Custom Error Page for Static Export
 * Required by Next.js 15 for static builds
 */

'use client';

import { useEffect } from 'react';

interface ErrorProps {
  statusCode?: number;
  error?: Error & { digest?: string };
}

export default function ErrorPage({ statusCode, error }: ErrorProps) {
  useEffect(() => {
    if (error) {
      console.error('Error:', error);
    }
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        {statusCode ? `Error ${statusCode}` : 'An error occurred'}
      </h1>
      <p style={{ color: '#666' }}>
        {statusCode === 404 ? 'Page not found' : 'Something went wrong'}
      </p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
