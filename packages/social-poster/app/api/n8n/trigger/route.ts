import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blogUrl, platforms } = body;

    if (!blogUrl || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Missing blog URL or platforms' },
        { status: 400 }
      );
    }

    // Get n8n webhook URL from environment variables
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      console.error('N8N_WEBHOOK_URL not configured');
      return NextResponse.json(
        { error: 'n8n webhook not configured' },
        { status: 500 }
      );
    }

    // Trigger n8n workflow
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blogUrl,
        platforms,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('n8n webhook error:', errorText);
      return NextResponse.json(
        { error: 'Failed to trigger n8n workflow', details: errorText },
        { status: 500 }
      );
    }

    const n8nData = await n8nResponse.json();

    // Return the results from n8n
    return NextResponse.json({
      success: true,
      results: n8nData.results || {},
      message: 'Posting workflow triggered successfully',
    });

  } catch (error) {
    console.error('Error triggering n8n workflow:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
