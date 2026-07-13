export interface ArchitectureTopic {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  highlights: string[];
  details: string;
  diagramText?: string;
  codeSnippet?: {
    language: string;
    code: string;
    fileName: string;
  };
}

export const architectureTopics: ArchitectureTopic[] = [
  {
    id: "frontend",
    title: "1. Frontend Architecture",
    shortDesc: "Reactive, mobile-first single-screen workspace utilizing React 19, Vite, Tailwind CSS v4, and Motion React.",
    iconName: "Layout",
    highlights: [
      "Modular components for separate layout and view logic",
      "Tailwind v4 theme extensions and fluid, responsive design",
      "Motion-driven smooth state transitions and skeleton loaders",
      "Local state caching + Firestore listener integrations"
    ],
    details: "The frontend is built on React 19 and Vite for lightning-fast compilation and runtime performance. Layouts are strictly responsive, designed with desktop-first productivity in mind but fully mobile-compliant. Styling is powered by Tailwind CSS v4 using modern CSS-only configurations, avoiding PostCSS overhead. Animations are built on Motion (importing from motion/react) to provide non-blocking visual feedback during ad generation. State is organized linearly: input collections, prompt states, and response renders are managed through cohesive hooks and context providers, which smoothly switch to Firestore listeners once Firestore is provisioned.",
    diagramText: `
+--------------------------------------------------------+
|                      React 19 View                     |
|  +--------------------+       +---------------------+  |
|  |   Ad Remix Form    |       | Campaign Dashboard  |  |
|  +---------+----------+       +----------+----------+  |
+------------|-----------------------------|-------------+
             v                             v
+--------------------------------------------------------+
|                    Context State                       |
|   - Active Platform           - Saved Collections     |
|   - Loading Progression       - Selected Copy Template|
+--------------------------------------------------------+
             |
             v (HTTP POST)
+--------------------------------------------------------+
|                   Express API Proxy                    |
+--------------------------------------------------------+
`
  },
  {
    id: "backend",
    title: "2. Backend Architecture",
    shortDesc: "High-performance Node.js Express server acting as a secure API Gateway and asset streaming proxy.",
    iconName: "Server",
    highlights: [
      "Custom Express Router on Cloud Run with auto-scaling",
      "Strict environment variables isolating sensitive API credentials",
      "Secure server-side API endpoints proxying client calls",
      "Integrated Vite middleware for single-port dev execution"
    ],
    details: "The backend consists of a secure Node.js Express proxy running inside scalable Cloud Run container environments. In development, the same server boots Vite's dev server middleware using 'appType: spa' on Port 3000, presenting a cohesive single-port development architecture. In production, static asset requests serve directly from the compiled '/dist' directory, while active business logic routes (e.g. ad generation, credentials verification) execute on the Express core. This prevents any exposure of API keys, databases, or third-party credentials to client bundles, making it inherently compliant with zero-trust design.",
    diagramText: `
+------------------------+      Serving      +-------------------------+
|      Client/Browser    | <---------------+ | Express Server (Port 3000)|
|                        |                   | - API Gateway           |
| (No direct API access) | ----------------> | - Static File Delivery  |
+------------------------+    /api requests  | - Vite middleware (dev) |
                                             +------------+------------+
                                                          | (HTTPS Client)
                                                          v
                                             +-------------------------+
                                             |   Google Gemini API     |
                                             |   (gemini-3.5-flash)    |
                                             +-------------------------+
`
  },
  {
    id: "database",
    title: "3. Database Design",
    shortDesc: "Enterprise-grade Cloud Firestore document hierarchy designed for low-latency indexing and cost optimization.",
    iconName: "Database",
    highlights: [
      "Strict relational boundaries preventing O(n) array bloating",
      "Split collections isolating private user data from public items",
      "Auto-indexing for quick composite queries (e.g. sorting history)",
      "Strict 1MB per-document limit compliance using subcollections"
    ],
    details: "Durable database persistence is modeled inside Cloud Firestore. Following standard Firestore Enterprise best practices, unbounded data arrays are prohibited. To model campaigns, we use a parent 'campaigns' document containing high-level metadata (product name, description, timestamps), and partition platform creatives into a structured subcollection: '/campaigns/{campaignId}/platforms/{platformId}'. This isolates larger script payloads and ensures document sizes remain far below the 1MB Firestore threshold, while simultaneously reducing the read and write operational costs for simple dashboard lists.",
    diagramText: `
/users/{userId}             --> User metadata & billing tier limit doc
  
/campaigns/{campaignId}     --> Parent Metadata Document
  |                             - productName: string
  |                             - productDescription: string
  |                             - createdAt: timestamp
  |
  +--- /platforms/{platformId}  --> Subcollection (Platform assets)
         - platformName: 'TikTok' | 'Instagram' | 'Facebook' | 'YouTube'
         - hooks: Array of hooks
         - videoScript: { title, duration, scenes: [...] }
         - socialPost: { caption, hashtags }
`
  },
  {
    id: "firebase",
    title: "4. Firebase Services",
    shortDesc: "Scalable authentication, document store, and rule deployment syncing locally and in the cloud.",
    iconName: "Cloud",
    highlights: [
      "Firebase Auth utilizing secured Google OAuth sign-in flow",
      "Cloud Firestore for relational data modeling",
      "Durable Rules deployment mapping data configurations",
      "Automated client validation syncing with the Firestore schema"
    ],
    details: "Firebase acts as the core persistence and identity wrapper. Identity is authenticated via Firebase Authentication's Google Sign-in popup, which returns authenticated tokens to the client. This token is attached by the Firebase SDK automatically to Firestore socket connections. To verify structural integrity, we maintain a static 'firebase-blueprint.json' file which serves as our Intermediate Representation (IR). The properties, maxLength boundaries, and types defined in this blueprint are synchronized verbatim into both our frontend visual form validators and our backend database security rules, preventing format drift.",
    codeSnippet: {
      language: "json",
      fileName: "firebase-blueprint.json",
      code: `{
  "entities": {
    "campaign": {
      "title": "Campaign",
      "description": "Ad Remixer Campaign metadata",
      "type": "object",
      "properties": {
        "productName": { "type": "string", "maxLength": 100 },
        "productDescription": { "type": "string", "maxLength": 2000 },
        "createdAt": { "type": "string", "format": "date-time" },
        "ownerId": { "type": "string", "pattern": "^[a-zA-Z0-9_\\\\-]+$" }
      },
      "required": ["productName", "productDescription", "createdAt", "ownerId"]
    }
  },
  "firestore": {
    "/campaigns/{campaignId}": {
      "schema": "campaign",
      "description": "User created ad campaign"
    }
  }
}`
    }
  },
  {
    id: "auth",
    title: "5. Authentication Flow",
    shortDesc: "Zero-trust client authentication utilizing standard popup mechanisms, with secure server validation.",
    iconName: "ShieldAlert",
    highlights: [
      "Popup-based OAuth handling avoiding standard iframe sandboxing issues",
      "Automatic token persistence and state changes listener on client",
      "Backend token parsing verifying signatures and expiry",
      "Strict isolation of user-specific assets using unique user IDs"
    ],
    details: "Authentication handles user session creation safely. Because the application runs inside an iframe environment, we prefer signInWithPopup over signInWithRedirect to avoid strict third-party cookie blocking and callback routing conflicts. Once successfully authenticated on the client, the SDK persists session tokens in indexedDB. Any subsequent database request checks the active connection. When building custom server-side functions that communicate with Firebase resources, we intercept requests, extract the Authorization header, and verify the client token signature using Firebase Admin, ensuring complete user validation.",
    diagramText: `
+---------------+           1. Sign-In Click           +---------------+
|  React Client | -----------------------------------> | Firebase Auth |
|               | <----------------------------------- |  Popup        |
+-------+-------+             2. ID Token Returned     +---------------+
        |
        | 3. API Request with Auth Header
        v
+-------+-------+             4. Validate Token        +---------------+
|  Express API  | -----------------------------------> | Firebase Admin|
|  Server       | <----------------------------------- | Security SDK  |
+---------------+             5. Verified user details +---------------+
`
  },
  {
    id: "gemini",
    title: "6. Gemini AI Integration",
    shortDesc: "Server-side integration utilizing the @google/genai SDK, structured schema rendering, and telemetry optimization.",
    iconName: "Cpu",
    highlights: [
      "Strict server-side calls preventing API key leak vulnerabilities",
      "Enforcement of responseSchema ensuring 100% typed JSON structures",
      "Integration of 'aistudio-build' telemetry tag in HTTP headers",
      "System instructions enforcing professional growth-marketing logic"
    ],
    details: "AI capability is built using Google's modern @google/genai TypeScript SDK. It communicates exclusively server-side via '/api/transform'. The model selection defaults to 'gemini-3.5-flash' for optimal speed, high output compliance, and direct-response reasoning. To make the outputs reliable, we configure a strict Type.OBJECT responseSchema, eliminating standard text parser issues or truncated blocks. The configuration enforces a telemetry User-Agent header of 'aistudio-build' inside the GoogleGenAI httpOptions. System instructions guide the model to adopt the persona of a growth marketer with deep knowledge of viral formulas for short-form video formats.",
    codeSnippet: {
      language: "typescript",
      fileName: "server.ts",
      code: `import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});

// Prompt the model using a highly structured JSON responseSchema
const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: prompt,
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        platforms: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platformName: { type: Type.STRING },
              targetingTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    }
  }
});`
    }
  },
  {
    id: "security",
    title: "7. Security Rules (Zero-Trust)",
    shortDesc: "Attribute-Based Access Control rules preventing data leaks, identity spoofing, and resource exhaustion.",
    iconName: "Lock",
    highlights: [
      "Default-deny ruleset acting as an absolute global shield",
      "isValidEntity() helpers verifying size boundaries and types",
      "affectedKeys().hasOnly() blocking shadow or unrequested fields",
      "Enforced email verification status preventing domain spoofing"
    ],
    details: "Security rules are written under a strict Zero-Trust philosophy. The global entrypoint establishes a default-deny blanket 'allow read, write: if false;'. Access is granted explicitly for each matched collection path. To ensure complete state validation, updates are partitioned using the 'Action-Based' update pattern with boolean '||' statements. The affectedKeys().hasOnly() guard isolates exactly which fields are modifiable for specific actions, blocking attackers from appending malicious data. Relational integrity is verified by querying parent documents using get(), while temporal integrity mandates comparing payload values with request.time.",
    codeSnippet: {
      language: "javascript",
      fileName: "firestore.rules",
      code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Global Safety net default-deny
    match /{document=**} {
      allow read, write: if false;
    }

    // Secure user profile subcollections
    match /users/{userId} {
      allow get: if isOwner(userId);
      allow create: if isSignedIn() && isOwner(userId) && isValidUser(incoming());
      allow update: if isSignedIn() && isOwner(userId) && isValidUser(incoming()) && (
        incoming().diff(existing()).affectedKeys().hasOnly(['displayName', 'photoURL'])
      );
    }

    // Campaign document access
    match /campaigns/{campaignId} {
      allow list: if isSignedIn() && resource.data.ownerId == request.auth.uid;
      allow get: if isSignedIn() && resource.data.ownerId == request.auth.uid;
      allow create: if isSignedIn() && incoming().ownerId == request.auth.uid && isValidCampaign(incoming());
      allow update: if isSignedIn() && existing().ownerId == request.auth.uid && isValidCampaign(incoming()) && (
        incoming().diff(existing()).affectedKeys().hasOnly(['productName', 'productDescription', 'updatedAt'])
      );
      allow delete: if isSignedIn() && existing().ownerId == request.auth.uid;
    }

    // Global reusable helpers
    function isSignedIn() {
      return request.auth != null && request.auth.token.email_verified == true;
    }
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    function incoming() {
      return request.resource.data;
    }
    function existing() {
      return resource.data;
    }
    function isValidCampaign(data) {
      return data.productName is string && data.productName.size() <= 100
          && data.productDescription is string && data.productDescription.size() <= 2000;
    }
  }
}`
    }
  },
  {
    id: "folder",
    title: "8. Folder Structure",
    shortDesc: "Standard full-stack project structure organizing modular views, API routers, configurations, and scripts.",
    iconName: "FolderGit",
    highlights: [
      "Absolute isolation of server-side operations and client scripts",
      "Centralized type definitions file avoiding structural conflicts",
      "Explicit config directories containing blueprinted database schemas",
      "Dedicated asset folders housing secure media configurations"
    ],
    details: "The project tree isolates frontend development from backend execution, promoting clean CI/CD boundaries. Compilation endpoints, environment models, and configurations sit at the project root. Components are split out from main views into a localized subfolder, while types are exported globally, avoiding duplication and enabling rigid type-safety validation.",
    diagramText: `
/ (Root)
├── .env.example              --> Required environment keys documentation
├── .gitignore                --> CI/CD git exclusions
├── firebase-blueprint.json   --> Static schema definition IR
├── firestore.rules           --> Production ABAC secure security rules
├── metadata.json             --> AI Studio descriptor configuration
├── package.json              --> Dependencies and esbuild/tsx script binds
├── server.ts                 --> Unified Express + Vite Server Entry point
├── tsconfig.json             --> Global TypeScript config
├── vite.config.ts            --> Vite asset plugins and proxy rules
│
├── /src                      --> React 19 Frontend Codebase
│   ├── types.ts              --> Shared frontend/backend models
│   ├── main.tsx              --> App renderer bootstrapping
│   ├── index.css             --> Global Tailwind CSS v4 styling
│   ├── App.tsx               --> Primary single-screen visual routing
│   ├── architectureData.ts   --> Technical architecture content
│   └── /components           --> Modular components (Charts, Forms, Previews)
│
└── /assets                   --> Public icons, mock images, and illustrations
`
  },
  {
    id: "roadmap",
    title: "9. Development Roadmap",
    shortDesc: "Five strategic phases taking the platform from structural MVP to a scaled global SaaS production release.",
    iconName: "Milestone",
    highlights: [
      "Phase 1: Architecture blueprint design & Interactive UI setup (Completed)",
      "Phase 2: AI-Powered MVP implementation on server-side Gemini 3.5 (Completed)",
      "Phase 3: Database setup & user auth with Firebase Authentication",
      "Phase 4: Advanced models deployment & video/image generation with Veo",
      "Phase 5: Production metrics visualizer & billing integration release"
    ],
    details: "The roadmap follows an iterative development strategy. It prioritizes launching a fully working high-value Core Utility first, which can be shared immediately for customer feedback, before building expensive background persistence pipelines. Once the visual utility is refined, the next iteration implements cloud-persistence database schema constraints and OAuth identity gates, establishing a secure global user network.",
    diagramText: `
[PHASE 1: Blueprint] -----> [PHASE 2: Core AI MVP] -----> [PHASE 3: Database & Auth]
   - Technical Spec            - Express backend proxy       - Firebase SDK Setup
   - Layout Design             - Gemini JSON rendering       - Security Rules deploy
   - Interactive Sandbox       - Saved history cache         - User logs pipeline
                                                                    |
                                                                    v
[PHASE 5: Scale & Sell] <--- [PHASE 4: Media Expansion] <-----------+
   - Stripe integrations        - Veo 3.1 video gen
   - Analytics Dashboard        - Image search context
   - Global multi-tenant        - Voiceover narration
`
  },
  {
    id: "technical-spec-ar",
    title: "10. الهيكل التقني المتكامل (Adremix AI)",
    shortDesc: "وثيقة هندسة الحلول الشاملة لمنصة Adremix AI باللغة العربية تشمل تدفق البيانات والأمان والمكونات.",
    iconName: "ShieldAlert",
    highlights: [
      "الواجهة الأمامية: تصميم Glassmorphic عصري ومستجيب بالكامل باستخدام Tailwind CSS",
      "الخلفية والذكاء الاصطناعي: تكامل Gemini API عبر Express و Firebase Cloud Functions",
      "قاعدة البيانات والمصادقة: هيكلية NoSQL مرنة في Firestore ومصادقة آمنة عبر Firebase Auth",
      "الأمان وإدارة الأسرار: حماية المفاتيح بـ Secret Manager وضوابط وصول صارمة بـ Firestore Rules"
    ],
    details: "تم تصميم منصة Adremix AI لتكون نظاماً متكاملاً فائق الأداء والسرعة، يجمع بين سلاسة الواجهات الرسومية وقوة الحوسبة السحابية اللامركزية. تعتمد المنصة على بنية تحتية خالية من الخوادم التقليدية (Serverless) لتأمين أفضل مستويات التوسع التلقائي وإدارة التكاليف بذكاء.\n\n" +
      "1. الواجهة الأمامية (Tailwind CSS & Glassmorphic UI):\n" +
      "تم بناء واجهة المستخدم باستخدام React 19 و Vite لضمان التحميل الفوري وتجربة استخدام خالية من التأخير. يتميز التصميم بأسلوب Glassmorphic الأنيق الذي يعتمد على لوحات خلفية شبه شفافة ذات تأثير ضبابي (backdrop-blur)، وحواف ناعمة ببريق خفيف، وظلال عميقة تمنح تباينًا مثاليًا في الأوساط المظلمة. تم استخدام Tailwind CSS لصياغة فئات التنسيق المستجيبة، مما يضمن توافق المنصة التام مع الشاشات المكتبية واللوحية والهواتف الذكية دون تكرار للأكواد.\n\n" +
      "2. الخلفية والذكاء الاصطناعي (Express & Firebase Cloud Functions & Gemini API):\n" +
      "تتولى وظائف Firebase Cloud Functions والـ Express API معالجة الطلبات البرمجية الحساسة كحلقة وصل آمنة بين العميل والخدمات الخارجية. يتم دمج نموذج Gemini 3.5 Flash باستخدام حزمة @google/genai TypeScript SDK الرسمية، حيث يتم تمرير التعليمات البرمجية عبر خوادم آمنة تضمن عدم انكشاف مفاتيح الـ API. يلتزم الذكاء الاصطناعي بتقديم مخرجات منظمة في هيئة JSON دقيقة وفقاً لـ responseSchema صارم لضمان توافق البيانات مع الواجهة الأمامية.\n\n" +
      "3. قاعدة البيانات (Cloud Firestore):\n" +
      "تم تصميم قاعدة بيانات Firestore NoSQL لضمان سرعة الاستعلامات وتقليل تكاليف القراءة والكتابة. نعتمد هيكلية فصل البيانات بحيث يتم تخزين الملفات التعريفية للمستخدمين في مجموعة '/users'، وتخزين بيانات الحملات الإعلانية في مجموعة '/campaigns'. ولمنع تجاوز حدود حجم الوثيقة البالغ 1 ميغابايت، يتم تخزين تفاصيل المنصات الإعلانية والمحتوى المبتكر كـ Subcollection مستقل في المسار '/campaigns/{campaignId}/platforms/{platformId}'، مما يسهل الفهرسة والوصول السريع.\n\n" +
      "4. المصادقة (Firebase Authentication):\n" +
      "تعتمد المنصة على Firebase Auth لتوفير نظام تسجيل دخول آمن وموثوق عبر بروتوكول OAuth (مثل حسابات Google). يتم إنشاء جلسات مشفرة تpersistent في indexedDB بالمتصفح، ويتم إرسال رموز التحقق JWT تلقائيًا مع كل طلب إلى Firestore أو خادم الـ API للتحقق من هوية المستخدم وصلاحياته قبل تمكينه من الوصول لأي مورد.\n\n" +
      "5. الأمان (Google Cloud Secret Manager & Firestore Security Rules):\n" +
      "نطبق فلسفة الأمان الصفري (Zero-Trust)؛ حيث يتم الاحتفاظ بجميع المفاتيح الحساسة (مثل GEMINI_API_KEY) داخل Google Cloud Secret Manager واستدعائها ديناميكياً على الخادم فقط. أما على مستوى قاعدة البيانات، تفرض قواعد الأمان (Firestore Rules) ضوابط صارمة عبر قواعد التحقق الثنائية مثل isSignedIn() و isOwner()، إلى جانب استخدام affectedKeys().hasOnly() لمنع تعديل الحقول غير المصرح بها وضمان سلامة ونزاهة البيانات المخزنة.",
    diagramText: `
+-----------------------------------------------------------------------------------+
|                            مخطط تدفق البيانات (Data Flow Diagram)                 |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [المستخدم] --- (تفاعل/مدخلات) ---> [واجهة المستخدم React + Tailwind CSS]           |
|                                         |                                         |
|                                (طلب تسجيل الدخول)                                  |
|                                         v                                         |
|                                [Firebase Auth Popup]                              |
|                                         |                                         |
|                                 (إرجاع رمز JWT)                                   |
|                                         v                                         |
|  [واجهة المستخدم React] -- (إرسال الرمز + المدخلات) --> [الخلفية Express API]       |
|                                                              |                    |
|                                                      (طلب الـ API مفتاح آمن)       |
|                                                              v                    |
|                                                   [Cloud Secret Manager]          |
|                                                              |                    |
|                                                  (إرجاع GEMINI_API_KEY)           |
|                                                              v                    |
|  [الخلفية Express API] --- (طلب مخرجات منظمة JSON) ---> [Gemini API (3.5 Flash)]  |
|                                                              |                    |
|                                                     (إرجاع المحتوى الإعلاني)      |
|                                                              v                    |
|  [واجهة المستخدم React] <--- (تحديث الحالة التفاعلية) <---- [الخلفية Express API]       |
|          |                                                                        |
|    (حفظ البيانات)                                                                 |
|          v                                                                        |
|  [Cloud Firestore] <--- (فحص الصلاحيات الأمنية بـ Firestore Rules)                     |
|                                                                                   |
+-----------------------------------------------------------------------------------+
`
  }
];
