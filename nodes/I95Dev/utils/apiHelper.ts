import { IExecuteFunctions } from 'n8n-workflow';
import { I95DevCredentials, ApiContext, ApiResponse } from '../types/interfaces';

/**
 * Get Bearer Token using Refresh Token
 */
export async function getBearerToken(
	executeFunctions: IExecuteFunctions, 
	credentials: I95DevCredentials
): Promise<string> {
	const tokenResponse = await executeFunctions.helpers.httpRequest({
		method: 'POST',
		url: `${credentials.baseUrl}/api/client/Token`,
		headers: {
			'Content-Type': 'application/json',
		},
		body: {
			refreshToken: credentials.refreshToken,
		},
		json: true,
	});

	return tokenResponse.accessToken.token;
}

/**
 * Get Scheduler ID for API operations
 */
export async function getSchedulerId(
	executeFunctions: IExecuteFunctions,
	credentials: I95DevCredentials,
	bearerToken: string,
	schedulerType: 'PullData' | 'PushData'
): Promise<string> {
	const schedulerResponse = await executeFunctions.helpers.httpRequest({
		method: 'POST',
		url: `${credentials.baseUrl}/api/Index`,
		headers: {
			'Authorization': `Bearer ${bearerToken}`,
			'Content-Type': 'application/json',
		},
		body: {
			context: {
				clientId: credentials.clientId,
				subscriptionKey: credentials.subscriptionKey,
				instanceType: credentials.instanceType,
				schedulerType: schedulerType,
				requestType: 'Source',
				endpointCode: credentials.endpointCode,
			},
		},
		json: true,
	});

	return schedulerResponse.schedulerId;
}

/**
 * Create API Context object
 */
export function createApiContext(
	credentials: I95DevCredentials,
	schedulerId: string,
	schedulerType: 'PullData' | 'PushData'
) {
	return {
		ClientId: credentials.clientId,
		SubscriptionKey: credentials.subscriptionKey,
		InstanceType: credentials.instanceType,
		EndpointCode: credentials.endpointCode,
		isNotEncrypted: true,
		SchedulerType: schedulerType,
		RequestType: 'Source',
		SchedulerId: schedulerId,
	};
}

/**
 * Get data type based on operation
 */
export function getDataTypeFromOperation(operation: string): string {
	const operationMap: { [key: string]: string } = {
		'pullProductData': 'Product',
		'pullCustomerData': 'Customer',
		'pullSalesOrderData': 'SalesOrder',
		'pullInvoiceData': 'Invoice',
		'pullShipmentData': 'Shipment',
		'pullInventoryData': 'Inventory',
		'pushProductData': 'Product',
		'pushCustomerData': 'Customer',
		'pushSalesOrderData': 'SalesOrder',
		'pushInvoiceData': 'Invoice',
		'pushShipmentData': 'Shipment',
		'pushInventoryData': 'Inventory',
		'pullProductResponse': 'Product',
		'pullCustomerResponse': 'Customer',
		'pullSalesOrderResponse': 'SalesOrder',
		'pullInvoiceResponse': 'Invoice',
		'pullShipmentResponse': 'Shipment',
		'pullInventoryResponse': 'Inventory',
		'pushProductResponse': 'Product',
		'pushCustomerResponse': 'Customer',
		'pushSalesOrderResponse': 'SalesOrder',
		'pushInvoiceResponse': 'Invoice',
		'pushShipmentResponse': 'Shipment',
		'pushInventoryResponse': 'Inventory',
	};

	return operationMap[operation] || 'Unknown';
}

/**
 * Parse JSON string safely
 */
export function parseJsonSafely(jsonString: string, fallback: any[] = []): any[] {
	try {
		return JSON.parse(jsonString);
	} catch (error) {
		return fallback;
	}
}

/**
 * Create success response
 */
export function createSuccessResponse(
	message: string,
	apiResponse: any,
	bearerToken: string,
	schedulerId: string,
	requestBody: any
): ApiResponse {
	return {
		success: true,
		message,
		apiResponse,
		bearerToken: bearerToken.substring(0, 20) + '...', // Show partial token for debugging
		schedulerId,
		requestBody,
		timestamp: new Date().toISOString(),
	};
}

/**
 * Create error response
 */
export function createErrorResponse(message: string, error: string): ApiResponse {
	return {
		success: false,
		message,
		error,
		timestamp: new Date().toISOString(),
	};
}