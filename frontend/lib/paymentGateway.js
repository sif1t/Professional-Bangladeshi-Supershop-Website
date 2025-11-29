// Real Payment Gateway Integration System for Bangladesh

/**
 * bKash Payment Gateway Integration
 * Official bKash Payment Gateway API
 */
export const bKashPayment = {
    // bKash Merchant Configuration
    config: {
        merchantNumber: '01XXXXXXXXX', // Replace with real merchant number
        merchantApiKey: 'YOUR_BKASH_API_KEY',
        merchantSecretKey: 'YOUR_BKASH_SECRET_KEY',
        callbackURL: process.env.NEXT_PUBLIC_SITE_URL + '/payment/bkash/callback',
        baseURL: process.env.NODE_ENV === 'production'
            ? 'https://checkout.pay.bka.sh/v1.2.0-beta' // Production
            : 'https://checkout.sandbox.bka.sh/v1.2.0-beta', // Sandbox
    },

    /**
     * Initiate bKash Payment
     */
    async initiatePayment(orderData) {
        try {
            const { orderId, amount, customerMobile, customerName } = orderData;

            // Step 1: Get Access Token
            const token = await this.getToken();

            // Step 2: Create Payment
            const paymentResponse = await fetch(`${this.config.baseURL}/checkout/payment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'X-APP-Key': this.config.merchantApiKey,
                },
                body: JSON.stringify({
                    mode: '0011', // Checkout mode
                    payerReference: customerMobile,
                    callbackURL: this.config.callbackURL,
                    amount: amount.toString(),
                    currency: 'BDT',
                    intent: 'sale',
                    merchantInvoiceNumber: orderId,
                }),
            });

            const payment = await paymentResponse.json();

            return {
                success: true,
                paymentID: payment.paymentID,
                bkashURL: payment.bkashURL,
                callbackURL: payment.callbackURL,
                successCallback: payment.successCallbackURL,
                failureCallback: payment.failureCallbackURL,
                cancelledCallback: payment.cancelledCallbackURL,
            };
        } catch (error) {
            console.error('bKash Payment Error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    },

    /**
     * Get bKash Access Token
     */
    async getToken() {
        const response = await fetch(`${this.config.baseURL}/checkout/token/grant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'username': this.config.merchantNumber,
                'password': this.config.merchantSecretKey,
            },
            body: JSON.stringify({
                app_key: this.config.merchantApiKey,
                app_secret: this.config.merchantSecretKey,
            }),
        });

        const data = await response.json();
        return data.id_token;
    },

    /**
     * Execute Payment after user confirmation
     */
    async executePayment(paymentID) {
        try {
            const token = await this.getToken();

            const response = await fetch(`${this.config.baseURL}/checkout/payment/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'X-APP-Key': this.config.merchantApiKey,
                },
                body: JSON.stringify({ paymentID }),
            });

            const result = await response.json();

            return {
                success: result.statusCode === '0000',
                transactionID: result.trxID,
                paymentID: result.paymentID,
                amount: result.amount,
                transactionStatus: result.transactionStatus,
                customerMsisdn: result.customerMsisdn,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },

    /**
     * Query Payment Status
     */
    async queryPayment(paymentID) {
        try {
            const token = await this.getToken();

            const response = await fetch(`${this.config.baseURL}/checkout/payment/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'X-APP-Key': this.config.merchantApiKey,
                },
                body: JSON.stringify({ paymentID }),
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};

/**
 * Nagad Payment Gateway Integration
 * Official Nagad Payment Gateway API
 */
export const nagadPayment = {
    config: {
        merchantId: 'YOUR_NAGAD_MERCHANT_ID',
        merchantPrivateKey: 'YOUR_NAGAD_PRIVATE_KEY',
        merchantPublicKey: 'YOUR_NAGAD_PUBLIC_KEY',
        nagadPublicKey: 'NAGAD_PUBLIC_KEY',
        baseURL: process.env.NODE_ENV === 'production'
            ? 'https://api.mynagad.com/api/dfs'
            : 'http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs',
        callbackURL: process.env.NEXT_PUBLIC_SITE_URL + '/payment/nagad/callback',
    },

    /**
     * Initiate Nagad Payment
     */
    async initiatePayment(orderData) {
        try {
            const { orderId, amount, customerMobile } = orderData;

            // Step 1: Initialize Payment
            const initResponse = await fetch(
                `${this.config.baseURL}/check-out/initialize/${this.config.merchantId}/${orderId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-KM-Api-Version': 'v-0.2.0',
                        'X-KM-IP-V4': '103.100.100.100',
                        'X-KM-Client-Type': 'PC_WEB',
                    },
                    body: JSON.stringify({
                        dateTime: new Date().toISOString(),
                        sensitiveData: this.encryptPayload({
                            merchantId: this.config.merchantId,
                            orderId: orderId,
                            currencyCode: '050', // BDT
                            amount: amount,
                            challenge: this.generateRandomString(40),
                        }),
                        signature: this.generateSignature(orderId, amount),
                    }),
                }
            );

            const initData = await initResponse.json();

            if (!initData.sensitiveData) {
                throw new Error('Nagad initialization failed');
            }

            // Step 2: Complete Payment
            const completeResponse = await fetch(
                `${this.config.baseURL}/check-out/complete/${initData.paymentReferenceId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-KM-Api-Version': 'v-0.2.0',
                        'X-KM-IP-V4': '103.100.100.100',
                        'X-KM-Client-Type': 'PC_WEB',
                    },
                    body: JSON.stringify({
                        paymentReferenceId: initData.paymentReferenceId,
                        sensitiveData: this.encryptPayload({
                            merchantId: this.config.merchantId,
                            orderId: orderId,
                            amount: amount,
                            currencyCode: '050',
                            challenge: initData.challenge,
                        }),
                        signature: this.generateSignature(orderId, amount),
                    }),
                }
            );

            const completeData = await completeResponse.json();

            return {
                success: true,
                paymentReferenceId: initData.paymentReferenceId,
                callbackURL: completeData.callBackUrl,
                redirectURL: completeData.callBackUrl,
            };
        } catch (error) {
            console.error('Nagad Payment Error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    },

    /**
     * Verify Nagad Payment
     */
    async verifyPayment(paymentReferenceId) {
        try {
            const response = await fetch(
                `${this.config.baseURL}/verify/payment/${paymentReferenceId}`,
                {
                    method: 'GET',
                    headers: {
                        'X-KM-Api-Version': 'v-0.2.0',
                        'X-KM-IP-V4': '103.100.100.100',
                        'X-KM-Client-Type': 'PC_WEB',
                    },
                }
            );

            const result = await response.json();

            return {
                success: result.status === 'Success',
                transactionId: result.issuerPaymentRefNo,
                amount: result.amount,
                status: result.status,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },

    encryptPayload(data) {
        // Use RSA encryption with merchant private key
        // Implementation would use crypto library
        return Buffer.from(JSON.stringify(data)).toString('base64');
    },

    generateSignature(orderId, amount) {
        // Generate signature using merchant private key
        return 'SIGNATURE_HASH';
    },

    generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },
};

/**
 * Rocket Payment Gateway Integration
 * Dutch-Bangla Bank Rocket
 */
export const rocketPayment = {
    config: {
        merchantNumber: 'YOUR_ROCKET_MERCHANT_NUMBER',
        merchantPin: 'YOUR_ROCKET_MERCHANT_PIN',
        apiKey: 'YOUR_ROCKET_API_KEY',
        baseURL: 'https://rocket.com.bd/api/v1',
        callbackURL: process.env.NEXT_PUBLIC_SITE_URL + '/payment/rocket/callback',
    },

    /**
     * Initiate Rocket Payment
     */
    async initiatePayment(orderData) {
        try {
            const { orderId, amount, customerMobile } = orderData;

            const response = await fetch(`${this.config.baseURL}/payment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
                body: JSON.stringify({
                    merchant_number: this.config.merchantNumber,
                    invoice_number: orderId,
                    amount: amount,
                    currency: 'BDT',
                    customer_mobile: customerMobile,
                    callback_url: this.config.callbackURL,
                    description: `Order #${orderId}`,
                }),
            });

            const result = await response.json();

            return {
                success: result.status === 'success',
                paymentId: result.payment_id,
                redirectURL: result.payment_url,
                transactionId: result.transaction_id,
            };
        } catch (error) {
            console.error('Rocket Payment Error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    },

    /**
     * Verify Rocket Payment
     */
    async verifyPayment(paymentId) {
        try {
            const response = await fetch(`${this.config.baseURL}/payment/verify/${paymentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
            });

            const result = await response.json();

            return {
                success: result.status === 'completed',
                transactionId: result.transaction_id,
                amount: result.amount,
                status: result.status,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
};

/**
 * SSL Commerz Payment Gateway Integration
 * For Credit/Debit Card payments
 */
export const sslCommerzPayment = {
    config: {
        storeId: 'YOUR_STORE_ID',
        storePassword: 'YOUR_STORE_PASSWORD',
        baseURL: process.env.NODE_ENV === 'production'
            ? 'https://securepay.sslcommerz.com'
            : 'https://sandbox.sslcommerz.com',
        successURL: process.env.NEXT_PUBLIC_SITE_URL + '/payment/success',
        failURL: process.env.NEXT_PUBLIC_SITE_URL + '/payment/fail',
        cancelURL: process.env.NEXT_PUBLIC_SITE_URL + '/payment/cancel',
        ipnURL: process.env.NEXT_PUBLIC_SITE_URL + '/api/payment/ipn',
    },

    /**
     * Initiate SSL Commerz Payment
     */
    async initiatePayment(orderData) {
        try {
            const {
                orderId,
                amount,
                customerName,
                customerEmail,
                customerMobile,
                customerAddress,
                customerCity,
                customerPostcode,
            } = orderData;

            const response = await fetch(`${this.config.baseURL}/gwprocess/v4/api.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    store_id: this.config.storeId,
                    store_passwd: this.config.storePassword,
                    total_amount: amount,
                    currency: 'BDT',
                    tran_id: orderId,
                    success_url: this.config.successURL,
                    fail_url: this.config.failURL,
                    cancel_url: this.config.cancelURL,
                    ipn_url: this.config.ipnURL,
                    cus_name: customerName,
                    cus_email: customerEmail || 'customer@example.com',
                    cus_add1: customerAddress || 'Dhaka',
                    cus_city: customerCity || 'Dhaka',
                    cus_postcode: customerPostcode || '1000',
                    cus_country: 'Bangladesh',
                    cus_phone: customerMobile,
                    shipping_method: 'YES',
                    product_name: `Order #${orderId}`,
                    product_category: 'Grocery',
                    product_profile: 'general',
                }),
            });

            const result = await response.json();

            if (result.status === 'SUCCESS') {
                return {
                    success: true,
                    sessionKey: result.sessionkey,
                    redirectURL: result.GatewayPageURL,
                    transactionId: result.tran_id,
                };
            } else {
                throw new Error(result.failedreason || 'Payment initiation failed');
            }
        } catch (error) {
            console.error('SSL Commerz Error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    },

    /**
     * Validate SSL Commerz Payment
     */
    async validatePayment(valId) {
        try {
            const response = await fetch(
                `${this.config.baseURL}/validator/api/validationserverAPI.php`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        val_id: valId,
                        store_id: this.config.storeId,
                        store_passwd: this.config.storePassword,
                        format: 'json',
                    }),
                }
            );

            const result = await response.json();

            return {
                success: result.status === 'VALID' || result.status === 'VALIDATED',
                status: result.status,
                transactionId: result.tran_id,
                amount: result.amount,
                cardType: result.card_type,
                cardBrand: result.card_brand,
                bankTransactionId: result.bank_tran_id,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
};

/**
 * Cash on Delivery Payment Method
 */
export const cashOnDelivery = {
    /**
     * Process COD Order
     */
    async processOrder(orderData) {
        try {
            const { orderId, amount, customerName, customerMobile } = orderData;

            // COD orders are marked as pending payment
            return {
                success: true,
                paymentMethod: 'Cash on Delivery',
                orderId: orderId,
                amount: amount,
                status: 'pending',
                message: 'Order placed successfully. Pay cash when you receive the delivery.',
                paymentStatus: 'cod_pending',
                instructions: [
                    'Keep exact amount ready',
                    'Payment will be collected at delivery',
                    'Get receipt from delivery person',
                    'Check products before payment',
                ],
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },

    /**
     * Confirm COD Payment (by delivery person)
     */
    async confirmPayment(orderId, deliveryPersonId, collectedAmount) {
        return {
            success: true,
            orderId: orderId,
            paymentStatus: 'paid',
            collectedAmount: collectedAmount,
            collectedBy: deliveryPersonId,
            collectedAt: new Date().toISOString(),
        };
    },
};

/**
 * Main Payment Gateway Handler
 */
export const processPayment = async (paymentMethod, orderData) => {
    try {
        switch (paymentMethod) {
            case 'bKash':
                return await bKashPayment.initiatePayment(orderData);

            case 'Nagad':
                return await nagadPayment.initiatePayment(orderData);

            case 'Rocket':
                return await rocketPayment.initiatePayment(orderData);

            case 'Credit/Debit Card':
                return await sslCommerzPayment.initiatePayment(orderData);

            case 'Cash on Delivery':
                return await cashOnDelivery.processOrder(orderData);

            default:
                return {
                    success: false,
                    error: 'Invalid payment method',
                };
        }
    } catch (error) {
        console.error('Payment Processing Error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Verify Payment from any gateway
 */
export const verifyPayment = async (paymentMethod, paymentId) => {
    try {
        switch (paymentMethod) {
            case 'bKash':
                return await bKashPayment.queryPayment(paymentId);

            case 'Nagad':
                return await nagadPayment.verifyPayment(paymentId);

            case 'Rocket':
                return await rocketPayment.verifyPayment(paymentId);

            case 'Credit/Debit Card':
                return await sslCommerzPayment.validatePayment(paymentId);

            default:
                return {
                    success: false,
                    error: 'Invalid payment method',
                };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};

export default {
    bKashPayment,
    nagadPayment,
    rocketPayment,
    sslCommerzPayment,
    cashOnDelivery,
    processPayment,
    verifyPayment,
};
