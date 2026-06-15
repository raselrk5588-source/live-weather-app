import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawMobile = body.user_mobile || '';
    
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
      applicationId: 'APP_137295',
      password: '9e8c0ab0d1dc07e553e13fcf824a3be2',
      subscriberId: subscriberId,
    };
    
    const res = await fetch('https://developer.bdapps.com/subscription/getStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    const responseJson = await res.text();
    
    let response;
    try {
      response = JSON.parse(responseJson);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid response' });
    }
    
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
    
  } catch (error) {
    return NextResponse.json({
      error: 'Server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}
