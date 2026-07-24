# Validation Requirements for RentNest Modules

Based on your Prisma database schema, here is a comprehensive breakdown of the inputs you need to validate for each module when building your validation schemas (e.g., using Zod or Joi).

## 1. Auth & User Modules
### Registration / Create User
- **`email`**: String (Must be a valid email format)
- **`phone`**: String (Must be a valid phone number)
- **`password`**: String (Min length, strong password policy)
- **`fullName`**: String (Max length 255)
- **`role`**: Enum (`TENANT`, `LANDLORD`, `ADMIN`, etc.)

### Login
- **`email`** / **`phone`**: String
- **`password`**: String

### User Updates (Admin/Self)
- **`status`**: Enum (`ACTIVE`, `INACTIVE`, `SUSPENDED`)
- **`role`**: Enum (`TENANT`, `LANDLORD`, `ADMIN`)

---

## 2. Profile Module
### Update Profile
- **`fullName`**: String (Required, Max length 255)
- **`avatarUrl`**: String (Optional, Valid URL)
- **`bio`**: String (Optional, Max length 500)
- **`gender`**: Enum (Optional: `MALE`, `FEMALE`, `OTHER`)
- **`occupation`**: String (Optional, Max length 255)

---

## 3. Category & Amenity Modules
### Create / Update Category or Amenity
- **`name`**: String (Required, Max length 255)
- **`description`**: String (Optional)

---

## 4. Geography Module (Addresses)
*(Usually nested within Property Creation)*
- **`buildingNo`**: String (Required, Max length 255)
- **`streetAddress`**: String (Required, Max length 255)
- **`addressLine2`**: String (Optional)
- **`landmark`**: String (Optional, Max length 255)
- **`postalCode`**: String (Required, Max length 20)
- **`upazilaId`**: Integer (Required, must reference existing Upazila)
- **`latitude`**: Number / Decimal (Optional, Decimal scale validation)
- **`longitude`**: Number / Decimal (Optional, Decimal scale validation)

---

## 5. Property Module
### Create / Update Property
- **`categoryId`**: UUID (Required)
- **`title`**: String (Required, Max length 255)
- **`description`**: String (Required)
- **`status`**: Enum (Optional, Default `DRAFT`, e.g., `PUBLISHED`)
- **`isFeatured`**: Boolean (Optional, Default `false`)
- **`totalUnits`**: Integer (Optional, Default 1, Min 1)
- **`address`**: Object (Must validate nested Address schema, see Geography Module)

---

## 6. Property Unit Module
### Create / Update Unit
- **`propertyId`**: UUID (Required)
- **`unitLabel`**: String (Required, Max length 255)
- **`status`**: Enum (Optional, Default `AVAILABLE`, e.g., `RENTED`, `MAINTENANCE`)
- **`sizeSqft`**: Integer (Optional, Positive number)
- **`bedrooms`**: Integer (Optional, Default 0, Positive number)
- **`bathrooms`**: Integer (Optional, Default 0, Positive number)
- **`floor`**: Integer (Optional)
- **`description`**: String (Optional)

---

## 7. Property Image Module
### Add Image
- **`propertyId`**: UUID (Required)
- **`url`**: String (Required, Valid URL, Max length 255)
- **`deleteUrl`**: String (Optional, Valid URL)
- **`caption`**: String (Optional, Max length 255)
- **`isCover`**: Boolean (Optional, Default `false`)

---

## 8. Pricing Module
### Create / Update Pricing
- **`propertyUnitId`**: UUID (Required)
- **`rentType`**: Enum (Required, e.g., `MONTHLY`, `YEARLY`)
- **`rentAmount`**: Number / Decimal (Required, Positive number)
- **`securityDeposit`**: Number / Decimal (Optional, Positive number)
- **`currency`**: Enum (Optional, Default `BDT`)
- **`isActive`**: Boolean (Optional, Default `true`)

---

## 9. Rental Request Module
### Submit Request (Tenant)
- **`propertyUnitId`**: UUID (Required)
- **`pricingId`**: UUID (Required)
- **`agreedAmount`**: Number / Decimal (Required, Positive number)
- **`rentType`**: Enum (Required, e.g., `MONTHLY`, `YEARLY`)
- **`currency`**: Enum (Optional, Default `BDT`)
- **`moveInDate`**: Date String (Required, must be a future date)
- **`duration`**: Integer (Optional, number of months/years based on rentType)
- **`message`**: String (Optional)

### Review Request (Landlord)
- **`status`**: Enum (Required, e.g., `APPROVED`, `REJECTED`)
- **`landlordResponse`**: String (Optional)

---

## 10. Lease Module
*(Usually auto-generated after Request Approval, but if manual entry exists)*
- **`propertyUnitId`**: UUID
- **`tenantId`**: UUID
- **`rentalRequestId`**: UUID
- **`rentType`**: Enum
- **`agreedAmount`**: Number
- **`startDate`**: Date String
- **`endDate`**: Date String (Optional, must be after startDate)
- **`status`**: Enum (`PENDING_PAYMENT`, `ACTIVE`, `TERMINATED`)

---

## 11. Payment Module
### Initialize Checkout (Tenant)
- **`leaseId`**: UUID (Required)
- **`amount`**: Number (Required)

*(Webhook payloads are validated by the Stripe SDK using the Webhook Secret, no Zod schema needed for the webhook payload itself).*

---

## 12. Review Module
### Submit Review (Tenant)
- **`propertyId`**: UUID (Required)
- **`leaseId`**: UUID (Optional)
- **`rating`**: Integer (Required, Min 1, Max 5)
- **`comment`**: String (Optional)

### Reply to Review (Landlord)
- **`landlordResponse`**: String (Required)
