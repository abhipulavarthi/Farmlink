# Backend Roles & Permissions Specification
**Project:** Farm-to-Table Marketplace (FAai)  
**Version:** 1.0  
**Date:** 2024-01-03

---

## 1. Overview
This document outlines the security architecture regarding User Roles and Access Control for the backend. The system currently differentiates between two primary active roles: **Buyer (User)** and **Seller**. An **Admin** role is planned for platform oversight.

The backend must strictly enforce these roles to ensure data integrity—specifically, ensuring that Sellers can only modify their own inventory and Buyers cannot access administrative functions.

## 2. User Roles Definitions

| Role | Key (`role`) | Description |
| :--- | :--- | :--- |
| **Buyer** | `user` | The default role for new sign-ups. Can browse products, view seller profiles, and manage their own profile. |
| **Seller** | `seller` | A trusted role for farmers/vendors. Inherits all Buyer capabilities but adds permissions to manage a store and inventory. |
| **Admin** | `admin` | (Internal) Platform managers with full access to all resources for moderation and support. |

---

## 3. Data Model Requirements

### 3.1 User Schema
The user database table/collection must support role differentiation.

```json
{
  "id": "UUID",
  "phoneNumber": "String (Unique, Indexed)",
  "role": "Enum('user', 'seller', 'admin')",
  "name": "String",
  "location": {
    "lat": "Float",
    "lng": "Float",
    "address": "String"
  },
  "sellerProfile": {  // Nullable, only populated if role == 'seller'
    "storeName": "String",
    "description": "String",
    "storeImages": ["URL"],
  },
  "createdAt": "Timestamp",
  "lastLogin": "Timestamp"
}
```

### 3.2 Product Schema
Products must be strictly linked to a Seller.

```json
{
  "id": "UUID",
  "sellerId": "UUID (Foreign Key -> Users.id)",
  "name": "String",
  "category": "Enum('vegetable', 'fruit')",
  "price": "Decimal",
  "stock": "Integer",
  "unit": "String",
  "imageUrl": "URL",
  "createdAt": "Timestamp"
}
```

---

## 4. Permission Matrix (RBAC)

| Resource | Action | Buyer (`user`) | Seller (`seller`) | Admin (`admin`) |
| :--- | :--- | :---: | :---: | :---: |
| **Authentication** | Login/Logout | ✅ | ✅ | ✅ |
| **Profile** | View Own | ✅ | ✅ | ✅ |
| | Update Own | ✅ | ✅ | ✅ |
| | View Others | ❌ | ❌ | ✅ |
| **Store Profile** | View | ✅ | ✅ | ✅ |
| | Create/Update | ❌ | ✅ (Own Store Only) | ✅ |
| **Products** | View List (Search) | ✅ | ✅ | ✅ |
| | View Details | ✅ | ✅ | ✅ |
| | Create | ❌ | ✅ | ❌ |
| | Update | ❌ | ✅ (Own Products Only) | ✅ |
| | Delete | ❌ | ✅ (Own Products Only) | ✅ |
| **Platform** | View Analytics | ❌ | ✅ (Own Stats Only) | ✅ (Global) |
| | Ban User | ❌ | ❌ | ✅ |

---

## 5. API Endpoint Security Rules

Middleware must be implemented to check `req.user.role` before processing requests.

### 5.1 Public Endpoints (No Auth Required)
*   `POST /api/auth/login`: Request OTP.
*   `POST /api/auth/verify`: Verify OTP and exchange for token.

### 5.2 Protected Endpoints (Authenticated)

#### **Users (`/api/users`)**
*   `GET /me`: Return `req.user`.
*   `PUT /me`: Allow updates to `name`, `location`.
    *   **Rule:** If `req.body.role` is present, ignore it or throw error (Roles cannot be self-changed via update).

#### **Sellers (`/api/sellers`)**
*   `GET /`: List sellers near a location.
*   `GET /:id`: View active seller profile.

#### **Products (`/api/products`)**
*   `GET /`: List all products (filterable).
*   `POST /`:
    *   **Check:** `req.user.role === 'seller'`
    *   **Action:** Force `sellerId = req.user.id` (Do not trust body).
*   `PUT /:id`:
    *   **Check:** `req.user.role === 'seller'`
    *   **Check:** Database lookup verify `product.sellerId === req.user.id`.
*   `DELETE /:id`:
    *   **Check:** `req.user.role === 'seller'`
    *   **Check:** Database lookup verify `product.sellerId === req.user.id`.

---

## 6. Implementation Strategy (Phase 1)
Since the current project uses a `mockApi.js`, the transition to a real backend (Node.js/Express, Python/FastAPI, etc.) should follow these steps:

1.  **Token Based Auth**: Implement JWT (JSON Web Tokens). The payload (token content) should include the Role.
    *   *Payload Example:* `{ "sub": "user_123", "role": "seller", "iat": 1704250000 }`
2.  **Middleware**: Create a `requireRole(roleName)` middleware function.
    ```javascript
    const requireSeller = (req, res, next) => {
        if (req.user.role !== 'seller' && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Sellers only.' });
        }
        next();
    };
    ```
3.  **Ownership Checks**: For update/delete operations, always query the item first to confirm ownership before executing the change.

