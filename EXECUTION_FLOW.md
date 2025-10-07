# i95Dev Node - Complete Execution Flow Documentation

This document explains the **complete flow** of how your modularized i95Dev node works from start to finish.

## 🔄 **Complete Execution Flow**

### **1. Node Registration & Initialization**

When n8n starts up:

```
n8n reads package.json → finds "dist/nodes/I95Dev/I95Dev.node.js" 
→ Loads the compiled I95Dev.node.ts → Registers the node in n8n UI
```

### **2. User Interaction Flow**

#### **Step A: Adding Node to Workflow**
```
User drags "i95Dev" node → n8n reads node description from I95Dev.node.ts
→ Shows the UI properties (Resource, Operation, etc.)
```

#### **Step B: Credential Setup**
```
User clicks "Credential" → n8n loads I95DevApi.credentials.ts
→ Shows credential form (Refresh Token, Client ID, etc.)
→ User enters credentials → Saves to n8n credential store
```

#### **Step C: Node Configuration**
```
User selects Resource (ecommerce/bcactions)
→ User selects Operation (pullProductData, pushCustomerData, etc.)
→ User fills in parameters (Packet Size, Request Data, etc.)
```

### **3. Execution Flow (When User Clicks "Execute Workflow")**

#### **Step 1: Entry Point** 
```
User clicks "Execute Workflow"
↓
n8n calls: I95Dev.node.ts → execute() method
↓
Reads user parameters: resource = "ecommerce", operation = "pullProductData"
```

#### **Step 2: Routing Logic**
```
I95Dev.node.ts checks:
- Is resource = "ecommerce"? ✅ YES
- Is operation a pull data operation? ✅ YES (pullProductData)
↓
Routes to: operations/pullActions.ts → executePullDataOperation()
```

#### **Step 3: Modular Execution**

The execution flow in `operations/pullActions.ts → executePullDataOperation()`:

```typescript
1. Gets credentials from n8n credential store
2. Gets user parameters (packetSize, requestData, etc.)
3. Calls utils/apiHelper.ts → getBearerToken()
4. Calls utils/apiHelper.ts → getSchedulerId() 
5. Calls utils/apiHelper.ts → createApiContext()
6. Makes HTTP request to i95Dev API
7. Returns structured response
```

#### **Step 4: Utility Function Calls**

```
utils/apiHelper.ts functions are called:
1. getBearerToken() → Makes API call to get authentication token
2. getSchedulerId() → Gets scheduler ID from i95Dev API
3. createApiContext() → Builds request context object
4. createSuccessResponse() → Formats the final response
```

## 📊 **Complete Flow Diagram**

```
[User Action] → [File Executed] → [Function Called]

1. Add Node to Workflow
   ↓
   I95Dev.node.ts (description property)
   ↓ 
   Shows UI form to user

2. Configure Credentials  
   ↓
   I95DevApi.credentials.ts
   ↓
   Stores credentials in n8n

3. Click "Execute Workflow"
   ↓
   I95Dev.node.ts → execute() method
   ↓
   Reads resource & operation parameters

4. Route to Operation Handler
   ↓
   IF resource="ecommerce" & operation="pullProductData"
   ↓
   operations/pullActions.ts → executePullDataOperation()

5. Get Credentials & Parameters
   ↓
   executeFunctions.getCredentials('i95DevApi')
   ↓
   Retrieves saved credentials

6. Call Utility Functions
   ↓
   utils/apiHelper.ts → getBearerToken()
   ↓
   Makes HTTP POST to: baseUrl/api/client/Token

7. Get Scheduler ID
   ↓
   utils/apiHelper.ts → getSchedulerId()
   ↓
   Makes HTTP POST to: baseUrl/api/Index

8. Make Main API Call
   ↓
   operations/pullActions.ts
   ↓
   Makes HTTP POST to: baseUrl/api/Product/PullData

9. Format Response
   ↓
   utils/apiHelper.ts → createSuccessResponse()
   ↓
   Returns structured ApiResponse

10. Return to n8n
    ↓
    I95Dev.node.ts → execute() method
    ↓
    Returns execution data to n8n workflow
```

## 🔍 **Detailed Example: Pull Product Data**

When user selects **Resource: "ecommerce"** and **Operation: "pullProductData"**:

```typescript
// 1. ENTRY: I95Dev.node.ts
resource = "ecommerce"
operation = "pullProductData" 

// 2. ROUTING: I95Dev.node.ts  
isPullDataOperation("pullProductData") → returns true
→ calls executePullDataOperation(context, "pullProductData")

// 3. EXECUTION: operations/pullActions.ts
→ getDataTypeFromOperation("pullProductData") → returns "Product"
→ getBearerToken() → calls baseUrl/api/client/Token
→ getSchedulerId() → calls baseUrl/api/Index  
→ HTTP POST to: baseUrl/api/Product/PullData

// 4. RESPONSE: utils/apiHelper.ts
→ createSuccessResponse() → formats response
→ Returns to I95Dev.node.ts → Returns to n8n
```

## 📁 **File Responsibilities During Execution**

