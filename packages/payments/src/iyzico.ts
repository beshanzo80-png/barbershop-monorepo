import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import { z } from 'zod';
import { formatCurrency } from '@barbershop/utils';

// İyzico Configuration Schema
const IyzicoConfigSchema = z.object({
  apiKey: z.string().min(1),
  secretKey: z.string().min(1),
  baseUrl: z.string().url().default('https://sandbox-api.iyzipay.com'),
  callbackUrl: z.string().url(),
});

type IyzicoConfig = z.infer<typeof IyzicoConfigSchema>;

// Request/Response Types
const IyzicoPaymentRequestSchema = z.object({
  locale: z.string().default('tr'),
  conversationId: z.string(),
  price: z.string(), // "100.00"
  paidPrice: z.string(), // "100.00"
  currency: z.string().default('TRY'),
  installment: z.number().default(1),
  basketId: z.string(),
  paymentChannel: z.enum(['WEB', 'MOBILE', 'MOBILE_WEB']).default('WEB'),
  paymentGroup: z.enum(['PRODUCT', 'SUBSCRIPTION', 'LISTING']).default('PRODUCT'),
  callbackUrl: z.string().url(),
  buyer: z.object({
    id: z.string(),
    name: z.string(),
    surname: z.string(),
    gsmNumber: z.string().optional(),
    email: z.string().email(),
    identityNumber: z.string().optional(),
    lastLoginDate: z.string().optional(),
    registrationDate: z.string().optional(),
    registrationAddress: z.string().optional(),
    ip: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
  }),
  shippingAddress: z.object({
    contactName: z.string(),
    city: z.string(),
    country: z.string(),
    address: z.string(),
    zipCode: z.string(),
  }).optional(),
  billingAddress: z.object({
    contactName: z.string(),
    city: z.string(),
    country: z.string(),
    address: z.string(),
    zipCode: z.string(),
  }).optional(),
  basketItems: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category1: z.string(),
    category2: z.string().optional(),
    itemType: z.enum(['PHYSICAL', 'VIRTUAL']).default('VIRTUAL'),
    price: z.string(), // "100.00"
  })),
});

type IyzicoPaymentRequest = z.infer<typeof IyzicoPaymentRequestSchema>;

const IyzicoPaymentResponseSchema = z.object({
  status: z.enum(['success', 'failure']),
  errorCode: z.string().optional(),
  errorMessage: z.string().optional(),
  errorGroup: z.string().optional(),
  locale: z.string(),
  systemTime: z.number(),
  conversationId: z.string(),
  token: z.string().optional(),
  callbackUrl: z.string().optional(),
  paymentId: z.string().optional(),
  price: z.string().optional(),
  paidPrice: z.string().optional(),
  currency: z.string().optional(),
  installment: z.number().optional(),
  basketId: z.string().optional(),
  paymentChannel: z.string().optional(),
  paymentGroup: z.string().optional(),
  cardAssociation: z.string().optional(),
  cardFamily: z.string().optional(),
  cardType: z.string().optional(),
  fraudStatus: z.number().optional(),
  iyzicoCommissionFee: z.string().optional(),
  iyzicoCommissionRateAmount: z.string().optional(),
  merchantCommissionRate: z.string().optional(),
  merchantCommissionRateAmount: z.string().optional(),
  paidPriceBeforeLoyalty: z.string().optional(),
  loyaltyPointsEarned: z.number().optional(),
});

type IyzicoPaymentResponse = z.infer<typeof IyzicoPaymentResponseSchema>;

export class IyzicoPaymentService {
  private client: AxiosInstance;
  private config: IyzicoConfig;

  constructor(config: IyzicoConfig) {
    this.config = IyzicoConfigSchema.parse(config);
    
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use((config) => {
      const randomString = this.generateRandomString(12);
      const authHeader = this.generateAuthHeader(config, randomString);
      config.headers['Authorization'] = authHeader;
      config.headers['x-iyzi-rnd'] = randomString;
      return config;
    });
  }

  private generateRandomString(length: number): string {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
  }

  private generateAuthHeader(config: any, randomString: string): string {
    const stringToSign = `${this.config.apiKey}${randomString}${config.method?.toUpperCase() || 'POST'}${config.url}${JSON.stringify(config.data || {})}`;
    const hash = crypto.createHmac('sha1', this.config.secretKey).update(stringToSign).digest('base64');
    return `IYZWS ${this.config.apiKey}:${hash}`;
  }

