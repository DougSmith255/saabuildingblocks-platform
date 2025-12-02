import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: In the future, this will check actual OAuth tokens / API keys
    // For now, return hardcoded status (will be updated when we configure each platform)

    const platformStatus = {
      twitter: { connected: false },
      linkedin: { connected: false },
      facebook: { connected: false },
      pinterest: { connected: false },
      medium: { connected: false },
    };

    return NextResponse.json(platformStatus);

  } catch (error) {
    console.error('Error checking platform status:', error);
    return NextResponse.json(
      { error: 'Failed to check platform status' },
      { status: 500 }
    );
  }
}
