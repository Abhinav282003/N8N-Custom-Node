import { IExecuteFunctions } from 'n8n-workflow';
import { I95DevCredentials, ApiResponse, ExecutionContext } from '../types/interfaces';
import { createErrorResponse } from '../utils/apiHelper';

/**
 * Execute Business Central operations (Create Customer)
 */
export async function executeBcAction(
	context: ExecutionContext,
	operation: string
): Promise<ApiResponse> {
	const { executeFunctions, itemIndex } = context;

	if (operation === 'createCustomer') {
		return await executeCreateCustomer(context);
	}

	return createErrorResponse(
		`Unknown BC Action operation: ${operation}`,
		'Invalid operation specified'
	);
}

/**
 * Execute Create Customer operation in Business Central
 */
async function executeCreateCustomer(context: ExecutionContext): Promise<ApiResponse> {
	const { executeFunctions, itemIndex } = context;

	try {
		// Get Business Central credentials
		const credentials = await executeFunctions.getCredentials('i95DevApi') as I95DevCredentials;
		const tenantId = credentials.tenantId;
		const clientId = credentials.clientIdBC;
		const clientSecret = credentials.clientSecretBC;

		if (!tenantId || !clientId || !clientSecret) {
			throw new Error('Business Central credentials (Tenant ID, Client ID BC, Client Secret BC) are required');
		}

		// Get OAuth token for Business Central
		const tokenRequestBody = new URLSearchParams({
			grant_type: 'client_credentials',
			client_id: String(clientId),
			client_secret: String(clientSecret),
			scope: 'https://api.businesscentral.dynamics.com/.default'
		});

		const tokenResponse = await executeFunctions.helpers.httpRequest({
			method: 'POST',
			url: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: tokenRequestBody.toString(),
			json: false,
		});

		let bcAccessToken;
		try {
			const tokenData = typeof tokenResponse === 'string' ? JSON.parse(tokenResponse) : tokenResponse;
			bcAccessToken = tokenData.access_token;
		} catch (parseError) {
			throw new Error(`Failed to parse token response: ${(parseError as Error).message}`);
		}

		if (!bcAccessToken) {
			throw new Error('Failed to obtain access token from Microsoft OAuth endpoint');
		}

		// Get Business Central environment and companies
		const environment = credentials.environment || 'N8N';
		const bcApiUrl = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/api/v2.0/companies`;

		const companiesResponse = await executeFunctions.helpers.httpRequest({
			method: 'GET',
			url: bcApiUrl,
			headers: {
				'Authorization': `Bearer ${bcAccessToken}`,
				'Content-Type': 'application/json',
			},
			json: true,
		});

		const companies = companiesResponse.value || companiesResponse;
		const firstCompany = companies[0];
		const companyId = firstCompany ? firstCompany.id : null;

		if (!companyId) {
			throw new Error('No company found to create customer in');
		}

		// Get customer data from JSON input
		const customerDataString = executeFunctions.getNodeParameter('customerDataJson', itemIndex) as string;
		let customerData;
		try {
			customerData = JSON.parse(customerDataString);
		} catch (parseError) {
			throw new Error(`Invalid JSON in customer data: ${(parseError as Error).message}`);
		}

		// Create customer using the company ID
		const createCustomerUrl = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/api/v2.0/companies(${companyId})/customers`;
		
		const customerResponse = await executeFunctions.helpers.httpRequest({
			method: 'POST',
			url: createCustomerUrl,
			headers: {
				'Authorization': `Bearer ${bcAccessToken}`,
				'Content-Type': 'application/json',
			},
			body: customerData,
			json: true,
		});

		return {
			success: true,
			message: 'Customer created successfully',
			apiResponse: {
				customer: customerResponse,
				companyId: companyId,
				companyName: firstCompany.name,
			},
			timestamp: new Date().toISOString(),
		};

	} catch (apiError) {
		return createErrorResponse(
			'Failed to create customer in Business Central',
			(apiError as Error).message
		);
	}
}

/**
 * Check if operation is a Business Central action
 */
export function isBcAction(operation: string): boolean {
	return ['createCustomer'].includes(operation);
}