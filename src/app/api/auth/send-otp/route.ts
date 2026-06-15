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
        success: false,
        message: 'Invalid mobile number format',
        referenceNo: null
      });
    }

    // --- DEMO NUMBER FOR TESTING ---
    if (digits === '01700000000') {
      return NextResponse.json({
        success: true,
        referenceNo: 'DEMO_REF_12345',
        statusCode: 'S1000',
        statusDetail: 'Success',
        version: '1.0'
      });
    }
    // --------------------------------
    
    // bdapps subscriberId format
    const user_mobile = 'tel:88' + digits;
    
    const requestData = {
      applicationId: 'APP_137295',
      password: '9e8c0ab0d1dc07e553e13fcf824a3be2',
      subscriberId: user_mobile,
      applicationHash: 'App Name',
      applicationMetaData: {
        client: 'MOBILEAPP',
        device: 'Samsung S10',
        os: 'android 8',
        appCode: 'https://play.google.com/store/apps/details?id=lk.dialog.megarunlor'
      }
    };
    
    const res = await fetch('https://developer.bdapps.com/subscription/otp/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    const responseJson = await res.text();
    
    // Check if response looks like HTML (error page)
    if (responseJson.toLowerCase().includes('<html') || responseJson.toLowerCase().includes('<!doctype')) {
      return NextResponse.json({
        success: false,
        message: 'Server returned HTML instead of JSON. HTTP code: ' + res.status,
        referenceNo: null,
        rawResponse: responseJson.substring(0, 500)
      });
    }
    
    let response;
    try {
      response = JSON.parse(responseJson);
    } catch (e) {
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON in response',
        raw: responseJson.substring(0, 500),
        referenceNo: null,
        httpCode: res.status
      });
    }
    
    const referenceNo = response.referenceNo?.toString().trim() || '';
    const statusCode = response.statusCode?.toString() || '';
    const statusDetail = response.statusDetail?.toString() || '';
    const version = response.version?.toString() || '';
    
    if (referenceNo !== '') {
      return NextResponse.json({
        success: true,
        referenceNo,
        statusCode,
        statusDetail,
        version
      });
    }
    
    return NextResponse.json({
      success: false,
      message: statusDetail !== '' ? statusDetail : 'OTP reference not returned',
      referenceNo: null,
      statusCode,
      statusDetail,
      version,
      subscriberId: user_mobile
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Server error: ' + (error instanceof Error ? error.message : String(error)),
      referenceNo: null
    }, { status: 500 });
  }
}
