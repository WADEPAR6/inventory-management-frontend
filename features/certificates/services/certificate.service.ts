import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { ICertificate, PaginatedCertificates } from '../data/interfaces/certificate.interface';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

interface CertificateServiceProps {
    getCertificates: (page?: number, limit?: number) => Promise<PaginatedCertificates>;
    getCertificateById: (id: string) => Promise<ICertificate | undefined>;
    createCertificate: (certificate: Partial<ICertificate>) => Promise<ICertificate | undefined>;
    updateCertificate: (id: string, certificate: Partial<ICertificate>) => Promise<ICertificate | undefined>;
    deleteCertificate: (id: string) => Promise<void>;
}

export class CertificateService implements CertificateServiceProps {
    private static instance: CertificateService;
    private httpClient: HttpHandler;
    private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}certificates`;

    private constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    public static getInstance(): CertificateService {
        if (!CertificateService.instance) {
            CertificateService.instance = new CertificateService();
        }
        return CertificateService.instance;
    }

    public async getCertificates(page = 1, limit = 10): Promise<PaginatedCertificates> {
        try {
            const response = await this.httpClient.get<PaginatedCertificates>(
                `${CertificateService.url}?page=${page}&limit=${limit}`
            );
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message.content.join(', '));
        } catch (error) {
            console.error('Error fetching certificates:', error);
            throw error;
        }
    }

    public async getCertificateById(id: string): Promise<ICertificate> {
        try {
            const response = await this.httpClient.get<ICertificate>(
                `${CertificateService.url}/${id}`
            );
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message.content.join(', ') || 'Certificado no encontrado');
        } catch (error: any) {
            console.error('Error fetching certificate:', error);
            throw new Error(error.message || 'Error al cargar el certificado');
        }
    }

    public async createCertificate(certificate: Partial<ICertificate>): Promise<ICertificate> {
        try {
            const response = await this.httpClient.post<ICertificate>(
                CertificateService.url,
                certificate
            );
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message.content.join(', '));
        } catch (error: any) {
            console.error('Error creating certificate:', error);
            throw new Error(error.message || 'Error al crear el certificado');
        }
    }

    public async updateCertificate(id: string, certificate: Partial<ICertificate>): Promise<ICertificate> {
        try {
            const response = await this.httpClient.patch<ICertificate>(
                `${CertificateService.url}/${id}`,
                certificate
            );
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message.content.join(', '));
        } catch (error: any) {
            console.error('Error updating certificate:', error);
            if (error.response?.status === 404) {
                throw new Error('Certificado no encontrado');
            }
            throw new Error(error.message || 'Error al actualizar el certificado');
        }
    }

    public async deleteCertificate(id: string): Promise<void> {
        try {
            const response = await this.httpClient.delete<void>(
                `${CertificateService.url}/${id}`
            );
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
        } catch (error) {
            console.error('Error deleting certificate:', error);
            throw error;
        }
    }
}

export const certificateService = CertificateService.getInstance(); 