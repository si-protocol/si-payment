import service from './axios';
import Qs from 'qs';
class Server {
    static meta = {
        baseUrl: process.env.BACKEND_URL
    };

    static getOrderInfo = async (orderId: string, options: Record<string, any> = {}): Promise<any> => {
        return await service.get(`${this.meta.baseUrl}/order/${orderId}`, options);
    };

    static getDepositInfo = async (orderId: string, options: Record<string, any> = {}): Promise<any> => {
        return await service.get(`${this.meta.baseUrl}/user-deposit/${orderId}`, options);
    };

    static tokens = async (tokenId: string, options: Record<string, any> = {}): Promise<any> => {
        return await service.get(`${this.meta.baseUrl}/token/${tokenId}`, options);
    };

    static payHandle = async (params: Record<string, any> = {}, options: Record<string, any> = {}): Promise<any> => {
        return await service.get(`${this.meta.baseUrl}/transaction/pay-handle`, { params, ...options });
    };

    static cancelOrderPay = async (data: Record<string, any> = {}, options: Record<string, any> = {}): Promise<any> => {
        return await service.post(`${this.meta.baseUrl}/order/cancelPay`, data, options);
    };
    static cancelDepositPay = async (data: Record<string, any> = {}, options: Record<string, any> = {}): Promise<any> => {
        return await service.post(`${this.meta.baseUrl}/user-deposit/cancel`, data, options);
    };

    static payTransaction = async (orderId: string, data: Record<string, any> = {}, options: Record<string, any> = {}): Promise<any> => {
        const str = Qs.stringify({ orderId, ...data });
        // return await service.post(`${this.meta.baseUrl}/transaction/pay-transaction/?orderId=${orderId}`, data, options);
        return await service.post(`${this.meta.baseUrl}/transaction/pay-transaction/?${str}`, data, options);
    };

    static buildTransactionRequestEndpoint = (params: { [key: string]: any }): string => {
        // return `${this.meta.baseUrl}/transaction/pay-transaction/?orderId=${orderId}`;
        const str = Qs.stringify(params);
        console.log('str', str);
        return `https://api-dev.si.online/transaction/pay-transaction/?${str}`;
    };
}

export default Server;
