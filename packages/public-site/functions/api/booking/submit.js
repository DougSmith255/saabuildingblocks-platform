/**
 * Booking Submit API
 * Creates a contact and appointment in GoHighLevel
 *
 * POST /api/booking/submit
 * Body: { firstName, lastName, email, phone?, country, state,
 *         experienceLevel, careerPlan, selectedSlot, timezone }
 */

const LOCATION_ID = 'wmYRsn57bNL8Z2tMlIZ7';
const CALENDAR_ID = 'v5LFLy12isdGJiZmTxP7';
const API_BASE = 'https://services.leadconnectorhq.com';
const SLOT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const API_KEY = context.env.GOHIGHLEVEL_API_KEY;
  if (!API_KEY) {
    console.error('GOHIGHLEVEL_API_KEY environment variable not set');
    return Response.json(
      { error: 'Booking service is not configured' },
      { status: 500 }
    );
  }

  const {
    firstName, lastName, email, phone,
    country, state, experienceLevel, careerPlan,
    selectedSlot, timezone,
  } = body;

  // Validate required fields
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !selectedSlot) {
    return Response.json(
      { error: 'Please fill in all required fields' },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email address' }, { status: 400 });
  }

  try {
    // Step 1: Upsert contact in GHL
    const tags = ['booking_request'];
    if (experienceLevel) tags.push(`exp:${experienceLevel}`);
    if (careerPlan) tags.push(`career:${careerPlan}`);

    const contactPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      locationId: LOCATION_ID,
      source: 'SAA Booking Widget',
      tags,
    };

    if (phone?.trim()) contactPayload.phone = phone.trim();
    if (country) contactPayload.country = country;
    if (state?.trim()) contactPayload.state = state.trim();
    if (timezone) contactPayload.timezone = timezone;

    const contactRes = await fetch(`${API_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28',
      },
      body: JSON.stringify(contactPayload),
    });

    if (!contactRes.ok) {
      const errText = await contactRes.text();
      console.error(`Contact upsert failed (${contactRes.status}):`, errText);
      throw new Error('Failed to process your information');
    }

    const contactData = await contactRes.json();
    const contactId = contactData.contact?.id;

    if (!contactId) {
      console.error('Contact upsert missing id:', JSON.stringify(contactData));
      throw new Error('Failed to process your information');
    }

    // Step 2: Create appointment
    const startTime = selectedSlot;
    const endTime = new Date(
      new Date(selectedSlot).getTime() + SLOT_DURATION_MS
    ).toISOString();

    const appointmentRes = await fetch(
      `${API_BASE}/calendars/events/appointments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Version': '2021-04-15',
        },
        body: JSON.stringify({
          calendarId: CALENDAR_ID,
          locationId: LOCATION_ID,
          contactId,
          startTime,
          endTime,
          title: `${firstName.trim()} ${lastName.trim()} SAA Meeting`,
          appointmentStatus: 'new',
          toNotify: true,
        }),
      }
    );

    if (!appointmentRes.ok) {
      const errText = await appointmentRes.text();
      console.error(`Appointment failed (${appointmentRes.status}):`, errText);
      throw new Error('Failed to schedule your appointment');
    }

    const appointmentData = await appointmentRes.json();

    return Response.json({
      success: true,
      appointmentId: appointmentData.id,
      message: 'Your call has been scheduled!',
    });
  } catch (err) {
    console.error('Booking submit error:', err);
    return Response.json(
      { error: err.message || 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
