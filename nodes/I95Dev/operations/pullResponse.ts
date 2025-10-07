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
 * Execute pull response operations (Product, Customer, SalesOrder, Invoice, Shipment, Inventory)
 */
export async function executePullResponseOperation(
	context: ExecutionContext,
	operation: string
): Promise<ApiResponse> {
	const { executeFunctions, itemIndex } = context;

	try {
		const credentials = await executeFunctions.getCredentials('i95DevApi') as I95DevCredentials;
		const dataType = getDataTypeFromOperation(operation);
		
		// Get parameters
		const packetSize = executeFunctions.getNodeParameter('packetSize', itemIndex) as number;
		const pullResponseRequestDataString = executeFunctions.getNodeParameter('pullResponseRequestData', itemIndex) as string;
		const pullResponseType = executeFunctions.getNodeParameter('pullResponseType', itemIndex) as string;
		
		const pullResponseRequestData = parseJsonSafely(pullResponseRequestDataString);

		// Step 1: Get Bearer Token
		const bearerToken = await getBearerToken(executeFunctions, credentials);

		// Step 2: Get Scheduler ID
		const schedulerId = await getSchedulerId(executeFunctions, credentials, bearerToken, 'PullData');

		// Step 3: Prepare request body
		const requestBody = {
			Context: createApiContext(credentials, schedulerId, 'PullData'),
			RequestData: pullResponseRequestData,
			PacketSize: packetSize,
			type: pullResponseType || null,
		};

		// Step 4: Call Pull Response API (using PullData endpoint)
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
			`i95Dev API - ${dataType} Response Pulled Successfully`,
			response,
			bearerToken,
			schedulerId,
			requestBody
		);

	} catch (apiError) {
		const dataType = getDataTypeFromOperation(operation);
		return createErrorResponse(
			`i95Dev API - Error pulling ${dataType} response`,
			(apiError as Error).message
		);
	}
}

/**
 * Check if operation is a pull response operation
 */
export function isPullResponseOperation(operation: string): boolean {
	return [
		'pullProductResponse',
		'pullCustomerResponse',
		'pullSalesOrderResponse',
		'pullInvoiceResponse',
		'pullShipmentResponse',
		'pullInventoryResponse'
	].includes(operation);
}