import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnection } from '@/app/lib/database';
import { UserLogin } from '@/app/lib/model';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET as string)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log('Razorpay webhook event:', event);

    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptured(payment: any) {
  try {
    // Log the payment captured event but don't update payment status
    // Payment status is updated by the /api/payment/verify endpoint
    console.log('Payment captured webhook received:', {
      paymentId: payment.id,
      orderId: payment.order_id,
      amount: payment.amount,
      status: payment.status,
      method: payment.method,
      timestamp: new Date().toISOString()
    });
    
    // We don't update payment status here to avoid race conditions
    // The payment verification endpoint is the single source of truth
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    // Log the payment failed event but don't update payment status
    console.log('Payment failed webhook received:', {
      paymentId: payment.id,
      orderId: payment.order_id,
      amount: payment.amount,
      status: payment.status,
      error: payment.error_code,
      errorDescription: payment.error_description,
      timestamp: new Date().toISOString()
    });
    
    // We only log the failure here for monitoring purposes
    // No database updates to avoid conflicts with the payment verification flow
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handleOrderPaid(order: any) {
  try {
    // Log the order paid event but don't update credits
    // Credits are updated by the /api/payment/verify endpoint
    console.log('Order paid webhook received:', {
      orderId: order.id,
      amount: order.amount,
      notes: order.notes,
      status: order.status,
      timestamp: new Date().toISOString()
    });
    
    // We don't update credits here to avoid duplication
    // The payment verification endpoint is the single source of truth
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
}
