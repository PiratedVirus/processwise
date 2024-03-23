import axios from 'axios';
import { createResponse } from '@/app/lib/utils/prismaUtils';
import { NextResponse } from 'next/server';

async function checkAnalysisStatus(endpoint: string, modelId: string, requestId: string, apiVersion: string, subscriptionKey: string) {
    const statusURL = `${endpoint}/documentintelligence/documentModels/${modelId}/analyzeResults/${requestId}?api-version=${apiVersion}`;
    
    try {
        const response = await axios.get(statusURL, {
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to check analysis status:', error);
        throw new Error('Failed to check analysis status.');
    }
}

async function waitForCompletion(endpoint: string, modelId: string, requestId: string, apiVersion: string, subscriptionKey: string) {
    let result = await checkAnalysisStatus(endpoint, modelId, requestId, apiVersion, subscriptionKey);

    while (result.status && result.status !== 'succeeded') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        result = await checkAnalysisStatus(endpoint, modelId, requestId, apiVersion, subscriptionKey);
    }
    console.log('Analysis completed:', result.analyzeResult.documents);

    return result.analyzeResult.documents;
}

export async function POST(req: Request, res: NextResponse): Promise<NextResponse> {

    const { searchParams } = new URL(req.url);
    const { documentURL } = await req.json();
    const modelId = searchParams.get('model-id');
    const apiVersion = searchParams.get('api-version');

    if (!modelId || !apiVersion) {
        console.log('Invalid or missing query parameters');
        return createResponse(400, 'Invalid or missing query parameters.');
    }

    const endpoint = "https://testdupw.cognitiveservices.azure.com";
    const analyzeURL = `${endpoint}/documentintelligence/documentModels/${modelId}:analyze?api-version=${apiVersion}`;
    console.log('analyzeURL:', analyzeURL, "documentURL:", documentURL);
    try {
        const analyzeResponse = await axios.post(analyzeURL, {urlSource: documentURL}, {
            headers: { 
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.COGNITIVE_SERVICES_SUBSCRIPTION_KEY,
            }
        });

        console.log('analyzeResponse received');

        const requestId = analyzeResponse.headers['apim-request-id'];

        if (!requestId) {
            console.log('Request ID not found in the response.');
            return createResponse(500, 'Request ID not found in the response.');
        }

        const finalResult = await waitForCompletion(endpoint, modelId, requestId, apiVersion, process.env.COGNITIVE_SERVICES_SUBSCRIPTION_KEY ?? '');
        
        return createResponse(200, finalResult);
    } catch (error) {
        console.error('Error during document analysis:', error);
        return createResponse(500, 'Failed to analyze document.');
    }
}
