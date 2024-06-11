import { Request, Response } from 'express';
import dbConnection from '../database';
import Product from '../database/models/productEntity';
import errorHandler from '../middlewares/errorHandler';
import Stripe from 'stripe';
import { Order } from '../database/models/orderEntity';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});
const productRepository = dbConnection.getRepository(Product);
const orderRepository = dbConnection.getRepository(Order);

export const getOneProduct = errorHandler(
  async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);

    const product = await productRepository.findOne({
      where: { id: productId },
      relations: ['category'],
    });

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    return res
      .status(200)
      .json({ msg: 'Product retrieved successfully', product });
  }
);

export const handlePayment = errorHandler(
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    if (order.paid) {
      return res
        .status(400)
        .json({ success: false, message: 'Order has already been paid' });
    }

    const amountInCents = order.totalAmount * 100;

    const charge = await stripe.charges.create({
      amount: amountInCents,
      currency: 'usd',
      description: 'Test Charge',
      source: token,
    });

    if (charge.status === 'succeeded') {
      order.paid = true;
      await orderRepository.save(order);

      return res.status(200).json({ success: true, paid: true, charge });
    } else {
      return res
        .status(400)
        .json({
          success: false,
          paid: false,
          message: `Charge status: ${charge.status}`,
        });
    }
  }
);

type Idata = {
  access_token: string;
  token_type: string;
  expires_in: string;
};

type IStatus = {
  amount: string;
  currency: string;
  externalId: string;
  payer: object;
  payerMessage: string;
  payeeNote: string;
  status: string;
  reason: object;
};

type Ivalidate = {
  result: boolean;
};

const XRefId = process.env.XRefId as string;
const tokenUrl = process.env.TokenUrl as string;
const subscriptionKey = process.env.subscriptionKey as string;
const requesttoPayUrl = process.env.RequestToPayUrl as string;
const targetEnv = process.env.TargetEnv as string;
const apiKeyUrl = process.env.apiKeyUrl as string;

export const GenerateApiKey = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${apiKeyUrl}/${XRefId}/apikey`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'X-Reference-Id': XRefId,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = (await response.json()) as { apiKey: string };
      return data.apiKey;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const purchaseAccessToken = async (): Promise<string | null> => {
  const apiKey = await GenerateApiKey();
  if (!apiKey) {
    return null;
  }

  const basicAuth = btoa(`${XRefId}:${apiKey}`);
  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'X-Reference-Id': XRefId,
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = (await response.json()) as Idata;
      return data.access_token;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error occurred while fetching the access token', error);
    return null;
  }
};

export async function requestToPay(
  token: string,
  xrefid: string,
  externalId: string,
  currency: string,
  amount: string,
  number: string,
  payerMsg: string,
  payeeNote: string
) {
  let response = await fetch(requesttoPayUrl, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      Authorization: `Bearer ${token}`,
      'X-Target-Environment': targetEnv,
      'X-Reference-Id': xrefid,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amount,
      currency: currency,
      externalId: externalId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: number,
      },
      payerMessage: payerMsg,
      payeeNote: payeeNote,
    }),
  });
  return response;
}

export async function requestToPayStatus(id: string, token: string) {
  let response = await fetch(`${requesttoPayUrl}/${id}`, {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      Authorization: `Bearer ${token}`,
      'X-Target-Environment': targetEnv,
    },
  });
  let data = (await response.json()) as IStatus;
  console.log(data);
  return data;
}

export const validateMomo = async (token: string, momoaccount: string) => {
  const validateURL = `https://sandbox.momodeveloper.mtn.com/collection/v1_0/accountholder/msisdn/${momoaccount}/active`;
  try {
    const resp = await fetch(validateURL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'X-Target-Environment': targetEnv,
      },
    });

    let response = (await resp.json()) as Ivalidate;
    console.log('Validation response:', response);
    return response.result;
  } catch (error) {
    console.error('Error in validateMomo:', error);
    return null;
  }
};

export const MomohandlePayment = errorHandler(
  async (req: Request, res: Response) => {
    let token = (await purchaseAccessToken()) as string;
    const { orderId, momoNumber } = req.body;
    const isValid = await validateMomo(token, momoNumber);

    if (!isValid) {
      console.log('Invalid MoMo number:', momoNumber);
      return res
        .status(400)
        .json({ message: 'Your Momo Number does not Exist' });
    }
    const order = await orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    if (order.paid) {
      return res
        .status(400)
        .json({ success: false, message: 'Order has already been paid' });
    }

    let requestId = crypto.randomUUID();
    let externalId = crypto.randomUUID();

    let response = await requestToPay(
      token,
      requestId,
      externalId,
      'EUR',
      order.totalAmount.toString(),
      momoNumber,
      `paid by ${momoNumber}`,
      `paid to ${momoNumber}`
    );

    if (response.ok) {
      return res
        .status(202)
        .json({ message: 'Transaction Accepted', requestId });
    }
    return res.status(400).json({ message: 'Transaction Fail' });
  }
);
export const checkPaymentStatus = errorHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { requestId } = req.body;
    const order = await orderRepository.findOne({ where: { id: id } });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    let token = (await purchaseAccessToken()) as string;

    const data = await requestToPayStatus(requestId, token);

    // Check if validation failed due to an error
    if (data === null) {
      return res
        .status(500)
        .json({ success: false, message: 'Error occurred during validation' });
    }

    if (data.status === 'SUCCESSFUL') {
      order.paid = true;
      await orderRepository.save(order);
      return res
        .status(200)
        .json({ success: true, message: 'Transaction Done Successfully' });
    }
    return res.status(400).json({
      success: false,
      message: 'Transaction failed',
      reason: data.reason,
    });
  }
);
