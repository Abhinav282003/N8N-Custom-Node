import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodeProperties,
	NodeConnectionType,
} from 'n8n-workflow';

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
				let responseData: any = {};

				if (resource === 'ecommerce') {
					if (['pullProductData', 'pullCustomerData', 'pullSalesOrderData', 'pullInvoiceData', 'pullShipmentData', 'pullInventoryData'].includes(operation)) {
						// Determine data type based on operation
						let dataType = '';
						switch (operation) {
							case 'pullProductData': dataType = 'Product'; break;
							case 'pullCustomerData': dataType = 'Customer'; break;
							case 'pullSalesOrderData': dataType = 'SalesOrder'; break;
							case 'pullInvoiceData': dataType = 'Invoice'; break;
							case 'pullShipmentData': dataType = 'Shipment'; break;
							case 'pullInventoryData': dataType = 'Inventory'; break;
						}

						// Execute pull data operation inline
						const credentials = await this.getCredentials('i95DevApi');
						const packetSize = this.getNodeParameter('packetSize', i) as number;
						const requestDataString = this.getNodeParameter('requestData', i) as string;
						const pullDataType = this.getNodeParameter('pullDataType', i) as string;
						
						let requestData = [];
						try {
							requestData = JSON.parse(requestDataString);
						} catch (error) {
							requestData = [];
						}

						try {
							// Step 1: Get Bearer Token using Refresh Token
							const tokenResponse = await this.helpers.httpRequest({
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

							const bearerToken = tokenResponse.accessToken.token;

							// Step 2: Get Scheduler ID
							const schedulerResponse = await this.helpers.httpRequest({
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
										schedulerType: 'PullData',
										requestType: 'Source',
										endpointCode: credentials.endpointCode,
									},
								},
								json: true,
							});

							const schedulerId = schedulerResponse.schedulerId;

							// Step 3: Call Pull Data API
							const requestBody = {
								Context: {
									ClientId: credentials.clientId,
									SubscriptionKey: credentials.subscriptionKey,
									InstanceType: credentials.instanceType,
									EndpointCode: credentials.endpointCode,
									isNotEncrypted: true,
									SchedulerType: 'PullData',
									RequestType: 'Source',
									SchedulerId: schedulerId,
								},
								RequestData: requestData,
								PacketSize: packetSize,
								type: pullDataType || null,
							};

							const response = await this.helpers.httpRequest({
								method: 'POST',
								url: `${credentials.baseUrl}/api/${dataType}/PullData`,
								headers: {
									'Authorization': `Bearer ${bearerToken}`,
									'Content-Type': 'application/json',
								},
								body: requestBody,
								json: true,
							});

							responseData = {
								success: true,
								message: `i95Dev API - ${dataType} Data Pulled Successfully`,
								apiResponse: response,
								bearerToken: bearerToken.substring(0, 20) + '...', // Show partial token for debugging
								schedulerId: schedulerId,
								requestBody,
								timestamp: new Date().toISOString(),
							};
						} catch (apiError) {
							responseData = {
								success: false,
								message: `i95Dev API - Error pulling ${dataType} data`,
								error: (apiError as Error).message,
								timestamp: new Date().toISOString(),
							};
						}
					} else if (['pushProductData', 'pushCustomerData', 'pushSalesOrderData', 'pushInvoiceData', 'pushShipmentData', 'pushInventoryData'].includes(operation)) {
						// Determine data type based on operation
						let dataType = '';
						switch (operation) {
							case 'pushProductData': dataType = 'Product'; break;
							case 'pushCustomerData': dataType = 'Customer'; break;
							case 'pushSalesOrderData': dataType = 'SalesOrder'; break;
							case 'pushInvoiceData': dataType = 'Invoice'; break;
							case 'pushShipmentData': dataType = 'Shipment'; break;
							case 'pushInventoryData': dataType = 'Inventory'; break;
						}

						// Execute push data operation inline
						const credentials = await this.getCredentials('i95DevApi');
						const packetSize = this.getNodeParameter('packetSize', i) as number;
						const pushRequestDataString = this.getNodeParameter('pushRequestData', i) as string;
						const pushType = this.getNodeParameter('pushType', i) as string;

						let pushRequestData = [];
						try {
							pushRequestData = JSON.parse(pushRequestDataString);
						} catch (error) {
							pushRequestData = [];
						}

						try {
							// Step 1: Get Bearer Token using Refresh Token
							const tokenResponse = await this.helpers.httpRequest({
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

							const bearerToken = tokenResponse.accessToken.token;

							// Step 2: Get Scheduler ID for PushData
							const schedulerResponse = await this.helpers.httpRequest({
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
										schedulerType: 'PushData',
										requestType: 'Source',
										endpointCode: credentials.endpointCode,
									},
								},
								json: true,
							});

							const schedulerId = schedulerResponse.schedulerId;

							// Step 3: Call Push Product Data API
							const requestBody = {
								Context: {
									ClientId: credentials.clientId,
									SubscriptionKey: credentials.subscriptionKey,
									InstanceType: credentials.instanceType,
									EndpointCode: credentials.endpointCode,
									isNotEncrypted: true,
									SchedulerType: 'PushData',
									RequestType: 'Source',
									SchedulerId: schedulerId,
								},
								RequestData: pushRequestData,
								PacketSize: packetSize,
								type: pushType || null,
							};

							const response = await this.helpers.httpRequest({
								method: 'POST',
								url: `${credentials.baseUrl}/api/${dataType}/PushData`,
								headers: {
									'Authorization': `Bearer ${bearerToken}`,
									'Content-Type': 'application/json',
								},
								body: requestBody,
								json: true,
							});

							responseData = {
								success: true,
								message: `i95Dev API - ${dataType} Data Pushed Successfully`,
								apiResponse: response,
								bearerToken: bearerToken.substring(0, 20) + '...', // Show partial token for debugging
								schedulerId: schedulerId,
								requestBody,
								timestamp: new Date().toISOString(),
							};
						} catch (apiError) {
							responseData = {
								success: false,
								message: `i95Dev API - Error pushing ${dataType} data`,
								error: (apiError as Error).message,
								timestamp: new Date().toISOString(),
							};
						}
					} else if (['pullProductResponse', 'pullCustomerResponse', 'pullSalesOrderResponse', 'pullInvoiceResponse', 'pullShipmentResponse', 'pullInventoryResponse'].includes(operation)) {
						// Determine data type based on operation
						let dataType = '';
						switch (operation) {
							case 'pullProductResponse': dataType = 'Product'; break;
							case 'pullCustomerResponse': dataType = 'Customer'; break;
							case 'pullSalesOrderResponse': dataType = 'SalesOrder'; break;
							case 'pullInvoiceResponse': dataType = 'Invoice'; break;
							case 'pullShipmentResponse': dataType = 'Shipment'; break;
							case 'pullInventoryResponse': dataType = 'Inventory'; break;
						}

						// Execute pull response operation inline
						const credentials = await this.getCredentials('i95DevApi');
						const packetSize = this.getNodeParameter('packetSize', i) as number;
						const pullResponseRequestDataString = this.getNodeParameter('pullResponseRequestData', i) as string;
						const pullResponseType = this.getNodeParameter('pullResponseType', i) as string;

						let pullResponseRequestData = [];
						try {
							pullResponseRequestData = JSON.parse(pullResponseRequestDataString);
						} catch (error) {
							pullResponseRequestData = [];
						}

						try {
							// Step 1: Get Bearer Token using Refresh Token
							const tokenResponse = await this.helpers.httpRequest({
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

							const bearerToken = tokenResponse.accessToken.token;

							// Step 2: Get Scheduler ID
							const schedulerResponse = await this.helpers.httpRequest({
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
										schedulerType: 'PullData',
										requestType: 'Source',
										endpointCode: credentials.endpointCode,
									},
								},
								json: true,
							});

							const schedulerId = schedulerResponse.schedulerId;

							// Step 3: Call Pull Response API
							const requestBody = {
								Context: {
									ClientId: credentials.clientId,
									SubscriptionKey: credentials.subscriptionKey,
									InstanceType: credentials.instanceType,
									EndpointCode: credentials.endpointCode,
									isNotEncrypted: true,
									SchedulerType: 'PullData',
									RequestType: 'Source',
									SchedulerId: schedulerId,
								},
								RequestData: pullResponseRequestData,
								PacketSize: packetSize,
								type: pullResponseType || null,
							};

							const response = await this.helpers.httpRequest({
								method: 'POST',
								url: `${credentials.baseUrl}/api/${dataType}/PullData`,
								headers: {
									'Authorization': `Bearer ${bearerToken}`,
									'Content-Type': 'application/json',
								},
								body: requestBody,
								json: true,
							});

							responseData = {
								success: true,
								message: `i95Dev API - ${dataType} Response Pulled Successfully`,
								apiResponse: response,
								bearerToken: bearerToken.substring(0, 20) + '...', // Show partial token for debugging
								schedulerId: schedulerId,
								requestBody,
								timestamp: new Date().toISOString(),
							};
						} catch (apiError) {
							responseData = {
								success: false,
								message: `i95Dev API - Error pulling ${dataType} response`,
								error: (apiError as Error).message,
								timestamp: new Date().toISOString(),
							};
						}
					} else if (['pushProductResponse', 'pushCustomerResponse', 'pushSalesOrderResponse', 'pushInvoiceResponse', 'pushShipmentResponse', 'pushInventoryResponse'].includes(operation)) {
						// Determine data type based on operation
						let dataType = '';
						switch (operation) {
							case 'pushProductResponse': dataType = 'Product'; break;
							case 'pushCustomerResponse': dataType = 'Customer'; break;
							case 'pushSalesOrderResponse': dataType = 'SalesOrder'; break;
							case 'pushInvoiceResponse': dataType = 'Invoice'; break;
							case 'pushShipmentResponse': dataType = 'Shipment'; break;
							case 'pushInventoryResponse': dataType = 'Inventory'; break;
						}

						// Execute push response operation inline
						const credentials = await this.getCredentials('i95DevApi');
						const packetSize = this.getNodeParameter('packetSize', i) as number;
						const pushResponseRequestDataString = this.getNodeParameter('pushResponseRequestData', i) as string;
						const pushResponseType = this.getNodeParameter('pushResponseType', i) as string;

						let pushResponseRequestData = [];
						try {
							pushResponseRequestData = JSON.parse(pushResponseRequestDataString);
						} catch (error) {
							pushResponseRequestData = [];
						}

						try {
							// Step 1: Get Bearer Token using Refresh Token
							const tokenResponse = await this.helpers.httpRequest({
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

							const bearerToken = tokenResponse.accessToken.token;

							// Step 2: Get Scheduler ID
							const schedulerResponse = await this.helpers.httpRequest({
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
										schedulerType: 'PushData',
										requestType: 'Source',
										endpointCode: credentials.endpointCode,
									},
								},
								json: true,
							});

							const schedulerId = schedulerResponse.schedulerId;

							// Step 3: Call Push Response API
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

							const response = await this.helpers.httpRequest({
								method: 'POST',
								url: `${credentials.baseUrl}/api/${dataType}/PushResponse`,
								headers: {
									'Authorization': `Bearer ${bearerToken}`,
									'Content-Type': 'application/json',
								},
								body: requestBody,
								json: true,
							});

							responseData = {
								success: true,
								message: `i95Dev API - ${dataType} Response Pushed Successfully`,
								apiResponse: response,
								bearerToken: bearerToken.substring(0, 20) + '...', // Show partial token for debugging
								schedulerId: schedulerId,
								requestBody,
								timestamp: new Date().toISOString(),
							};
						} catch (apiError) {
							responseData = {
								success: false,
								message: `i95Dev API - Error pushing ${dataType} response`,
								error: (apiError as Error).message,
								timestamp: new Date().toISOString(),
							};
						}
					}
				} else if (resource === 'bcactions') {
					if (operation === 'createCustomer') {
						try {
							// Get Business Central credentials
							const credentials = await this.getCredentials('i95DevApi');
							const tenantId = credentials.tenantId as string;
							const clientId = credentials.clientIdBC as string;
							const clientSecret = credentials.clientSecretBC as string;

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

							const tokenResponse = await this.helpers.httpRequest({
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

							// Store access token and call Business Central companies API
							const environment = credentials.environment as string || 'N8N';
							const bcApiUrl = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/api/v2.0/companies`;

							// Get company details using the access token
							const companiesResponse = await this.helpers.httpRequest({
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
							const customerDataString = this.getNodeParameter('customerDataJson', i) as string;
							let customerData;
							try {
								customerData = JSON.parse(customerDataString);
							} catch (parseError) {
								throw new Error(`Invalid JSON in customer data: ${(parseError as Error).message}`);
							}

							// Create customer using the company ID
							const createCustomerUrl = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/api/v2.0/companies(${companyId})/customers`;
							
							const customerResponse = await this.helpers.httpRequest({
								method: 'POST',
								url: createCustomerUrl,
								headers: {
									'Authorization': `Bearer ${bcAccessToken}`,
									'Content-Type': 'application/json',
								},
								body: customerData,
								json: true,
							});

							responseData = {
								success: true,
								message: 'Customer created successfully',
								customer: customerResponse,
								companyId: companyId,
								companyName: firstCompany.name,
								timestamp: new Date().toISOString(),
							};

						} catch (apiError) {
							responseData = {
								success: false,
								message: 'Failed to get access token',
								error: (apiError as Error).message,
								timestamp: new Date().toISOString(),
							};
						}
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
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
