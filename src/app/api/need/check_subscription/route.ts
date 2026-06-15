import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let rawMobile = '';
    
    // Support both FormData and JSON requests
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      rawMobile = params.get('user_mobile')?.toString() || '';
    } else if (contentType.includes('application/json')) {
      const json = await request.json();
      rawMobile = json.user_mobile || '';
    }

    if (!rawMobile) {
      return NextResponse.json({ error: 'Mobile number required' }, { status: 400 });
    }

    let digits = rawMobile.replace(/\D+/g, '');

    // Accept 018xxxxxxxx, 88018xxxxxxxx, or 8818xxxxxxxx and normalize to 018xxxxxxxx
    if (digits.startsWith('880') && digits.length === 13) {
      digits = '0' + digits.substring(3);
    } else if (digits.startsWith('88') && digits.length === 12) {
      digits = '0' + digits.substring(2);
    }

    // Validate Bangladesh mobile number
    if (!/^01[3-9][0-9]{8}$/.test(digits)) {
      return NextResponse.json({
        error: 'Invalid mobile number format',
        providedNumber: rawMobile
      });
    }

    // bdapps subscriberId format
    const subscriberId = 'tel:88' + digits;

    const requestData = {
      version: '1.0',
      applicationId: 'APP_138374',
      password: 'ba4527f88f6fa673b7d230606dd5ea8d',
      subscriberId: subscriberId,
    };

    // BDApps subscription status API
    const url = 'https://developer.bdapps.com/subscription/getStatus';
    
    const bdappsRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!bdappsRes.ok) {
      return NextResponse.json({
        error: 'BDApps API failed',
        status: bdappsRes.status
      });
    }

    const response = await bdappsRes.json();
    
    const status = (response.subscriptionStatus || '').trim().toUpperCase();
    const isSubscribed = (status === 'REGISTERED');

    return NextResponse.json({
      subscriptionStatus: status,
      isSubscribed: isSubscribed,
      statusCode: response.statusCode || null,
      statusDetail: response.statusDetail || null,
      version: response.version || null,
      subscriberId: subscriberId
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}
