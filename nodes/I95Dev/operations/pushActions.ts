import { IExecuteFunctions } from 'n8n-workflow';
import { I95DevCredentials, ApiResponse, ExecutionContext } from '../types/interfaces';
import {
	getBearerToken,
	getSchedulerId,
	createApiContext,
	getDataTypeFromOperation,
	parseJsonSafely,
	createSuccessResponse,
	createErrorResponse,
} from '../utils/apiHelper';

/**
 * Execute push data operations (Product, Customer, SalesOrder, Invoice, Shipment, Inventory)
 */
export async function executePushDataOperation(
	context: ExecutionContext,
	operation: string
): Promise<ApiResponse> {
	const { executeFunctions, itemIndex } = context;

	try {
		const credentials = await executeFunctions.getCredentials('i95DevApi') as I95DevCredentials;
		const dataType = getDataTypeFromOperation(operation);
		
		// Get parameters
		const packetSize = executeFunctions.getNodeParameter('packetSize', itemIndex) as number;
		const pushRequestDataString = executeFunctions.getNodeParameter('pushRequestData', itemIndex) as string;
		const pushType = executeFunctions.getNodeParameter('pushType', itemIndex) as string;
		
		const pushRequestData = parseJsonSafely(pushRequestDataString);

		// Step 1: Get Bearer Token
		const bearerToken = await getBearerToken(executeFunctions, credentials);

		// Step 2: Get Scheduler ID for PushData
		const schedulerId = await getSchedulerId(executeFunctions, credentials, bearerToken, 'PushData');

		// Step 3: Prepare request body
		const requestBody = {
			Context: createApiContext(credentials, schedulerId, 'PushData'),
			RequestData: pushRequestData,
			PacketSize: packetSize,
			type: pushType || null,
		};

		// Step 4: Call Push Data API
		const response = await executeFunctions.helpers.httpRequest({
			method: 'POST',
			url: `${credentials.baseUrl}/api/${dataType}/PushData`,
			headers: {
				'Authorization': `Bearer ${bearerToken}`,
				'Content-Type': 'application/json',
			},
			body: requestBody,
			json: true,
		});

		return createSuccessResponse(
			`i95Dev API - ${dataType} Data Pushed Successfully`,
			response,
			bearerToken,
			schedulerId,
			requestBody
		);

	} catch (apiError) {
		const dataType = getDataTypeFromOperation(operation);
		return createErrorResponse(
			`i95Dev API - Error pushing ${dataType} data`,
			(apiError as Error).message
		);
	}
}

/**
 * Check if operation is a push data operation
 */
export function isPushDataOperation(operation: string): boolean {
	return [
		'pushProductData',
		'pushCustomerData',
		'pushSalesOrderData',
		'pushInvoiceData',
		'pushShipmentData',
		'pushInventoryData'
	].includes(operation);
}