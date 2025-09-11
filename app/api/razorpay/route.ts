import { NextResponse } from "next/server";
import shortid from "shortid";

import Razorpay from 'razorpay';

// Create Razorpay instance
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse request body
    const body = await req.json();
    const { useremail, detail } = body;


    // Validate request data
    if (!useremail || !detail?.amount) {
      return NextResponse.json(
        { msg: "Invalid request data" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(useremail)) {
      return NextResponse.json(
        { msg: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate amount
    const amount = parseInt(detail.amount);
    if (isNaN(amount) || amount <= 0 || amount > 1000000) {
      return NextResponse.json(
        { msg: "Invalid amount" },
        { status: 400 }
      );
    }

    // Validate credits
    const credits = parseInt(detail.credits);
    if (isNaN(credits) || credits <= 0 || credits > 10000) {
      return NextResponse.json(
        { msg: "Invalid credits amount" },
        { status: 400 }
      );
    }

    // Create order
    const options = {
      amount: amount * 100, // Convert to paisa
      currency: "INR",
      receipt: shortid.generate(),
      payment_capture: 1,
      notes: {
        email: useremail,
        credits: credits,
        planName: detail.name || 'Standard',
        amount: amount
      }
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({
      msg: "success",
      order: order
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    
    return NextResponse.json(
      { 
        msg: "Error creating order",
        error: error.message || "Unknown error",
        details: error.error?.description
      },
      { status: error.statusCode || 500 }
    );
  }
}
