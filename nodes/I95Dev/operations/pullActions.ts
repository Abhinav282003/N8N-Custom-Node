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
 * Execute pull data operations (Product, Customer, SalesOrder, Invoice, Shipment, Inventory)
 */
export async function executePullDataOperation(
	context: ExecutionContext,
	operation: string
): Promise<ApiResponse> {
	const { executeFunctions, itemIndex } = context;

	try {
		const credentials = await executeFunctions.getCredentials('i95DevApi') as I95DevCredentials;
		const dataType = getDataTypeFromOperation(operation);
		
		// Get parameters
		const packetSize = executeFunctions.getNodeParameter('packetSize', itemIndex) as number;
		const requestDataString = executeFunctions.getNodeParameter('requestData', itemIndex) as string;
		const pullDataType = executeFunctions.getNodeParameter('pullDataType', itemIndex) as string;
		
		const requestData = parseJsonSafely(requestDataString);

		// Step 1: Get Bearer Token
		const bearerToken = await getBearerToken(executeFunctions, credentials);

		// Step 2: Get Scheduler ID
		const schedulerId = await getSchedulerId(executeFunctions, credentials, bearerToken, 'PullData');

		// Step 3: Prepare request body
		const requestBody = {
			Context: createApiContext(credentials, schedulerId, 'PullData'),
			RequestData: requestData,
			PacketSize: packetSize,
			type: pullDataType || null,
		};

		// Step 4: Call Pull Data API
		const response = await executeFunctions.helpers.httpRequest({
			method: 'POST',
			url: `${credentials.baseUrl}/api/${dataType}/PullData`,
			headers: {
				'Authorization': `Bearer ${bearerToken}`,
				'Content-Type': 'application/json',
			},
			body: requestBody,
			json: true,
		});

		return createSuccessResponse(
			`i95Dev API - ${dataType} Data Pulled Successfully`,
			response,
			bearerToken,
			schedulerId,
			requestBody
		);

	} catch (apiError) {
		const dataType = getDataTypeFromOperation(operation);
		return createErrorResponse(
			`i95Dev API - Error pulling ${dataType} data`,
			(apiError as Error).message
		);
	}
}

/**
 * Check if operation is a pull data operation
 */
export function isPullDataOperation(operation: string): boolean {
	return [
		'pullProductData',
		'pullCustomerData', 
		'pullSalesOrderData',
		'pullInvoiceData',
		'pullShipmentData',
		'pullInventoryData'
	].includes(operation);
}