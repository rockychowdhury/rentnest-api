---

<div align="center">
  <h1>RentNest Backend API</h1>
  <p><strong>A Modern Property Rental & Management Ecosystem</strong></p>
</div>

<br />

**RentNest** is a comprehensive property rental system built to streamline the leasing process for landlords and tenants. It provides a robust backend API featuring advanced property listing, location-based searching, integrated payment processing, and end-to-end lease management. 

Built with modern backend technologies, it ensures high performance, type-safety, and secure operations for all property-related transactions.

### 🚩 The Problem
Finding and managing rental properties can be a fragmented and stressful experience:
- **Tenants** struggle with disorganized property listings, complicated communication, and insecure payment methods.
- **Landlords** face difficulties managing multiple properties, tracking leases, and processing timely rent payments.
- Existing platforms often lack granular geographical filtering and secure, automated lease workflows.

### 💡 The Solution
RentNest solves these issues by providing a centralized, secure digital hub:
- **Advanced Property Search:** Filter properties by categories, amenities, price, and precise geographical locations (Divisions, Districts, Upazilas).
- **Streamlined Workflow:** Manage everything from the initial rental request to formal lease agreements within a single platform.
- **Secure Payments:** Integrated with Stripe for seamless, secure rent processing and automated lease updates via webhooks.
- **Robust Role Management:** Dedicated roles and permissions for Admins, Landlords, and Tenants to ensure secure access control.

<br />

## 🔗 Live Link
- **Live Demo / API Base URL:** [Insert Live Link Here](#)
- **Postman API Documentation:** [View Documentation / Workspace](#)

<br />

## 💻 Tech Stack
We used a modern, scalable backend tech stack to ensure high performance, security, and developer experience.

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
        <br />TypeScript
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48" alt="Node.js" />
        <br />Node.js
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=express" width="48" height="48" alt="Express" />
        <br />Express
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=prisma" width="48" height="48" alt="Prisma" />
        <br />Prisma
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=postgres" width="48" height="48" alt="PostgreSQL" />
        <br />PostgreSQL
      </td>
    </tr>
    <tr>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/stripe/stripe-js/main/docs/assets/logo.svg" width="48" height="48" alt="Stripe" />
        <br />Stripe API
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=git" width="48" height="48" alt="Git" />
        <br />Git
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=postman" width="48" height="48" alt="Postman" />
        <br />Postman
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=vercel" width="48" height="48" alt="Vercel" />
        <br />Vercel
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=docker" width="48" height="48" alt="Docker" />
        <br />Docker
      </td>
    </tr>
  </table>
</div>

<br />

### Core Platform Features
- **🏢 Property Management:** Comprehensive property definitions including multi-unit buildings, dynamic pricing models, amenities, and image galleries.
- **🌍 Granular Geospatial Filtering:** Robust, multi-level location modeling (Division -> District -> Upazila/Thana) for precise property discovery.
- **📄 End-to-End Leasing System:** Complete tracking of the rental lifecycle, from tenant requests to formalized leases and automated payment schedules.
- **💰 Integrated Payments:** Secure Stripe checkout sessions with real-time webhook handling for rent collection and lease activation.
- **⭐ Review & Rating System:** Verified reviews for properties to build community trust.
- **🔐 Secure Authentication:** JWT-based access and refresh token authentication with strict Role-Based Access Control (RBAC) and Zod payload validation.

<br />

### 1. Complex State & Validation via Zod
**Challenge:** Ensuring data integrity across complex nested payloads (like property creation with units, pricing, and amenities) while preventing unauthorized data injection.
**Solution:** We adopted **Zod** for strict runtime validation across all incoming requests. Integrated via robust middleware, it sanitizes inputs and integrates perfectly with TypeScript to ensure the controller and service layers only receive strongly-typed, validated data.

### 2. Deep Relational Data & Type Safety
**Challenge:** Property data is highly relational, connecting to landlords, units, amenities, pricing, and geography. Over-fetching or accidental data leakage (e.g., password hashes) was a risk.
**Solution:** We leveraged **Prisma** as our ORM with a modular multi-file schema setup. We enforced rigorous, type-safe Prisma selection objects across all service modules, preventing data leakage and ensuring consistent API responses while utilizing optimized database joins.

### 3. Asynchronous Payment Workflows
**Challenge:** Processing rental payments via Stripe requires handling asynchronous events safely without causing race conditions or missing critical lease updates.
**Solution:** Implemented a secure Stripe webhook listener processing raw payloads to verify event signatures. Successful `checkout.session.completed` events trigger transactional updates in the database, automatically updating payment records and activating leases with high reliability.

### 4. Advanced Geospatial Search
**Challenge:** Searching for properties across various regions of Bangladesh required a structured approach to location data that didn't bog down query performance.
**Solution:** We pre-seeded structured geographical data (Divisions, Districts, Upazilas). The backend dynamically constructs advanced Prisma queries based on user filters, providing fast, indexed searches for available rentals based on exact or broader regional matches.

<br />

## 📁 Project Structure
```text
RentNest/
├── docs/                     # Project documentation & API references
├── prisma/                   # Prisma ORM setup
│   ├── migrations/           # Database migrations
│   └── schema/               # Modular multi-file Prisma schemas
├── scripts/                  # Database seeding scripts (geo, categories, amenities)
├── src/                      
│   ├── config/               # Environment variables & constants
│   ├── lib/                  # External service wrappers (Stripe, etc.)
│   ├── middleware/           # Express middlewares (Error handling, Auth, Zod validation)
│   ├── modules/              # Domain-Driven feature modules (Auth, Property, Payment, etc.)
│   ├── types/                # Global TypeScript definitions
│   ├── utils/                # Helper utilities and response formatters
│   ├── app.ts                # Express application configuration
│   └── server.ts             # Server entry point
├── package.json              # Project dependencies
└── vercel.json               # Vercel deployment configuration
```

<br />

## 📚 Documentation
For deep dives into the API endpoints and architecture, please refer to the internal documentation:

- **Postman API Collection:** Found in `docs/postman-api-collection.json` containing detailed endpoints, request/response formats, and authentication flows.
- **Validation Requirements:** See `docs/validation_requirements.md` for our standardized approach to API request validation.
- **Stripe Integration Guide:** Details on our payment workflows can be found in `docs/stripe_session_object_info.md`.

<br />

## 🤝 Contribution
Contributions, issues, and feature requests are welcome! 
Feel free to check the issues page if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<br />

## 📬 Contact & Links
**[Rocky Chowdhury / Full Stack Developer]**  
Full-Stack Developer passionate about building impactful digital solutions.

- 🌐 **Portfolio:** [Rocky Chowdhury Portfolio](https://rockychowdhury.vercel.app/)
- 💼 **LinkedIn:** [Rocky Chowdhury](https://www.linkedin.com/in/rockychowdhury1/)
- ✉️ **Email:** [rockychowdhury055@gmail.com](mailto:rockychowdhury055@gmail.com)

---
*If you find this project useful, please consider giving it a ⭐ on GitHub!*
