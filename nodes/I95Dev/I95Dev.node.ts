import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodeProperties,
	NodeConnectionType,
} from 'n8n-workflow';

// Import modular operations
import { executePullDataOperation, isPullDataOperation } from './operations/pullActions';
import { executePushDataOperation, isPushDataOperation } from './operations/pushActions';
import { executePullResponseOperation, isPullResponseOperation } from './operations/pullResponse';
import { executePushResponseOperation, isPushResponseOperation } from './operations/pushResponse';
import { executeBcAction, isBcAction } from './operations/bcActions';
import { ExecutionContext, ApiResponse } from './types/interfaces';

export class I95Dev implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'i95Dev',
		name: 'i95Dev',
		icon: 'file:i95dev.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with i95Dev API for eCommerce integration',
		defaults: {
			name: 'i95Dev',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'i95DevApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Environment Name',
				name: 'environment',
				type: 'string',
				default: 'N8N',
				required: false,
				description: 'Business Central environment name (e.g., N8N, Production, Sandbox)',
			},
			{
				displayName: 'Customer Data (JSON)',
				name: 'customerDataJson',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['createCustomer'],
						resource: ['bcactions'],
					},
				},
				default: '{\n  "displayName": "John Doe",\n  "type": "Person",\n  "email": "john.doe@example.com",\n  "phoneNumber": "+1-555-0123"\n}',
				description: 'Customer data in JSON format for creation',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'eCommerce',
						value: 'ecommerce',
					},
					{
						name: 'BC Actions',
						value: 'bcactions',
					},
				],
				default: 'ecommerce',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ecommerce'],
					},
				},
				options: [
					{
						name: 'Pull Product Data',
						value: 'pullProductData',
						action: 'Pull product data from i95Dev API',
					},
					{
						name: 'Pull Customer Data',
						value: 'pullCustomerData',
						action: 'Pull customer data from i95Dev API',
					},
					{
						name: 'Pull Sales Order Data',
						value: 'pullSalesOrderData',
						action: 'Pull sales order data from i95Dev API',
					},
					{
						name: 'Pull Invoice Data',
						value: 'pullInvoiceData',
						action: 'Pull invoice data from i95Dev API',
					},
					{
						name: 'Pull Shipment Data',
						value: 'pullShipmentData',
						action: 'Pull shipment data from i95Dev API',
					},
					{
						name: 'Pull Inventory Data',
						value: 'pullInventoryData',
						action: 'Pull inventory data from i95Dev API',
					},
					{
						name: 'Push Product Data',
						value: 'pushProductData',
						action: 'Push product data to i95Dev API',
					},
					{
						name: 'Push Customer Data',
						value: 'pushCustomerData',
						action: 'Push customer data to i95Dev API',
					},
					{
						name: 'Push Sales Order Data',
						value: 'pushSalesOrderData',
						action: 'Push sales order data to i95Dev API',
					},
					{
						name: 'Push Invoice Data',
						value: 'pushInvoiceData',
						action: 'Push invoice data to i95Dev API',
					},
					{
						name: 'Push Shipment Data',
						value: 'pushShipmentData',
						action: 'Push shipment data to i95Dev API',
					},
					{
						name: 'Push Inventory Data',
						value: 'pushInventoryData',
						action: 'Push inventory data to i95Dev API',
					},
					{
						name: 'Pull Product Response',
						value: 'pullProductResponse',
						action: 'Pull product response from message queue',
					},
					{
						name: 'Pull Customer Response',
						value: 'pullCustomerResponse',
						action: 'Pull customer response from message queue',
					},
					{
						name: 'Pull Sales Order Response',
						value: 'pullSalesOrderResponse',
						action: 'Pull sales order response from message queue',
					},
					{
						name: 'Pull Invoice Response',
						value: 'pullInvoiceResponse',
						action: 'Pull invoice response from message queue',
					},
					{
						name: 'Pull Shipment Response',
						value: 'pullShipmentResponse',
						action: 'Pull shipment response from message queue',
					},
					{
						name: 'Pull Inventory Response',
						value: 'pullInventoryResponse',
						action: 'Pull inventory response from message queue',
					},
					{
						name: 'Push Product Response',
						value: 'pushProductResponse',
						action: 'Push product response to message queue',
					},
					{
						name: 'Push Customer Response',
						value: 'pushCustomerResponse',
						action: 'Push customer response to message queue',
					},
					{
						name: 'Push Sales Order Response',
						value: 'pushSalesOrderResponse',
						action: 'Push sales order response to message queue',
					},
					{
						name: 'Push Invoice Response',
						value: 'pushInvoiceResponse',
						action: 'Push invoice response to message queue',
					},
					{
						name: 'Push Shipment Response',
						value: 'pushShipmentResponse',
						action: 'Push shipment response to message queue',
					},
					{
						name: 'Push Inventory Response',
						value: 'pushInventoryResponse',
						action: 'Push inventory response to message queue',
					},
				],
				default: 'pullProductData',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['bcactions'],
					},
				},
				options: [
					{
						name: 'Create Customer',
						value: 'createCustomer',
						action: 'Create customer in Business Central',
					},
				],
				default: 'createCustomer',
			},
			{
				displayName: 'Packet Size',
				name: 'packetSize',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['pullProductData', 'pullCustomerData', 'pullSalesOrderData', 'pullInvoiceData', 'pullShipmentData', 'pullInventoryData', 'pushProductData', 'pushCustomerData', 'pushSalesOrderData', 'pushInvoiceData', 'pushShipmentData', 'pushInventoryData', 'pullProductResponse', 'pullCustomerResponse', 'pullSalesOrderResponse', 'pullInvoiceResponse', 'pullShipmentResponse', 'pullInventoryResponse', 'pushProductResponse', 'pushCustomerResponse', 'pushSalesOrderResponse', 'pushInvoiceResponse', 'pushShipmentResponse', 'pushInventoryResponse'],
						resource: ['ecommerce'],
					},
				},
				default: 5,
				description: 'Number of records to pull/push in each packet',
			},
			{
				displayName: 'Request Data',
				name: 'requestData',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['pullProductData', 'pullCustomerData', 'pullSalesOrderData', 'pullInvoiceData', 'pullShipmentData', 'pullInventoryData'],
						resource: ['ecommerce'],
					},
				},
				default: '[]',
				description: 'Additional request data (JSON array)',
			},
			{
				displayName: 'Type',
				name: 'pullDataType',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['pullProductData', 'pullCustomerData', 'pullSalesOrderData', 'pullInvoiceData', 'pullShipmentData', 'pullInventoryData'],
						resource: ['ecommerce'],
					},
				},
				default: '',
				description: 'Optional type field for pull data operation',
			},
			{
				displayName: 'Request Data (JSON)',
				name: 'pushRequestData',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['pushProductData', 'pushCustomerData', 'pushSalesOrderData', 'pushInvoiceData', 'pushShipmentData', 'pushInventoryData'],
						resource: ['ecommerce'],
					},
				},
				default: '[{"TargetId":"C00180","SourceId":"16","MagentoId":null,"Reference":"16","MessageId":null,"Message":null,"Status":null,"InputData":"{\\"sourceId\\":\\"16\\",\\"targetCustomerId\\":\\"C00180\\"}"}]',
				description: 'Request data array for push operation (JSON format)',
			},
			{
				displayName: 'Type',
				name: 'pushType',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['pushProductData', 'pushCustomerData', 'pushSalesOrderData', 'pushInvoiceData', 'pushShipmentData', 'pushInventoryData'],
						resource: ['ecommerce'],
					},
				},
				default: '',
				placeholder: 'null or specific type',
				description: 'Optional type field for push operation',
			},
			{
				displayName: 'Request Data (JSON)',
				name: 'pullResponseRequestData',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['pullProductResponse', 'pullCustomerResponse', 'pullSalesOrderResponse', 'pullInvoiceResponse', 'pullShipmentResponse', 'pullInventoryResponse'],
						resource: ['ecommerce'],
					},
				},
				default: '[{"sourceId":"string","targetId":"string","reference":"string","message":"string","result":true,"inputData":"string","messageId":0,"statusId":0,"lastSyncTime":"2025-08-22T06:56:37.387Z"}]',
				description: 'Request data array for pull response operation (JSON format)',
			},
			{
				displayName: 'Type',
				name: 'pullResponseType',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['pullProductResponse', 'pullCustomerResponse', 'pullSalesOrderResponse', 'pullInvoiceResponse', 'pullShipmentResponse', 'pullInventoryResponse'],
						resource: ['ecommerce'],
					},
				},
				default: '',
				description: 'Optional type field for pull response operation',
			},
			{
				displayName: 'Request Data (JSON)',
				name: 'pushResponseRequestData',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['pushProductResponse', 'pushCustomerResponse', 'pushSalesOrderResponse', 'pushInvoiceResponse', 'pushShipmentResponse', 'pushInventoryResponse'],
						resource: ['ecommerce'],
					},
				},
				default: '[{"sourceId":"string","targetId":"string","reference":"string","message":"string","result":true,"inputData":"string","messageId":0,"statusId":0,"lastSyncTime":"2025-08-22T07:25:48.426Z"}]',
				description: 'Request data array for push response operation (JSON format)',
			},
			{
				displayName: 'Type',
				name: 'pushResponseType',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['pushProductResponse', 'pushCustomerResponse', 'pushSalesOrderResponse', 'pushInvoiceResponse', 'pushShipmentResponse', 'pushInventoryResponse'],
						resource: ['ecommerce'],
					},
				},
				default: '',
				description: 'Optional type field for push response operation',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: ApiResponse;

				// Create execution context
				const context: ExecutionContext = {
					executeFunctions: this,
					itemIndex: i,
				};

				// Route to appropriate operation handler based on resource and operation
				if (resource === 'ecommerce') {
					if (isPullDataOperation(operation)) {
						responseData = await executePullDataOperation(context, operation);
					} else if (isPushDataOperation(operation)) {
						responseData = await executePushDataOperation(context, operation);
					} else if (isPullResponseOperation(operation)) {
						responseData = await executePullResponseOperation(context, operation);
					} else if (isPushResponseOperation(operation)) {
						responseData = await executePushResponseOperation(context, operation);
					} else {
						responseData = {
							success: false,
							message: `Unknown eCommerce operation: ${operation}`,
							error: 'Invalid operation specified',
							timestamp: new Date().toISOString(),
						};
					}
				} else if (resource === 'bcactions') {
					if (isBcAction(operation)) {
						responseData = await executeBcAction(context, operation);
					} else {
						responseData = {
							success: false,
							message: `Unknown BC Action operation: ${operation}`,
							error: 'Invalid operation specified',
							timestamp: new Date().toISOString(),
						};
					}
				} else {
					responseData = {
						success: false,
						message: `Unknown resource: ${resource}`,
						error: 'Invalid resource specified',
						timestamp: new Date().toISOString(),
					};
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as any),
					{ itemData: { item: i } }
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } }
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

}
