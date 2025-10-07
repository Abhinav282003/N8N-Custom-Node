# i95Dev Node - Modular Architecture

This document describes the new modular architecture implemented for the i95Dev n8n node.

## Architecture Overview

The main node file `I95Dev.node.ts` has been refactored to use a modular approach where different operation types are handled in separate files. This makes the code more maintainable, readable, and easier to extend.

## File Structure

```
nodes/I95Dev/
├── I95Dev.node.ts          # Main node file (entry point)
├── types/
│   └── interfaces.ts        # TypeScript interfaces and types
├── utils/
│   └── apiHelper.ts        # Common API helper functions
└── operations/
    ├── pullActions.ts      # Pull data operations
    ├── pushActions.ts      # Push data operations
    ├── pullResponse.ts     # Pull response operations
    ├── pushResponse.ts     # Push response operations
    └── bcActions.ts        # Business Central operations
```

## Module Descriptions

### 1. Main Node (`I95Dev.node.ts`)
- **Purpose**: Entry point and orchestration
- **Responsibilities**:
  - Node configuration and properties definition
  - Route operations to appropriate handlers
  - Handle execution context and error management
  - Minimal logic, mainly delegation

### 2. Types (`types/interfaces.ts`)
- **Purpose**: Centralized type definitions
- **Contents**:
  - `I95DevCredentials` - Credential interface
  - `ApiContext` - API context structure
  - `ApiRequestBody` - Standard API request format
  - `ApiResponse` - Standard API response format
  - `ExecutionContext` - Execution context for operations

### 3. Utils (`utils/apiHelper.ts`)
- **Purpose**: Common utility functions
- **Functions**:
  - `getBearerToken()` - Authentication token retrieval
  - `getSchedulerId()` - Scheduler ID management
  - `createApiContext()` - API context creation
  - `getDataTypeFromOperation()` - Operation to data type mapping
  - `parseJsonSafely()` - Safe JSON parsing with fallback
  - `createSuccessResponse()` - Standardized success responses
  - `createErrorResponse()` - Standardized error responses

### 4. Pull Actions (`operations/pullActions.ts`)
- **Purpose**: Handle all pull data operations
- **Operations**:
  - `pullProductData`
  - `pullCustomerData`
  - `pullSalesOrderData`
  - `pullInvoiceData`
  - `pullShipmentData`
  - `pullInventoryData`

### 5. Push Actions (`operations/pushActions.ts`)
- **Purpose**: Handle all push data operations
- **Operations**:
  - `pushProductData`
  - `pushCustomerData`
  - `pushSalesOrderData`
  - `pushInvoiceData`
  - `pushShipmentData`
  - `pushInventoryData`

### 6. Pull Response (`operations/pullResponse.ts`)
- **Purpose**: Handle all pull response operations
- **Operations**:
  - `pullProductResponse`
  - `pullCustomerResponse`
  - `pullSalesOrderResponse`
  - `pullInvoiceResponse`
  - `pullShipmentResponse`
  - `pullInventoryResponse`

### 7. Push Response (`operations/pushResponse.ts`)
- **Purpose**: Handle all push response operations
- **Operations**:
  - `pushProductResponse`
  - `pushCustomerResponse`
  - `pushSalesOrderResponse`
  - `pushInvoiceResponse`
  - `pushShipmentResponse`
  - `pushInventoryResponse`

### 8. Business Central Actions (`operations/bcActions.ts`)
- **Purpose**: Handle Business Central specific operations
- **Operations**:
  - `createCustomer`

## Benefits of Modular Architecture

1. **Separation of Concerns**: Each module has a specific responsibility
2. **Maintainability**: Easier to locate and modify specific functionality
3. **Reusability**: Common functions are centralized in utils
4. **Testability**: Individual modules can be tested independently
5. **Scalability**: Easy to add new operations without cluttering main file
6. **Readability**: Smaller, focused files are easier to understand

## How to Add New Operations

### For eCommerce Operations:

1. **Add to appropriate operation file** (pullActions.ts, pushActions.ts, etc.)
2. **Update the operation checker function** (e.g., `isPullDataOperation()`)
3. **Add operation to node properties** in `I95Dev.node.ts`
4. **Follow existing patterns** for consistency

### For New Resource Types:

1. **Create new operation file** in `operations/` directory
2. **Add resource checker function**
3. **Update main execute method** in `I95Dev.node.ts`
4. **Add new node properties** for the resource

## Example: Adding a New Pull Operation

```typescript
// In operations/pullActions.ts
export function isPullDataOperation(operation: string): boolean {
  return [
    'pullProductData',
    'pullCustomerData',
    // ... existing operations
    'pullNewOperation', // Add new operation here
  ].includes(operation);
}
```

## Error Handling

Each operation module follows consistent error handling patterns:
- Use `try/catch` blocks
- Return standardized `ApiResponse` objects
- Use helper functions for consistent error formatting
- Maintain operation context for debugging

## Testing

The modular structure enables:
- **Unit testing** of individual functions
- **Integration testing** of operation modules
- **Mock testing** with isolated dependencies
- **End-to-end testing** through main node

This architecture provides a solid foundation for maintaining and extending the i95Dev node functionality while keeping the code organized and maintainable.