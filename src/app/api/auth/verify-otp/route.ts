import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user_otp = body.Otp?.toString().trim() || '';
    const referenceNo = body.referenceNo?.toString().trim() || '';
    
    if (!user_otp || !referenceNo) {
      return NextResponse.json({
        statusCode: 'FAILED',
        message: 'Missing OTP or referenceNo',
        statusDetail: 'OTP and reference number are required'
      });
    }

    // --- DEMO NUMBER OTP VERIFICATION ---
    if (referenceNo === 'DEMO_REF_12345' && user_otp === '123456') {
      return NextResponse.json({
        statusCode: 'S1000',
        statusDetail: 'Success',
        subscriptionStatus: 'REGISTERED',
        subscriberId: 'tel:8801700000000',
        version: '1.0'
      });
    }
    // ------------------------------------
    
    const requestData = {
      applicationId: 'APP_137295',
      password: '9e8c0ab0d1dc07e553e13fcf824a3be2',
      referenceNo: referenceNo,
      otp: user_otp
    };
    
    const res = await fetch('https://developer.bdapps.com/subscription/otp/verify', {
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
        statusCode: 'FAILED',
        message: 'Invalid API response',
        statusDetail: 'Failed to parse BDApps response',
        rawResponse: responseJson
      });
    }
    
    return NextResponse.json({
      statusCode: response.statusCode || 'FAILED',
      statusDetail: response.statusDetail || '',
      subscriptionStatus: response.subscriptionStatus || '',
      subscriberId: response.subscriberId || '',
      version: response.version || ''
    });
    
  } catch (error) {
    return NextResponse.json({
      statusCode: 'FAILED',
      message: 'Server error: ' + (error instanceof Error ? error.message : String(error)),
      statusDetail: 'Unable to connect to server'
    }, { status: 500 });
  }
}
