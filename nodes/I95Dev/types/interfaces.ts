import { IExecuteFunctions } from 'n8n-workflow';

export interface I95DevCredentials {
	refreshToken: string;
	clientId: string;
	subscriptionKey: string;
	instanceType: string;
	endpointCode: string;
	baseUrl: string;
	tenantId?: string;
	clientIdBC?: string;
	clientSecretBC?: string;
	environment?: string;
}

export interface ApiContext {
	clientId: string;
	subscriptionKey: string;
	instanceType: string;
	endpointCode: string;
	isNotEncrypted: boolean;
	schedulerType: string;
	requestType: string;
	schedulerId: string;
}

export interface ApiRequestBody {
	Context: {
		ClientId: string;
		SubscriptionKey: string;
		InstanceType: string;
		EndpointCode: string;
		isNotEncrypted: boolean;
		SchedulerType: string;
		RequestType: string;
		SchedulerId: string;
	};
	RequestData: any[];
	PacketSize: number;
	type: string | null;
}

export interface PushResponseRequestBody {
	context: {
		clientId: string;
		subscriptionKey: string;
		instanceType: string;
		schedulerType: string;
		endPointCode: string;
		schedulerId: string;
		isNotEncrypted: boolean;
	};
	packetSize: number;
	requestData: any[];
}

export interface ApiResponse {
	success: boolean;
	message: string;
	apiResponse?: any;
	bearerToken?: string;
	schedulerId?: string;
	requestBody?: any;
	timestamp: string;
	error?: string;
}

export interface ExecutionContext {
	executeFunctions: IExecuteFunctions;
	itemIndex: number;
}