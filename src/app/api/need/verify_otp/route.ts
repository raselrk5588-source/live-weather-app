import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let user_otp = '';
    let referenceNo = '';
    
    // Support both FormData and JSON requests
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      user_otp = params.get('Otp')?.toString().trim() || '';
      referenceNo = params.get('referenceNo')?.toString().trim() || '';
    } else if (contentType.includes('application/json')) {
      const json = await request.json();
      user_otp = json.Otp?.trim() || '';
      referenceNo = json.referenceNo?.trim() || '';
    }

    if (!user_otp || !referenceNo) {
      return NextResponse.json({
        statusCode: 'FAILED',
        message: 'Missing OTP or referenceNo',
        statusDetail: 'OTP and reference number are required'
      }, { status: 400 });
    }

    const requestData = {
      applicationId: "APP_138374",
      password: "ba4527f88f6fa673b7d230606dd5ea8d",
      referenceNo: referenceNo,
      otp: user_otp
    };

    const url = "https://developer.bdapps.com/subscription/otp/verify";
    
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
        statusCode: 'FAILED',
        message: 'Connection error',
        statusDetail: 'Unable to connect to BDApps server or server returned error',
        rawResponse: responseText
      });
    }

    let response;
    try {
      response = JSON.parse(responseText);
    } catch (e) {
      return NextResponse.json({
        statusCode: 'FAILED',
        message: 'Invalid API response',
        statusDetail: 'Failed to parse BDApps response',
        rawResponse: responseText
      });
    }

    // Return the response from BDApps
    return NextResponse.json({
      statusCode: response.statusCode || 'FAILED',
      statusDetail: response.statusDetail || '',
      subscriptionStatus: response.subscriptionStatus || '',
      subscriberId: response.subscriberId || '',
      version: response.version || ''
    });

  } catch (error: any) {
    return NextResponse.json({
      statusCode: 'FAILED',
      message: 'Server error: ' + error.message,
      statusDetail: 'Internal Server Error'
    }, { status: 500 });
  }
}
