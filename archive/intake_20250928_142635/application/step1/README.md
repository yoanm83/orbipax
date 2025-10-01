# Step 1 - Demographics Business Logic

## Purpose
This folder contains business logic and use cases for Step 1 (Demographics) of the intake wizard.

## Expected Files
- `demographics.service.ts` - Demographics business logic
- `demographics.dto.ts` - Data transfer objects
- `demographics.mapper.ts` - Domain-to-DTO mappers
- `demographics.validator.ts` - Business validation rules
- `index.ts` - Barrel exports

## Architecture Guidelines
- Business logic orchestration
- Domain model transformations
- Integration with external services
- No UI concerns (that's in ui/ layer)
- No direct database access (that's in infrastructure/)

## Security Requirements
- PHI handling with proper authorization
- Data sanitization before persistence
- Audit logging for all operations
- Multi-tenant isolation

## IMPORTANT
**DO NOT MOVE EXISTING FILES IN THIS TASK**

This folder was created for organizational consistency. Files will be created in separate tasks.