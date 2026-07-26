export type Domain =
  | "Salesforce Fundamentals"
  | "Data Modeling and Management"
  | "Business Logic and Process Automation"
  | "User Interface"
  | "App Deployment";

export type Question = {
  id: string;
  domain: Domain;
  topic: string;
  prompt: string;
  options: string[];
  answers: number[];
  explanation: string;
};

export const domainWeights: Record<Domain, number> = {
  "Salesforce Fundamentals": 23,
  "Data Modeling and Management": 22,
  "Business Logic and Process Automation": 28,
  "User Interface": 17,
  "App Deployment": 10,
};

export const domainShortNames: Record<Domain, string> = {
  "Salesforce Fundamentals": "Fundamentals",
  "Data Modeling and Management": "Data Modeling",
  "Business Logic and Process Automation": "Automation",
  "User Interface": "User Interface",
  "App Deployment": "Deployment",
};

export const questions: Question[] = [
  {
    id: "fund-sharing-hierarchy",
    domain: "Salesforce Fundamentals",
    topic: "Record access",
    prompt:
      "Case organization-wide defaults are Private. Admissions managers must automatically see Cases owned by every recruiter below them, while peer recruiters must not see one another's Cases. What should the app builder configure?",
    options: [
      "A criteria-based sharing rule",
      "The role hierarchy",
      "A public group",
      "Manual sharing",
    ],
    answers: [1],
    explanation:
      "The role hierarchy opens record access upward to managers while keeping peer access private. A public group only collects users; it does not grant access by itself.",
  },
  {
    id: "fund-permissions-additive",
    domain: "Salesforce Fundamentals",
    topic: "Object and field access",
    prompt:
      "A user has Read access to Applicant__c but cannot see SSN__c. Which two configurations could explain this?",
    options: [
      "The user's profile does not grant field visibility and no permission set grants it",
      "A second permission set explicitly denies access to SSN__c",
      "The field is absent from the page layout, which removes API access",
      "The assigned permission sets do not grant Read access to SSN__c",
    ],
    answers: [0, 3],
    explanation:
      "Field-level security must grant visibility through the profile or a permission set. Permission sets are additive and cannot explicitly deny access. Page layouts affect the interface, not field-level API security.",
  },
  {
    id: "fund-report-folders",
    domain: "Salesforce Fundamentals",
    topic: "Reports and dashboards",
    prompt:
      "A manager can run reports on Opportunity but cannot open a dashboard stored in a private dashboard folder. What is the most direct fix?",
    options: [
      "Grant View All on Opportunity",
      "Share the dashboard folder with the manager",
      "Add the manager to the role hierarchy",
      "Change the dashboard running user",
    ],
    answers: [1],
    explanation:
      "Folder sharing controls access to the dashboard asset. Record access and the running user affect the data shown only after the user can open the dashboard.",
  },
  {
    id: "fund-declarative-boundary",
    domain: "Salesforce Fundamentals",
    topic: "Declarative versus programmatic",
    prompt:
      "A requirement needs a highly specialized transaction that processes thousands of related records with complex error recovery that standard Flow controls cannot meet. What should the app builder recommend?",
    options: [
      "A formula field",
      "A validation rule",
      "Programmatic customization",
      "A compact layout",
    ],
    answers: [2],
    explanation:
      "App builders must recognize the boundary of declarative tools. Complex high-volume transaction control and specialized recovery are appropriate reasons to involve code.",
  },
  {
    id: "fund-case-assignment",
    domain: "Salesforce Fundamentals",
    topic: "Standard objects",
    prompt:
      "New Cases submitted from an online form must be routed to different queues based on the selected campus. Which standard capability is designed for this?",
    options: [
      "Case assignment rules",
      "Lead auto-response rules",
      "Escalation rules",
      "Territory management",
    ],
    answers: [0],
    explanation:
      "Case assignment rules route new Cases to users or queues using criteria. Escalation rules address Cases that remain unresolved for specified periods.",
  },
  {
    id: "fund-custom-permission",
    domain: "Salesforce Fundamentals",
    topic: "Custom permissions",
    prompt:
      "A validation rule should be bypassed only for a small, changing group of trained users. What is the most maintainable design?",
    options: [
      "Hard-code the users' IDs in the formula",
      "Reference a custom permission and grant it with a permission set",
      "Give the users Modify All Data",
      "Create a separate profile for every trained user",
    ],
    answers: [1],
    explanation:
      "A custom permission can be referenced in the validation rule and granted through a permission set. This avoids hard-coded identities and excessive system access.",
  },
  {
    id: "data-master-detail",
    domain: "Data Modeling and Management",
    topic: "Object relationships",
    prompt:
      "An Application has multiple Application Items. The parent must show a standard roll-up count, and deleting the Application should delete its items. Which relationship should be used?",
    options: ["Lookup", "Master-detail", "External lookup", "Hierarchical"],
    answers: [1],
    explanation:
      "Master-detail supports native roll-up summary fields and cascade deletion. A lookup relationship does not provide both behaviors by default.",
  },
  {
    id: "data-external-object",
    domain: "Data Modeling and Management",
    topic: "External data",
    prompt:
      "Users need to view current student records stored in another system without copying those records into Salesforce. What should the app builder primarily consider?",
    options: [
      "A custom object populated nightly",
      "An external object",
      "A Big Object",
      "A platform event",
    ],
    answers: [1],
    explanation:
      "External objects represent data that remains outside Salesforce and is accessed when needed. A custom object would store a copied version of the data.",
  },
  {
    id: "data-field-type-change",
    domain: "Data Modeling and Management",
    topic: "Field types",
    prompt:
      "Before changing a populated custom field from Text to Picklist, what should the app builder do first?",
    options: [
      "Delete all reports that use the field",
      "Evaluate existing data, integrations, formulas, and automation that reference the field",
      "Convert the field directly because custom field changes never affect data",
      "Create a sharing rule for the new values",
    ],
    answers: [1],
    explanation:
      "Field-type changes can affect stored values and dependent configuration. The app builder should assess data conversion and every dependency before making the change.",
  },
  {
    id: "data-import-upsert",
    domain: "Data Modeling and Management",
    topic: "Data import",
    prompt:
      "A nightly file must update existing applicant records and insert new ones without relying on Salesforce record IDs. What should be configured?",
    options: [
      "An External ID field used for upsert",
      "A roll-up summary field",
      "A record type",
      "A duplicate report only",
    ],
    answers: [0],
    explanation:
      "Upsert can match records using an External ID, updating matches and inserting nonmatches. A duplicate report identifies possible duplicates but does not provide the matching key for upsert.",
  },
  {
    id: "data-junction-object",
    domain: "Data Modeling and Management",
    topic: "Many-to-many relationships",
    prompt:
      "One Student can join many Programs, and each Program can have many Students. The organization must store an Enrollment Status for each pairing. What is the best model?",
    options: [
      "A single lookup field on Student",
      "A junction object with relationships to Student and Program",
      "A multi-select picklist on Program",
      "A formula field on Student",
    ],
    answers: [1],
    explanation:
      "A junction object models the many-to-many relationship and gives the pairing its own fields, such as Enrollment Status.",
  },
  {
    id: "auto-before-save",
    domain: "Business Logic and Process Automation",
    topic: "Record-triggered Flow",
    prompt:
      "When an Application is saved, Review Status must be derived immediately from values on that same record. No related records need to change. Which automation is generally most efficient?",
    options: [
      "An after-save record-triggered flow",
      "A before-save record-triggered flow",
      "A scheduled flow",
      "An approval process",
    ],
    answers: [1],
    explanation:
      "A before-save flow is optimized for updating fields on the triggering record before it is committed. After-save is appropriate when related records or post-save actions are required.",
  },
  {
    id: "auto-approval",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "Applications requesting an exception require a director's decision. While awaiting that decision, the record should be locked and the decision history retained. What is the best declarative solution?",
    options: [
      "A validation rule",
      "An approval process",
      "A screen flow",
      "An escalation rule",
    ],
    answers: [1],
    explanation:
      "Approval processes provide submission, assigned approvers, record locking, approval history, and approval or rejection actions.",
  },
  {
    id: "auto-validation-rule",
    domain: "Business Logic and Process Automation",
    topic: "Validation rules",
    prompt:
      "An Application cannot be marked Complete unless Decision Date has a value. Users should receive an error immediately when they try to save invalid data. What should be used?",
    options: [
      "A validation rule",
      "A scheduled flow",
      "An assignment rule",
      "A roll-up summary field",
    ],
    answers: [0],
    explanation:
      "A validation rule blocks the save and presents an error when the stated data condition is not met.",
  },
  {
    id: "auto-rollup-limit",
    domain: "Business Logic and Process Automation",
    topic: "Roll-up summaries",
    prompt:
      "An app builder needs a standard roll-up summary on a parent, but the child uses a lookup relationship. What is the key limitation?",
    options: [
      "Standard roll-up summaries require a master-detail relationship",
      "Roll-up summaries work only on standard objects",
      "Roll-up summaries cannot count child records",
      "Lookup relationships always cascade delete children",
    ],
    answers: [0],
    explanation:
      "Native roll-up summary fields operate across master-detail relationships. A lookup-based total requires another design, such as Flow or code, or a relationship change if appropriate.",
  },
  {
    id: "auto-scheduled-path",
    domain: "Business Logic and Process Automation",
    topic: "Scheduled automation",
    prompt:
      "Three days after an Application's Due Date, create a follow-up task if the Application is still incomplete. Which Flow capability best fits?",
    options: [
      "A scheduled path on a record-triggered flow",
      "A before-save update",
      "A formula field only",
      "A Case escalation rule",
    ],
    answers: [0],
    explanation:
      "A scheduled path runs relative to a date or time on the record and can reevaluate the record before performing the follow-up action.",
  },
  {
    id: "auto-formula-cross-object",
    domain: "Business Logic and Process Automation",
    topic: "Formula fields",
    prompt:
      "A formula on a child record displays a value from its parent. What happens when the parent value changes?",
    options: [
      "The child retains the old calculated value",
      "The formula displays the newly calculated value without storing a copied value",
      "Every child must be updated by Flow",
      "The formula changes only after each child is edited",
    ],
    answers: [1],
    explanation:
      "Formula fields are calculated when evaluated. A cross-object formula reflects the current referenced value rather than storing a separate snapshot on every child.",
  },
  {
    id: "auto-avoid-recursion",
    domain: "Business Logic and Process Automation",
    topic: "Automation design",
    prompt:
      "A record-triggered flow updates the same object and repeatedly retriggers itself. Which design change most directly reduces this risk?",
    options: [
      "Remove all entry criteria",
      "Use precise entry conditions and update only when relevant values change",
      "Convert every field to Text",
      "Add a dashboard filter",
    ],
    answers: [1],
    explanation:
      "Tight entry conditions and change checks prevent the automation from running again when its own update does not represent a new qualifying change.",
  },
  {
    id: "ui-record-types-layouts",
    domain: "User Interface",
    topic: "Record types and layouts",
    prompt:
      "Recruiters and managers use the same object but need different picklist values and different arrangements of fields. Which two features should be used?",
    options: [
      "Record types",
      "Page layouts",
      "Compact layouts",
      "Permission set groups",
    ],
    answers: [0, 1],
    explanation:
      "Record types control available business processes and picklist values. Page-layout assignments control the arrangement and related lists presented to different record type and profile combinations.",
  },
  {
    id: "ui-app-activation",
    domain: "User Interface",
    topic: "Lightning App Builder",
    prompt:
      "A Lightning record page should appear only in the Admissions Console app, while the standard page remains in other apps. What should the app builder use?",
    options: [
      "Page-layout assignment",
      "Lightning page activation with an app assignment",
      "Record-type assignment",
      "A compact layout",
    ],
    answers: [1],
    explanation:
      "Lightning page activation can assign a record page as the app default. Page layouts govern record details and actions, not the app-specific Lightning page container.",
  },
  {
    id: "ui-quick-action",
    domain: "User Interface",
    topic: "Actions",
    prompt:
      "Users need a prominent action on an Applicant record that creates a related Interaction and automatically relates it to the Applicant. What is the best declarative option?",
    options: [
      "An object-specific Create a Record quick action",
      "A global action with no predefined values",
      "A compact layout",
      "A report chart",
    ],
    answers: [0],
    explanation:
      "An object-specific action has context for the current record and can create a related record with the relationship populated.",
  },
  {
    id: "ui-dynamic-forms",
    domain: "User Interface",
    topic: "Dynamic Forms",
    prompt:
      "A section of fields should appear on a Lightning record page only when Application Type is International. What should the app builder consider first?",
    options: [
      "Dynamic Forms visibility rules",
      "A sharing rule",
      "An External ID",
      "A sandbox template",
    ],
    answers: [0],
    explanation:
      "Dynamic Forms can conditionally show field sections based on record criteria. This is an interface behavior, not a record-access rule.",
  },
  {
    id: "deploy-full-sandbox",
    domain: "App Deployment",
    topic: "Sandbox types",
    prompt:
      "A team needs a testing environment containing a complete copy of production data for final staging and performance testing. Which sandbox is the best fit?",
    options: ["Developer", "Developer Pro", "Partial Copy", "Full"],
    answers: [3],
    explanation:
      "A Full sandbox contains a complete copy of production metadata and data and is intended for staging, performance testing, and similar full-scale validation.",
  },
  {
    id: "deploy-change-set",
    domain: "App Deployment",
    topic: "Change sets",
    prompt:
      "An outbound change set was uploaded to production, but a required custom field was omitted. What should the app builder do?",
    options: [
      "Edit the uploaded change set in production",
      "Clone or create a new outbound change set in the source org, add the dependency, and upload it",
      "Delete the production organization",
      "Convert the change set to a managed package automatically",
    ],
    answers: [1],
    explanation:
      "An uploaded outbound change set cannot simply be edited in the target. Correct the component set in the source organization and upload a new change set.",
  },
  {
    id: "deploy-packaging",
    domain: "App Deployment",
    topic: "Packages",
    prompt:
      "A vendor plans to distribute an upgradeable application to many customer organizations while protecting its intellectual property. What should it consider?",
    options: [
      "A managed package",
      "An unmanaged package",
      "A private report folder",
      "A Developer sandbox",
    ],
    answers: [0],
    explanation:
      "Managed packages support versioned upgrades and provide protections suited to distributing an application. Unmanaged packages are more appropriate for sharing editable templates or components.",
  },
];

