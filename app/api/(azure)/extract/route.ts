import axios from 'axios';
import { createResponse } from '@/app/lib/prismaUtils';
import { NextResponse } from 'next/server';

async function checkAnalysisStatus(endpoint: string, modelId: string, requestId: string, apiVersion: string, subscriptionKey: string) {
    console.time(`Checking analysis status for requestId: ${requestId}`);
    const statusURL = `${endpoint}/documentintelligence/documentModels/${modelId}/analyzeResults/${requestId}?api-version=${apiVersion}`;
    
    try {
        const response = await axios.get(statusURL, {
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
            },
        });
        console.timeEnd(`Checking analysis status for requestId: ${requestId}`);
        return response.data;
    } catch (error) {
        console.timeEnd(`Checking analysis status for requestId: ${requestId}`);
        console.error('Failed to check analysis status:', error);
        throw new Error('Failed to check analysis status.');
    }
}

async function waitForCompletion(endpoint: string, modelId: string, requestId: string, apiVersion: string, subscriptionKey: string) {
    console.time(`Waiting for analysis completion for requestId: ${requestId}`);
    let result = await checkAnalysisStatus(endpoint, modelId, requestId, apiVersion, subscriptionKey);

    while (result.status && result.status !== 'succeeded') {
        await new Promise(resolve => setTimeout(resolve, 5000));
        result = await checkAnalysisStatus(endpoint, modelId, requestId, apiVersion, subscriptionKey);
    }
    console.timeEnd(`Waiting for analysis completion for requestId: ${requestId}`);
    console.log('Analysis completed:', result.analyzeResult.documents);

    return result.analyzeResult.documents;
}

export async function POST(req: Request, res: NextResponse): Promise<NextResponse> {
    console.time('Total POST request processing time');

    const { searchParams } = new URL(req.url);
    const { documentURL } = await req.json();
    const modelId = searchParams.get('model-id');
    const apiVersion = searchParams.get('api-version');

    if (!modelId || !apiVersion) {
        console.log('Invalid or missing query parameters');
        console.timeEnd('Total POST request processing time');
        return createResponse(400, 'Invalid or missing query parameters.');
    }

    const endpoint = "https://testdupw.cognitiveservices.azure.com";
    const analyzeURL = `${endpoint}/documentintelligence/documentModels/${modelId}:analyze?api-version=${apiVersion}`;

    try {
        console.time('Posting to analyzeURL');
        const analyzeResponse = await axios.post(analyzeURL, {urlSource: documentURL}, {
            headers: { 
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.COGNITIVE_SERVICES_SUBSCRIPTION_KEY,
            }
        });
        console.timeEnd('Posting to analyzeURL');

        console.log('analyzeResponse received');

        const requestId = analyzeResponse.headers['apim-request-id'];

        if (!requestId) {
            console.log('Request ID not found in the response.');
            console.timeEnd('Total POST request processing time');
            return createResponse(500, 'Request ID not found in the response.');
        }

        const finalResult = await waitForCompletion(endpoint, modelId, requestId, apiVersion, process.env.COGNITIVE_SERVICES_SUBSCRIPTION_KEY ?? '');
        
        console.timeEnd('Total POST request processing time');
        return createResponse(200, finalResult);
    } catch (error) {
        console.error('Error during document analysis:', error);
        console.timeEnd('Total POST request processing time');
        return createResponse(500, 'Failed to analyze document.');
    }
}