  /**
   * Initialize a payment and get token for checkout form
   */
  async initializePayment(request: IyzicoPaymentRequest): Promise<{
    token: string;
    callbackUrl: string;
    paymentId: string;
  }> {
    const validatedRequest = IyzicoPaymentRequestSchema.parse(request);
    
    const response = await this.client.post('/payment/iyzipos', validatedRequest);
    const data = IyzicoPaymentResponseSchema.parse(response.data);

    if (data.status !== 'success') {
      throw new Error(`İyzico error: ${data.errorMessage} (${data.errorCode})`);
    }

    return {
      token: data.token!,
      callbackUrl: data.callbackUrl!,
      paymentId: data.paymentId!,
    };
  }

  /**
   * Retrieve payment result after callback
   */
  async retrievePayment(token: string): Promise<IyzicoPaymentResponse> {
    const response = await this.client.post('/payment/iyzipos/retrieve', { token, locale: 'tr' });
    return IyzicoPaymentResponseSchema.parse(response.data);
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentId: string, amount: string, reason: string): Promise<any> {
    const response = await this.client.post('/payment/refund', {
      locale: 'tr',
      paymentId,
      amount,
      reason,
    });
    return response.data;
  }

  /**
   * Cancel a payment (before capture)
   */
  async cancelPayment(paymentId: string): Promise<any> {
    const response = await this.client.post('/payment/cancel', {
      locale: 'tr',
      paymentId,
    });
    return response.data;
  }

  /**
   * Get installment info for a bin number
   */
  async getInstallmentInfo(binNumber: string, price: string): Promise<any> {
    const response = await this.client.post('/payment/bin/check', {
      locale: 'tr',
      binNumber,
      price,
    });
    return response.data;
  }

  /**
   * Verify callback signature
   */
  verifyCallback(body: any, signature: string): boolean {
    const sortedKeys = Object.keys(body).sort();
    const concatenated = sortedKeys.map(key => body[key]).join('');
    const expectedSignature = crypto
      .createHmac('sha1', this.config.secretKey)
      .update(concatenated)
      .digest('base64');
    
    return signature === expectedSignature;
  }
}

/**
 * Create payment request for barbershop appointment
 */
export function createBarbershopPaymentRequest(params: {
  appointmentId: string;
  appointmentUuid: string;
  customer: { id: string; name: string; email: string; phone: string };
  services: Array<{ id: string; name: string; price: number }>;
  totalPrice: number;
  callbackUrl: string;
  clientIp: string;
}): IyzicoPaymentRequest {
  const price = params.totalPrice.toFixed(2);
  const conversationId = `appt_${params.appointmentUuid}_${Date.now()}`;
  const basketId = `basket_${params.appointmentUuid}`;
  
  const [name, surname] = params.customer.name.split(' ');
  
  return {
    locale: 'tr',
    conversationId,
    price,
    paidPrice: price,
    currency: 'TRY',
    installment: 1,
    basketId,
    paymentChannel: 'WEB',
    paymentGroup: 'PRODUCT',
    callbackUrl: params.callbackUrl,
    buyer: {
      id: params.customer.id,
      name,
      surname: surname || '',
      gsmNumber: params.customer.phone.replace('+90', ''),
      email: params.customer.email,
      ip: params.clientIp,
      registrationDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
    },
    shippingAddress: {
      contactName: params.customer.name,
      city: 'İstanbul',
      country: 'Türkiye',
      address: 'Online Randevu',
      zipCode: '34000',
    },
    billingAddress: {
      contactName: params.customer.name,
      city: 'İstanbul',
      country: 'Türkiye',
      address: 'Online Randevu',
      zipCode: '34000',
    },
    basketItems: params.services.map((service, index) => ({
      id: service.id,
      name: service.name,
      category1: 'Kişisel Bakım',
      category2: 'Berber Hizmeti',
      itemType: 'VIRTUAL' as const,
      price: service.price.toFixed(2),
    })),
  };
}

/**
 * Factory function to create service instance
 */
export function createIyzicoService(): IyzicoPaymentService {
  const config = {
    apiKey: process.env.IYZICO_API_KEY || '',
    secretKey: process.env.IYZICO_SECRET_KEY || '',
    baseUrl: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/payments/callback`,
  };

  return new IyzicoPaymentService(config);
}

// Export singleton instance (lazy initialization)
let iyzicoInstance: IyzicoPaymentService | null = null;

export function getIyzicoService(): IyzicoPaymentService {
  if (!iyzicoInstance) {
    iyzicoInstance = createIyzicoService();
  }
  return iyzicoInstance;
}

export type { IyzicoConfig, IyzicoPaymentRequest, IyzicoPaymentResponse };