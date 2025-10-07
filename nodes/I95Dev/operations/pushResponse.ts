import { IExecuteFunctions } from 'n8n-workflow';
import { I95DevCredentials, ApiResponse, ExecutionContext } from '../types/interfaces';
import {
	getBearerToken,
	getSchedulerId,
	getDataTypeFromOperation,
	parseJsonSafely,
	createSuccessResponse,
	createErrorResponse,
} from '../utils/apiHelper';

/**
 * Execute push response operations (Product, Customer, SalesOrder, Invoice, Shipment, Inventory)
 */
export async function executePushResponseOperation(
	context: ExecutionContext,
	operation: string
): Promise<ApiResponse> {
	const { executeFunctions, itemIndex } = context;

	try {
		const credentials = await executeFunctions.getCredentials('i95DevApi') as I95DevCredentials;
		const dataType = getDataTypeFromOperation(operation);
		
		// Get parameters
		const packetSize = executeFunctions.getNodeParameter('packetSize', itemIndex) as number;
		const pushResponseRequestDataString = executeFunctions.getNodeParameter('pushResponseRequestData', itemIndex) as string;
		const pushResponseType = executeFunctions.getNodeParameter('pushResponseType', itemIndex) as string;
		
		const pushResponseRequestData = parseJsonSafely(pushResponseRequestDataString);

		// Step 1: Get Bearer Token
		const bearerToken = await getBearerToken(executeFunctions, credentials);

		// Step 2: Get Scheduler ID
		const schedulerId = await getSchedulerId(executeFunctions, credentials, bearerToken, 'PushData');

		// Step 3: Prepare request body (different format for push response)
		const requestBody = {
			context: {
				clientId: credentials.clientId,
				subscriptionKey: credentials.subscriptionKey,
				instanceType: credentials.instanceType,
				schedulerType: 'PushData',
				endPointCode: credentials.endpointCode,
				schedulerId: schedulerId,
				isNotEncrypted: true,
			},
			packetSize: packetSize,
			requestData: pushResponseRequestData,
		};

		// Step 4: Call Push Response API
		const response = await executeFunctions.helpers.httpRequest({
			method: 'POST',
			url: `${credentials.baseUrl}/api/${dataType}/PushResponse`,
			headers: {
				'Authorization': `Bearer ${bearerToken}`,
				'Content-Type': 'application/json',
			},
			body: requestBody,
			json: true,
		});

		return createSuccessResponse(
			`i95Dev API - ${dataType} Response Pushed Successfully`,
			response,
			bearerToken,
			schedulerId,
			requestBody
		);

	} catch (apiError) {
		const dataType = getDataTypeFromOperation(operation);
		return createErrorResponse(
			`i95Dev API - Error pushing ${dataType} response`,
			(apiError as Error).message
		);
	}
}

/**
 * Check if operation is a push response operation
 */
export function isPushResponseOperation(operation: string): boolean {
	return [
		'pushProductResponse',
		'pushCustomerResponse',
		'pushSalesOrderResponse',
		'pushInvoiceResponse',
		'pushShipmentResponse',
		'pushInventoryResponse'
	].includes(operation);
}