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
      return NextResponse.json({ success: false, message: 'Mobile number required' }, { status: 400 });
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
        success: false,
        message: 'Invalid mobile number format',
        referenceNo: null
      });
    }

    // bdapps subscriberId format
    const user_mobile = 'tel:88' + digits;

    const requestData = {
      applicationId: 'APP_138374',
      password: 'ba4527f88f6fa673b7d230606dd5ea8d',
      subscriberId: user_mobile,
      applicationHash: 'App Name',
      applicationMetaData: {
        client: 'MOBILEAPP',
        device: 'Samsung S10',
        os: 'android 8',
        appCode: 'https://play.google.com/store/apps/details?id=lk.dialog.megarunlor'
      }
    };

    const url = 'https://developer.bdapps.com/subscription/otp/request';
    
    const bdappsRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const responseText = await bdappsRes.text();

    if (responseText.toLowerCase().includes('<html') || responseText.toLowerCase().includes('<!doctype')) {
      return NextResponse.json({
        success: false,
        message: 'Server returned HTML instead of JSON. HTTP code: ' + bdappsRes.status,
        referenceNo: null,
        rawResponse: responseText.substring(0, 500)
      });
    }

    let response;
    try {
      response = JSON.parse(responseText);
    } catch (e) {
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON in response',
        raw: responseText.substring(0, 500),
        referenceNo: null,
        httpCode: bdappsRes.status
      });
    }

    const referenceNo = response.referenceNo?.toString().trim() || '';
    const statusCode = response.statusCode?.toString() || '';
    const statusDetail = response.statusDetail?.toString() || '';
    const version = response.version?.toString() || '';

    if (referenceNo !== '') {
      return NextResponse.json({
        success: true,
        referenceNo: referenceNo,
        statusCode: statusCode,
        statusDetail: statusDetail,
        version: version
      });
    }

    return NextResponse.json({
      success: false,
      message: statusDetail !== '' ? statusDetail : 'OTP reference not returned',
      referenceNo: null,
      statusCode: statusCode,
      statusDetail: statusDetail,
      version: version,
      subscriberId: user_mobile
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Server error: ' + error.message, referenceNo: null }, { status: 500 });
  }
}
