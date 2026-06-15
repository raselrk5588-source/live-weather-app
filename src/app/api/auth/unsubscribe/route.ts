import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawMobile = body.user_mobile || body.subscriberId || '';
    
    if (!rawMobile) {
      return NextResponse.json({ error: 'Mobile number required' });
    }
    
    let digits = rawMobile.replace(/\D+/g, '');
    if (digits.length === 13 && digits.startsWith('88')) {
      digits = digits.substring(2);
    }
    
    if (digits.length !== 11 || !digits.startsWith('0')) {
      return NextResponse.json({ error: 'Invalid mobile format' });
    }

    // --- DEMO NUMBER FOR TESTING ---
    if (digits === '01700000000') {
      return NextResponse.json({
        success: true,
        subscriberId: 'tel:8801700000000',
        action: '0',
        version: '1.0',
        statusCode: 'S1000',
        statusDetail: 'Success',
        subscriptionStatus: 'UNREGISTERED',
        rawResponse: '{"statusCode":"S1000","statusDetail":"Success","subscriptionStatus":"UNREGISTERED"}'
      });
    }
    // --------------------------------
    
    const subscriberId = 'tel:88' + digits;
    const appId = 'APP_137295';
    const password = '9e8c0ab0d1dc07e553e13fcf824a3be2';
    
    const requestData = {
      applicationId: appId,
      password: password,
      subscriberId: subscriberId,
      version: '1.0',
      action: '0',
    };
    
    const res = await fetch('https://developer.bdapps.com/subscription/send', {
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
      return NextResponse.json({
        success: false,
        error: 'Invalid response',
        raw: responseJson
      });
    }
    
    const statusCode = (response.statusCode || '').toString().toUpperCase();
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
      rawResponse: responseJson
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}
