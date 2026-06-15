import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let rawMobile = '';
    
    // Support both FormData and JSON requests
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      rawMobile = (params.get('user_mobile') || params.get('subscriberId'))?.toString().trim() || '';
    } else if (contentType.includes('application/json')) {
      const json = await request.json();
      rawMobile = (json.user_mobile || json.subscriberId || '').trim();
    }

    if (!rawMobile) {
      return NextResponse.json({ error: 'Mobile number required' }, { status: 400 });
    }

    let digits = rawMobile.replace(/\D+/g, '');
    if (digits.length === 13 && digits.startsWith('88')) {
      digits = digits.substring(2);
    }

    if (digits.length !== 11 || !digits.startsWith('0')) {
      return NextResponse.json({ error: 'Invalid mobile format' }, { status: 400 });
    }

    const subscriberId = 'tel:88' + digits;
    const appId = 'APP_138374';
    const password = 'ba4527f88f6fa673b7d230606dd5ea8d';

    const requestData = {
      applicationId: appId,
      password: password,
      subscriberId: subscriberId,
      version: '1.0',
      action: '0',
    };

    const url = 'https://developer.bdapps.com/subscription/send';
    
    const bdappsRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const responseText = await bdappsRes.text();

    if (!bdappsRes.ok) {
      return NextResponse.json({
        success: false,
        error: 'BDApps API error',
        subscriberId: subscriberId,
        action: '0',
        raw: responseText
      });
    }

    let response;
    try {
      response = JSON.parse(responseText);
    } catch (e) {
      return NextResponse.json({
        success: false,
        error: 'Invalid response from BDApps',
        subscriberId: subscriberId,
        action: '0',
        raw: responseText
      });
    }

    const statusCode = (response.statusCode?.toString() || '').toUpperCase();
    const subscriptionStatus = response.subscriptionStatus || 'UNKNOWN';

    const success = statusCode === 'S1000' || subscriptionStatus.toUpperCase() === 'UNREGISTERED';

    return NextResponse.json({
      success: success,
      subscriberId: subscriberId,
      action: '0',
      version: '1.0',
      statusCode: response.statusCode || null,
      statusDetail: response.statusDetail || null,
      subscriptionStatus: subscriptionStatus,
      rawResponse: responseText
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Server error: ' + error.message }, { status: 500 });
  }
}