### **I95Dev.node.ts (Main Router)**
- **When Called**: Every workflow execution
- **Responsibilities**: 
  - Entry point for n8n
  - Parameter extraction
  - Operation routing
  - Error handling wrapper
  - Response formatting for n8n

### **operations/pullActions.ts**
- **When Called**: For pull data operations (pullProductData, pullCustomerData, etc.)
- **Responsibilities**:
  - Pull-specific parameter handling
  - Bearer token acquisition
  - Scheduler ID retrieval
  - Pull API endpoint calls
  - Pull-specific error handling

### **operations/pushActions.ts**
- **When Called**: For push data operations (pushProductData, pushCustomerData, etc.)
- **Responsibilities**:
  - Push-specific parameter handling
  - Push data validation
  - Push API endpoint calls
  - Push-specific error handling

### **operations/pullResponse.ts**
- **When Called**: For pull response operations (pullProductResponse, etc.)
- **Responsibilities**:
  - Response queue parameter handling
  - Pull response API calls
  - Response data processing

### **operations/pushResponse.ts**
- **When Called**: For push response operations (pushProductResponse, etc.)
- **Responsibilities**:
  - Response queue parameter handling
  - Push response API calls
  - Response data formatting

### **operations/bcActions.ts**
- **When Called**: For Business Central operations (createCustomer)
- **Responsibilities**:
  - Microsoft OAuth token acquisition
  - Business Central API authentication
  - BC-specific operations
  - Company and environment handling

### **utils/apiHelper.ts**
- **When Called**: By all operation modules
- **Responsibilities**:
  - Common authentication functions
  - API context creation
  - Response formatting
  - Error response creation
  - JSON parsing utilities

### **types/interfaces.ts**
- **When Called**: Imported by all modules
- **Responsibilities**:
  - Type definitions
  - Interface contracts
  - TypeScript compilation support

## 🚀 **Operation-Specific Execution Paths**

### **Pull Data Operations Flow**
```
User Action → I95Dev.node.ts → operations/pullActions.ts
                 ↓
            utils/apiHelper.ts (getBearerToken)
                 ↓
            utils/apiHelper.ts (getSchedulerId)
                 ↓
            utils/apiHelper.ts (createApiContext)
                 ↓
            HTTP Request to: /api/{DataType}/PullData
                 ↓
            utils/apiHelper.ts (createSuccessResponse)
                 ↓
            Return to I95Dev.node.ts → Return to n8n
```

### **Push Data Operations Flow**
```
User Action → I95Dev.node.ts → operations/pushActions.ts
                 ↓
            utils/apiHelper.ts (getBearerToken)
                 ↓
            utils/apiHelper.ts (getSchedulerId)
                 ↓
            utils/apiHelper.ts (createApiContext)
                 ↓
            HTTP Request to: /api/{DataType}/PushData
                 ↓
            utils/apiHelper.ts (createSuccessResponse)
                 ↓
            Return to I95Dev.node.ts → Return to n8n
```

### **Business Central Operations Flow**
```
User Action → I95Dev.node.ts → operations/bcActions.ts
                 ↓
            Microsoft OAuth Token Request
                 ↓
            Business Central Companies API Call
                 ↓
            Business Central Customer Creation API Call
                 ↓
            Custom Response Formatting
                 ↓
            Return to I95Dev.node.ts → Return to n8n
```

## 🔧 **Parameter Flow**

### **Credential Flow**
```
1. User enters credentials in n8n UI
2. Credentials stored in n8n credential store
3. During execution: executeFunctions.getCredentials('i95DevApi')
4. Credentials passed to operation modules
5. Used in API calls via utils/apiHelper.ts functions
```

### **Node Parameter Flow**
```
1. User configures node parameters in n8n UI
2. Parameters stored with workflow
3. During execution: executeFunctions.getNodeParameter('paramName', itemIndex)
4. Parameters used in respective operation modules
5. Transformed and sent to API endpoints
```

## 🎯 **Key Points**

1. **I95Dev.node.ts** = Entry point & router (minimal logic)
2. **operations/*.ts** = Actual business logic execution
3. **utils/apiHelper.ts** = Shared utility functions  
4. **types/interfaces.ts** = Type definitions for TypeScript
5. **credentials** = Stored securely in n8n, retrieved when needed

## 🐛 **Debugging Guide**

### **If Authentication Fails**
- Check: `utils/apiHelper.ts → getBearerToken()`
- Verify: Credentials in n8n credential store
- Test: Manual API call to `/api/client/Token`

### **If Operation Routing Fails**
- Check: `I95Dev.node.ts → execute()` method routing logic
- Verify: Operation name matches the checker functions
- Test: Console log the resource and operation values

### **If API Calls Fail**
- Check: Respective operation file (`operations/*.ts`)
- Verify: API endpoint URLs and request bodies
- Test: Manual API calls with same parameters

### **If Response Processing Fails**
- Check: `utils/apiHelper.ts → createSuccessResponse()`
- Verify: Response data structure
- Test: Response object formatting

The modular structure means each file has a specific job, making it easy to debug and maintain! 🚀