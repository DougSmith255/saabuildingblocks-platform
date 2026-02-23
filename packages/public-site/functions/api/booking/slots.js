/**
 * Booking Slots API Proxy
 * Fetches available booking slots from GoHighLevel calendar
 *
 * GET /api/booking/slots?startDate={epochMs}&endDate={epochMs}&timezone={tz}
 */

const CALENDAR_ID = 'v5LFLy12isdGJiZmTxP7';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');
  const timezone = url.searchParams.get('timezone') || 'America/Los_Angeles';

  if (!startDate || !endDate) {
    return Response.json(
      { error: 'startDate and endDate parameters are required' },
      { status: 400 }
    );
  }

  if (isNaN(Number(startDate)) || isNaN(Number(endDate))) {
    return Response.json(
      { error: 'startDate and endDate must be epoch milliseconds' },
      { status: 400 }
    );
  }

  try {
    const ghlUrl = `https://backend.leadconnectorhq.com/calendars/${CALENDAR_ID}/free-slots?startDate=${startDate}&endDate=${endDate}&timezone=${encodeURIComponent(timezone)}`;

    const response = await fetch(ghlUrl, {
      headers: {
        'channel': 'APP',
        'source': 'WEB_USER',
        'version': '2021-04-15',
        'timezone': timezone,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GHL slots API error (${response.status}):`, errorText);
      return Response.json(
        { error: 'Unable to fetch available times' },
        { status: 502 }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    });
  } catch (err) {
    console.error('Slots proxy error:', err);
    return Response.json(
      { error: 'Failed to fetch available times' },
      { status: 502 }
    );
  }
}
