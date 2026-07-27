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
  {
    id: "fund-wfr-pb-retirement",
    domain: "Salesforce Fundamentals",
    topic: "Declarative boundaries",
    prompt:
      "An org still runs several active workflow rules and processes. Which two statements describe what an app builder can do with them today?",
    options: [
      "Existing active workflow rules and processes keep running and can be edited, activated, or deactivated",
      "New workflow rules and processes can still be created in any production org",
      "Creating new workflow rules and processes is blocked, except in Developer Edition orgs for use in managed packages",
      "The Migrate to Flow tool converts Apex triggers into record-triggered flows",
    ],
    answers: [0, 2],
    explanation:
      "Salesforce blocked the creation of new workflow rules in Winter '23 and new processes in Summer '23, leaving creation available only in Developer Edition orgs for managed packages. Anything already in the org continues to run and remains editable. The Migrate to Flow tool converts workflow rules and processes, not Apex triggers.",
  },
  {
    id: "fund-declarative-advantages",
    domain: "Salesforce Fundamentals",
    topic: "Declarative boundaries",
    prompt:
      "A team is deciding between a declarative build and an Apex build. Which two are recognized advantages of the declarative approach?",
    options: [
      "It is generally faster to deliver and requires less ongoing maintenance",
      "It automatically picks up platform upgrades with each Salesforce release",
      "It removes the need to test the solution before deployment",
      "It allows unlimited SOQL queries inside a single transaction",
    ],
    answers: [0, 1],
    explanation:
      "Declarative configuration is cheaper and faster to build, needs less maintenance, and inherits improvements automatically at each release. It still has to be tested, and it does not grant any escape from platform transaction limits.",
  },
  {
    id: "fund-custom-web-service",
    domain: "Salesforce Fundamentals",
    topic: "Programmatic use cases",
    prompt:
      "An external system must call into Salesforce through a custom web service endpoint that the org defines itself. What should the app builder recommend?",
    options: [
      "Build the service with Apex",
      "Configure it with Flow Builder",
      "Create an external object",
      "Add a custom formula field",
    ],
    answers: [0],
    explanation:
      "Exposing a custom web service is one of the few requirements with no declarative option at all. Custom web services require Apex.",
  },
  {
    id: "fund-inbound-email-apex",
    domain: "Salesforce Fundamentals",
    topic: "Programmatic use cases",
    prompt:
      "Inbound email must be parsed for attachments and routed using logic that standard Email-to-Case settings cannot express. What is required?",
    options: [
      "An Apex email service handler",
      "A validation rule on Case",
      "An assignment rule",
      "A quick action on Case",
    ],
    answers: [0],
    explanation:
      "Email-to-Case handles standard routing through configuration. Once the processing logic exceeds what those settings support, an Apex email handler is required.",
  },
  {
    id: "fund-extend-org-options",
    domain: "Salesforce Fundamentals",
    topic: "Extending the org",
    prompt:
      "A business need cannot be met by standard functionality. Which three routes are available for extending Salesforce?",
    options: [
      "Configure it with declarative tools from the Setup menu",
      "Buy and install a package from the AppExchange",
      "Build it with programmatic tools",
      "Ask Salesforce Support to add the feature to the org",
    ],
    answers: [0, 1, 2],
    explanation:
      "The three options are configure, buy, and build. Support does not add custom functionality to an org on request.",
  },
  {
    id: "fund-override-standard-action",
    domain: "Salesforce Fundamentals",
    topic: "Programmatic use cases",
    prompt:
      "A standard action must be overridden in Lightning Experience with custom client-side behavior, and the result must not fall back to the Salesforce Classic visual design. What should be used?",
    options: [
      "A custom Lightning component built with LWC or Aura",
      "A Visualforce page",
      "A custom link",
      "A page layout override",
    ],
    answers: [0],
    explanation:
      "Custom Lightning components are the right tool for overriding standard actions and invoking client-side logic in Lightning Experience. Visualforce retains the Classic look and feel, which is why it is the wrong answer when the requirement calls out Lightning styling.",
  },
  {
    id: "fund-complex-report-boundary",
    domain: "Salesforce Fundamentals",
    topic: "Declarative boundaries",
    prompt:
      "A reporting requirement cannot be expressed in the standard report builder. What is the appropriate next step?",
    options: [
      "Build the report presentation with Visualforce or a custom Lightning component backed by Apex",
      "Create a new report type and try again",
      "Grant the running user View All Data",
      "Convert the report folder to public",
    ],
    answers: [0],
    explanation:
      "Report types and folder sharing address which data and which users a report reaches, not the limits of the report builder itself. When the requirement exceeds those limits, the reporting interface has to be built programmatically.",
  },
  {
    id: "fund-callout-boundary",
    domain: "Salesforce Fundamentals",
    topic: "Declarative boundaries",
    prompt:
      "An org needs to consume an external HTTP web service. Which statement best describes the boundary between the declarative and programmatic options?",
    options: [
      "Flow Builder can consume a straightforward service, but complex request or response logic requires Apex",
      "All HTTP callouts require Apex without exception",
      "All HTTP callouts can be handled declaratively without exception",
      "HTTP callouts are only possible from a managed package",
    ],
    answers: [0],
    explanation:
      "Consuming a web service is a good example of a shifting boundary: Flow Builder covers the simple case, and Apex takes over once the logic around the callout becomes complex. Providing a custom web service, by contrast, always requires Apex.",
  },
  {
    id: "auto-rollup-max-count",
    domain: "Business Logic and Process Automation",
    topic: "Roll-up summaries",
    prompt:
      "An object already carries 25 roll-up summary fields and the business needs more. What is true?",
    options: [
      "25 is the default maximum, and Salesforce Support can raise it to 40",
      "25 is a hard limit that cannot be raised under any circumstances",
      "The limit is per relationship, so a new master-detail relationship resets it",
      "The limit only applies to custom objects",
    ],
    answers: [0],
    explanation:
      "The default ceiling is 25 roll-up summary fields per object, and Salesforce Support can increase it to a maximum of 40.",
  },
  {
    id: "auto-rollup-blocks-conversion",
    domain: "Business Logic and Process Automation",
    topic: "Roll-up summaries",
    prompt:
      "An app builder tries to convert a master-detail relationship to a lookup relationship and the change is rejected. The parent object has a roll-up summary field over the child. What explains the failure?",
    options: [
      "A roll-up summary field on the parent prevents converting master-detail to lookup",
      "Master-detail relationships can never be converted to lookup relationships",
      "The child object has too many records to allow conversion",
      "Conversion requires the parent object to have no page layouts",
    ],
    answers: [0],
    explanation:
      "Roll-up summary fields depend on the master-detail relationship. While one exists on the parent, the relationship cannot be converted to lookup. Removing the roll-up summary field first allows the conversion.",
  },
  {
    id: "auto-rollup-field-type-matrix",
    domain: "Business Logic and Process Automation",
    topic: "Roll-up summaries",
    prompt:
      "Which two statements correctly describe which field types each roll-up type supports?",
    options: [
      "SUM supports number, currency, and percent fields",
      "MIN and MAX additionally support date and date/time fields",
      "SUM supports date fields so that durations can be totaled",
      "COUNT requires a numeric field to be selected on the child object",
    ],
    answers: [0, 1],
    explanation:
      "SUM is limited to number, currency, and percent. MIN and MAX accept those same types plus date and date/time. COUNT selects no field at all — it simply counts related records.",
  },
  {
    id: "auto-rollup-date-min-max",
    domain: "Business Logic and Process Automation",
    topic: "Roll-up summaries",
    prompt:
      "An Account must display the date of its earliest related Opportunity. Which roll-up type over the Opportunity created date returns it?",
    options: [
      "MIN",
      "MAX",
      "SUM",
      "COUNT",
    ],
    answers: [0],
    explanation:
      "Over a date or date/time field, MIN returns the oldest value and MAX returns the most recent. Earliest means MIN — a pairing that is easy to invert under exam pressure.",
  },
  {
    id: "auto-rollup-formula-restrictions",
    domain: "Business Logic and Process Automation",
    topic: "Roll-up summaries",
    prompt:
      "Which two kinds of field cannot be summarized by a roll-up summary field?",
    options: [
      "A formula field that references a field on another object",
      "A formula field that uses dynamic date functions such as TODAY() or NOW()",
      "A currency field on the child object",
      "A percent field on the child object",
    ],
    answers: [0, 1],
    explanation:
      "Cross-object formula references and formulas containing dynamic date functions are both excluded from roll-up summaries. Plain currency and percent fields are valid SUM targets. Autonumber fields are also excluded.",
  },
  {
    id: "auto-rollup-autonumber",
    domain: "Business Logic and Process Automation",
    topic: "Roll-up summaries",
    prompt:
      "An app builder wants a roll-up summary over an Autonumber field on the child object. What happens?",
    options: [
      "Autonumber fields cannot be summarized by a roll-up summary field",
      "It works, but only with the COUNT roll-up type",
      "It works and returns the highest sequence issued",
      "It works only if the Autonumber field has no display format",
    ],
    answers: [0],
    explanation:
      "Autonumber is not a valid field to summarize. To count child records, use the COUNT roll-up type, which needs no field selected.",
  },
  {
    id: "auto-rollup-standard-relationships",
    domain: "Business Logic and Process Automation",
    topic: "Roll-up summaries",
    prompt:
      "Roll-up summary fields are supported on a limited set of standard relationships. Which three are supported?",
    options: [
      "Account summarizing Opportunity records",
      "Opportunity summarizing Opportunity Product records",
      "Campaign summarizing Campaign Member records",
      "Contact summarizing Case records",
    ],
    answers: [0, 1, 2],
    explanation:
      "Account/Opportunity, Opportunity/Opportunity Product, and Campaign/Campaign Member behave as master-detail for this purpose. Contact to Case is a lookup relationship and is not supported.",
  },
  {
    id: "auto-rollup-error-location",
    domain: "Business Logic and Process Automation",
    topic: "Roll-up summaries",
    prompt:
      "A validation rule references a roll-up summary field and the app builder wants the error to appear on that field. What is the constraint?",
    options: [
      "A roll-up summary field cannot be selected as the Error Location field",
      "Roll-up summary fields cannot be referenced by validation rules at all",
      "The validation rule must be moved to the child object",
      "The error location must always be set to the record header",
    ],
    answers: [0],
    explanation:
      "A validation rule can reference a roll-up summary field in its formula, but the field cannot be chosen as the Error Location. The error has to surface at the top of the page instead.",
  },
  {
    id: "auto-rollup-lookup-workaround",
    domain: "Business Logic and Process Automation",
    topic: "Roll-up summaries",
    prompt:
      "A total must be maintained on a parent record, but the child is related through a custom lookup relationship. Which two approaches are appropriate?",
    options: [
      "Use Flow Builder to calculate and write the total to the parent",
      "Install a third-party roll-up tool from the AppExchange",
      "Create a standard roll-up summary field on the parent",
      "Add a cross-object formula field on the parent that sums the children",
    ],
    answers: [0, 1],
    explanation:
      "Native roll-up summary fields require master-detail, so a lookup relationship needs another mechanism: Flow, an Apex trigger, batch or scheduled Apex, or an AppExchange tool. A cross-object formula can reference a parent from a child, but it cannot aggregate children onto a parent.",
  },
  {
    id: "fund-owd-campaign-member",
    domain: "Salesforce Fundamentals",
    topic: "Sharing and visibility",
    prompt:
      "Marketing users should see only the campaign members whose related contact or lead records they can already access. Which organization-wide default on Campaign Member achieves this?",
    options: [
      "Controlled by Campaign Member",
      "Controlled by Campaign",
      "Private",
      "Public Read Only",
    ],
    answers: [0],
    explanation:
      "Campaign Member has two special organization-wide defaults. 'Controlled by Campaign Member' ties visibility to the underlying contact or lead record. 'Controlled by Campaign' instead ties it to access on the parent campaign. The pair is easy to confuse and is exactly what gets tested.",
  },
  {
    id: "fund-owd-controlled-by-campaign",
    domain: "Salesforce Fundamentals",
    topic: "Sharing and visibility",
    prompt:
      "Users should be able to open a campaign member record only when they have access to the related campaign, and one public group needs access to all campaign members regardless. What should be configured?",
    options: [
      "Set the Campaign Member organization-wide default to 'Controlled by Campaign', then add a sharing rule for the public group",
      "Set the Campaign Member organization-wide default to 'Controlled by Campaign Member'",
      "Set the Campaign Member organization-wide default to Private and rely on the role hierarchy",
      "Grant the public group View All Data",
    ],
    answers: [0],
    explanation:
      "'Controlled by Campaign' derives access from the parent campaign. The broader group access is then layered on with a sharing rule, since organization-wide defaults set the baseline and sharing opens it up.",
  },
  {
    id: "fund-sharing-rules-cannot-restrict",
    domain: "Salesforce Fundamentals",
    topic: "Sharing and visibility",
    prompt:
      "An administrator wants to use a sharing rule to take access away from a group of users who currently have it. What is the outcome?",
    options: [
      "Sharing rules only open access up; they cannot restrict it",
      "The sharing rule removes access as long as it is criteria-based",
      "The sharing rule removes access only for users below in the role hierarchy",
      "The sharing rule removes access once the organization-wide default is Public Read/Write",
    ],
    answers: [0],
    explanation:
      "Sharing rules — whether owner-based or criteria-based — can only grant additional access. Restricting access means tightening the organization-wide default, since that is what sets the baseline.",
  },
  {
    id: "fund-role-hierarchy-vertical",
    domain: "Salesforce Fundamentals",
    topic: "Sharing and visibility",
    prompt:
      "Two sales reps hold the same role and cannot see one another's records. Their shared manager can see both. Which statement explains this?",
    options: [
      "The role hierarchy grants access vertically to users above, not horizontally between peers",
      "The role hierarchy grants access to every user assigned the same role",
      "Peer access requires the organization-wide default to be Private",
      "Manual sharing is required before a manager can see a subordinate's records",
    ],
    answers: [0],
    explanation:
      "Access flows up the hierarchy: a user above sees records owned by or shared with users below. It never flows sideways between peers. Sharing records across peers needs a sharing rule or manual sharing.",
  },
  {
    id: "fund-manual-sharing-when",
    domain: "Salesforce Fundamentals",
    topic: "Sharing and visibility",
    prompt:
      "Access to a handful of individual records must be granted where no consistent rule can describe the users or the record criteria. Which two statements are correct?",
    options: [
      "Manual sharing is the appropriate mechanism",
      "It can be performed by the record owner or a user with full access",
      "It can be performed by any user who can view the record",
      "It grants access to every record matching the same criteria",
    ],
    answers: [0, 1],
    explanation:
      "Manual sharing exists precisely for the case where a rule cannot be defined. Only the record owner, or someone with full access, can share a record that way — and it applies to that single record, not a matching set.",
  },
  {
    id: "fund-fls-vs-page-layout",
    domain: "Salesforce Fundamentals",
    topic: "Object and field access",
    prompt:
      "A field was removed from the page layout, but users can still reach its value through reports and the API. Why?",
    options: [
      "Page layouts control the interface; field-level security controls actual access",
      "Removing a field from a layout takes up to 24 hours to apply",
      "Reports always bypass field-level security",
      "The field must also be deleted from the object to hide it",
    ],
    answers: [0],
    explanation:
      "Page layout changes only affect what the record page displays. To genuinely restrict a field, set field-level security. This distinction is a reliable source of exam questions.",
  },
  {
    id: "fund-permission-set-over-profile",
    domain: "Salesforce Fundamentals",
    topic: "Object and field access",
    prompt:
      "A small group of users needs one extra permission that their profile does not grant. What is the recommended approach?",
    options: [
      "Assign a permission set that grants the additional permission",
      "Clone the profile and add the permission to the clone",
      "Modify the standard profile directly",
      "Move the users higher in the role hierarchy",
    ],
    answers: [0],
    explanation:
      "Permission sets are the recommended way to extend access to a subset of users without proliferating custom profiles. Standard profiles cannot be edited directly in any case.",
  },
  {
    id: "fund-restricted-profile-cloning",
    domain: "Salesforce Fundamentals",
    topic: "Object and field access",
    prompt:
      "Which setting ensures that a cloned profile only enables permissions that are actually available to the org?",
    options: [
      "Restricted Profile Cloning, in User Management Settings",
      "Enhanced Profile List Views",
      "Restricted Login Hours",
      "Field-Level Security Inheritance",
    ],
    answers: [0],
    explanation:
      "Restricted Profile Cloning is enabled in User Management Settings. It prevents a clone from carrying permissions the org itself does not have available.",
  },
  {
    id: "fund-action-update-record",
    domain: "Salesforce Fundamentals",
    topic: "Mobile actions",
    prompt:
      "An action must let users update fields on the record they are currently viewing. Which type of action supports this?",
    options: [
      "An object-specific action",
      "A global action",
      "A standard publisher action",
      "A productivity action",
    ],
    answers: [0],
    explanation:
      "Update a Record is only available as an object-specific action, because a global action has no automatic relationship to any record and therefore nothing to update. This is the cleanest way to tell the two apart.",
  },
  {
    id: "fund-global-vs-object-action",
    domain: "Salesforce Fundamentals",
    topic: "Mobile actions",
    prompt:
      "Which two statements correctly distinguish global actions from object-specific actions?",
    options: [
      "A global action creates a record with no automatic relationship to any other record",
      "An object-specific action creates records automatically associated with the related record",
      "A global action is configured on the object's page layout editor",
      "An object-specific action can only be used in Salesforce Classic",
    ],
    answers: [0, 1],
    explanation:
      "Global actions are defined in Setup > Global Actions and produce standalone records. Object-specific actions live in the object's page layout and associate what they create with the parent record.",
  },
  {
    id: "fund-action-types-flow-lwc",
    domain: "Salesforce Fundamentals",
    topic: "Mobile actions",
    prompt:
      "A quick action needs to launch a flow. Where can it be configured?",
    options: [
      "As an object-specific action",
      "As a global action",
      "As a standard publisher action",
      "As a mobile smart action",
    ],
    answers: [0],
    explanation:
      "Object-specific actions support the widest set of types, including flow, Update a Record, and Lightning web components. Global action types cover Create a Record, Send Email, Log a Call, custom Visualforce, custom canvas, and Aura components.",
  },
  {
    id: "fund-global-publisher-layout",
    domain: "Salesforce Fundamentals",
    topic: "Mobile actions",
    prompt:
      "An object's page layout has not been customized with actions. Which two statements are true?",
    options: [
      "The record page inherits its actions from the global publisher layout",
      "Adding object-specific actions requires ticking 'Override global publisher layout'",
      "The record page displays no actions at all until one is added",
      "Global publisher layouts are assigned per role",
    ],
    answers: [0, 1],
    explanation:
      "Uncustomized object pages inherit the global publisher layout. To replace that inheritance with your own actions, the override option must be selected. Global publisher layouts are assigned by profile, not by role.",
  },
  {
    id: "fund-mobile-smart-actions",
    domain: "Salesforce Fundamentals",
    topic: "Mobile actions",
    prompt:
      "Which statement describes mobile smart actions?",
    options: [
      "They are preconfigured, appear as a single element in the page layout editor, and display only in the Salesforce mobile app",
      "They are custom actions that must be built individually per object",
      "They replace the global publisher layout entirely",
      "They are available only in Salesforce Classic on the desktop",
    ],
    answers: [0],
    explanation:
      "Mobile smart actions bundle a preconfigured set — for Account, things like New Task, New Contact, New Opportunity — into one element in the layout editor, and they render only in the mobile app.",
  },
  {
    id: "fund-chatter-feed-tracking-limit",
    domain: "Salesforce Fundamentals",
    topic: "Chatter",
    prompt:
      "How many fields per object can have feed tracking enabled?",
    options: [
      "Up to 20",
      "Up to 10",
      "Up to 25",
      "Unlimited",
    ],
    answers: [0],
    explanation:
      "Feed tracking can be enabled for standard and custom objects, covering up to 20 fields on each. Standard publisher actions such as Post, File, and Link also depend on feed tracking being enabled per object.",
  },
  {
    id: "fund-chatter-broadcast-group",
    domain: "Salesforce Fundamentals",
    topic: "Chatter",
    prompt:
      "Only a group's owner and managers should be able to create posts, while members can still reply. What should be configured?",
    options: [
      "Mark the group as a broadcast group",
      "Make the group private",
      "Make the group unlisted",
      "Remove post permissions from each member individually",
    ],
    answers: [0],
    explanation:
      "Broadcast is a setting layered on top of the group type — public, private, or unlisted groups can all be marked as broadcast. It restricts posting to the owner and managers while leaving members able to respond. Privacy level is a separate question from who may post.",
  },
  {
    id: "fund-chatter-private-group-access",
    domain: "Salesforce Fundamentals",
    topic: "Chatter",
    prompt:
      "Who can see and add posts to the feed of a private Chatter group?",
    options: [
      "The system administrator, group members, and users with View All Data",
      "Any user in the org who searches for the group",
      "Only the group owner",
      "All users holding the same profile as the group owner",
    ],
    answers: [0],
    explanation:
      "Joining a private group requires the owner's permission, and feed visibility is limited to members, the system administrator, and users with View All Data.",
  },
  {
    id: "fund-chatter-license-limits",
    domain: "Salesforce Fundamentals",
    topic: "Chatter",
    prompt:
      "Which two statements about Chatter-specific licenses are correct?",
    options: [
      "Chatter Free users can access Chatter items but no Salesforce objects or data",
      "Chatter External is for collaborating with users outside the company's email domain, in invited groups only",
      "Chatter Free users can view tabs like other Salesforce users",
      "Chatter External users have full read access to Accounts and Contacts",
    ],
    answers: [0, 1],
    explanation:
      "Chatter Free grants feeds, people, groups, and files but no object data, and those users see no tabs. Chatter External is scoped to customers outside the email domain and only within groups they are invited to.",
  },
  {
    id: "fund-chatter-license-conversion",
    domain: "Salesforce Fundamentals",
    topic: "Chatter",
    prompt:
      "Which statement about converting Chatter licenses is correct?",
    options: [
      "A Chatter Free license can be upgraded to standard Salesforce or Chatter Only, but the reverse conversion is not allowed",
      "Any license can be converted to any other license at will",
      "A standard Salesforce license can be downgraded to Chatter Free to save cost",
      "Chatter Only licenses cannot be changed once assigned",
    ],
    answers: [0],
    explanation:
      "Upgrades from Chatter Free are permitted at any time. Administrators cannot convert a standard Salesforce or Chatter Only license down to Chatter Free — the restriction runs one way.",
  },
  {
    id: "fund-chatter-post-security",
    domain: "Salesforce Fundamentals",
    topic: "Chatter",
    prompt:
      "What determines whether a user can see a particular Chatter post?",
    options: [
      "Access to the underlying record or to the group where it was posted",
      "The poster's profile",
      "The organization-wide default for the Chatter object",
      "Whether the user follows the person who posted",
    ],
    answers: [0],
    explanation:
      "Chatter does not introduce a separate sharing model. Post visibility follows the access a user already has to the record or the group.",
  },
  {
    id: "fund-chatter-automated-posts",
    domain: "Salesforce Fundamentals",
    topic: "Chatter",
    prompt:
      "A record-triggered flow must post to Chatter automatically. Which three destinations are supported?",
    options: [
      "A specific Chatter user's feed",
      "A specific Chatter group's feed",
      "The feed of the record that triggered the flow",
      "The personal email digest of every user in the org",
    ],
    answers: [0, 1, 2],
    explanation:
      "Flow Builder can post to a user, a group, or the triggering record's own feed. Users and groups are mentioned by referencing their ID in the message.",
  },
  {
    id: "data-lead-conversion-targets",
    domain: "Data Modeling and Management",
    topic: "Leads",
    prompt:
      "A lead is converted. Which records result?",
    options: [
      "An account and a contact, plus an opportunity only if one is chosen",
      "An account, a contact, and an opportunity, always",
      "A contact and an opportunity only",
      "An account only, with the contact created separately afterward",
    ],
    answers: [0],
    explanation:
      "Conversion always produces an account and a contact, but the opportunity is optional — the single most-tested fact about leads. Existing accounts and contacts can be selected instead of creating new ones.",
  },
  {
    id: "data-lead-web-to-lead",
    domain: "Data Modeling and Management",
    topic: "Leads",
    prompt:
      "Leads must be captured from a form on the company's public website. What should be used?",
    options: [
      "Web-to-Lead, which generates HTML to embed on the site",
      "A lead assignment rule",
      "An auto-response rule",
      "A lead queue",
    ],
    answers: [0],
    explanation:
      "Web-to-Lead generates the HTML that creates lead records from a website form. Assignment rules, auto-response rules, and queues all act on leads after they exist — they do not capture them.",
  },
  {
    id: "data-lead-auto-response",
    domain: "Data Modeling and Management",
    topic: "Leads",
    prompt:
      "Prospects submitting the website form should immediately receive an email whose content depends on the values they entered. What should be configured?",
    options: [
      "An auto-response rule",
      "An assignment rule",
      "A validation rule",
      "A lead queue",
    ],
    answers: [0],
    explanation:
      "Auto-response rules send automatic email replies to Web-to-Lead submissions, choosing the response based on the record's attributes. Assignment rules decide ownership, not correspondence.",
  },
  {
    id: "data-lead-queue-vs-assignment",
    domain: "Data Modeling and Management",
    topic: "Leads",
    prompt:
      "Which two statements about lead queues and assignment rules are correct?",
    options: [
      "A queue is a holding location for leads not yet assigned to an owner",
      "Assignment rules apply criteria to automatically sort, queue, or act on leads",
      "A queue automatically converts leads once they meet criteria",
      "Assignment rules can only assign leads to individual users, never to a queue",
    ],
    answers: [0, 1],
    explanation:
      "Queues hold unassigned leads so teams can share and distribute workload; assignment rules are the criteria engine that routes leads, and a queue is a valid assignment target. Conversion is always a separate step.",
  },
  {
    id: "data-lead-process-record-type",
    domain: "Data Modeling and Management",
    topic: "Leads",
    prompt:
      "Two sales teams need different sets of lead status values. What supports this?",
    options: [
      "Create lead processes with the required status values, then assign record types and page layouts to them",
      "Create a validation rule restricting status per team",
      "Create separate lead queues for each team",
      "Create a formula field that overrides the status",
    ],
    answers: [0],
    explanation:
      "A lead process defines which status values apply. Record types and page layouts are then assigned to the process, which is how different teams get different picklist values on the same object.",
  },
  {
    id: "data-campaign-member-sources",
    domain: "Data Modeling and Management",
    topic: "Campaigns",
    prompt:
      "Which three record types can be added as campaign members?",
    options: [
      "Contacts",
      "Leads",
      "Person accounts",
      "Opportunities",
    ],
    answers: [0, 1, 2],
    explanation:
      "Contacts, leads, and person accounts can all be campaign members. Person accounts are the one people forget. Opportunities are related to campaigns but are never campaign members.",
  },
  {
    id: "data-campaign-hierarchy",
    domain: "Data Modeling and Management",
    topic: "Campaigns",
    prompt:
      "Campaigns must be grouped under a larger marketing initiative so results can be rolled up. What makes this possible?",
    options: [
      "A campaign hierarchy, built on a lookup relationship between campaigns",
      "A master-detail relationship between campaigns",
      "A junction object linking campaigns",
      "A record type per initiative",
    ],
    answers: [0],
    explanation:
      "Campaign hierarchy is a self-lookup on the Campaign object. It is a good counter-example to the assumption that any roll-up-style grouping must be master-detail.",
  },
  {
    id: "auto-before-save-scope",
    domain: "Business Logic and Process Automation",
    topic: "Record-triggered flows",
    prompt:
      "A record-triggered flow must set a field on the record being saved, as fast as possible. Which two statements about a before-save flow are correct?",
    options: [
      "It can only update fields on the triggering record",
      "It runs before the record is committed to the database",
      "It can also update related records in the same run",
      "It supports scheduled and asynchronous paths",
    ],
    answers: [0, 1],
    explanation:
      "Before-save flows are the fast path: they run prior to commit and are limited to the triggering record. Updating related records, sending notifications, calling Apex, and using scheduled or asynchronous paths all require after-save.",
  },
  {
    id: "auto-after-save-capabilities",
    domain: "Business Logic and Process Automation",
    topic: "Record-triggered flows",
    prompt:
      "A requirement needs cross-object updates and an email notification when a record is saved. Which configuration fits?",
    options: [
      "An after-save record-triggered flow",
      "A before-save record-triggered flow",
      "A schedule-triggered flow",
      "An autolaunched flow with no trigger",
    ],
    answers: [0],
    explanation:
      "After-save flows run once the record is committed and can update the triggering record, related records, and other records, plus send notifications and call Apex. Before-save cannot do any of that.",
  },
  {
    id: "auto-before-save-elements",
    domain: "Business Logic and Process Automation",
    topic: "Record-triggered flows",
    prompt:
      "Which interaction element is supported in a before-save record-triggered flow?",
    options: [
      "Custom Error Message only",
      "Custom Error Message, Action, and Subflow",
      "Action and Subflow only",
      "Screen elements",
    ],
    answers: [0],
    explanation:
      "Before-save supports the Custom Error Message element alone. After-save adds Action and Subflow. Screen elements belong to screen flows, which are manually triggered.",
  },
  {
    id: "auto-flow-type-selection",
    domain: "Business Logic and Process Automation",
    topic: "Flow types",
    prompt:
      "Match the requirement to the flow type: a batch of records must be processed every night at 2 a.m.",
    options: [
      "Schedule-Triggered Flow",
      "Record-Triggered Flow",
      "Platform Event-Triggered Flow",
      "Screen Flow",
    ],
    answers: [0],
    explanation:
      "Schedule-triggered flows run on a date/time schedule for recurring batch processing. Record-triggered flows need a record change, and platform event-triggered flows need an event message.",
  },
  {
    id: "auto-orchestration-vs-approval",
    domain: "Business Logic and Process Automation",
    topic: "Flow types",
    prompt:
      "Which two statements correctly distinguish Flow Orchestration from an Approval Process?",
    options: [
      "Orchestration coordinates multi-step work assigned to multiple users over time",
      "An approval process handles a structured approve, reject, and recall cycle",
      "Orchestration replaces approval processes entirely",
      "An approval process is the right tool for sequential data-entry tasks across teams",
    ],
    answers: [0, 1],
    explanation:
      "Orchestration sequences multi-user work; approval processes model a human approval decision with approve, reject, and recall. They solve different problems and neither replaces the other.",
  },
  {
    id: "auto-subflow-platform-event",
    domain: "Business Logic and Process Automation",
    topic: "Flow elements",
    prompt:
      "Where is the Subflow element NOT supported?",
    options: [
      "In platform event-triggered flows",
      "In screen flows",
      "In autolaunched flows",
      "In after-save record-triggered flows",
    ],
    answers: [0],
    explanation:
      "Subflow launches another active flow and passes values through input and output variables, but it is not available in platform event-triggered flows.",
  },
  {
    id: "auto-custom-error-rollback",
    domain: "Business Logic and Process Automation",
    topic: "Flow elements",
    prompt:
      "What does the Custom Error action do when it fires in a record-triggered flow?",
    options: [
      "It displays a targeted error and rolls back the associated record change",
      "It logs the error and allows the save to complete",
      "It retries the flow asynchronously",
      "It is only available in screen flows",
    ],
    answers: [0],
    explanation:
      "Custom Error shows a message in a window or inline on a field and rolls back the record change. It is supported in both before-save and after-save flows.",
  },
  {
    id: "auto-external-service-action",
    domain: "Business Logic and Process Automation",
    topic: "Flow elements",
    prompt:
      "A flow must call an external REST API without writing code. What is required?",
    options: [
      "An External Service registered with an endpoint URL and a named credential",
      "An Apex class implementing the callout",
      "A platform event subscription",
      "A custom Visualforce page",
    ],
    answers: [0],
    explanation:
      "External Services connect Flow Builder to a REST API declaratively. Once registered in Setup with an endpoint and named credential, Salesforce generates invocable actions the flow can call as an HTTP Callout.",
  },
  {
    id: "auto-flow-trigger-explorer",
    domain: "Business Logic and Process Automation",
    topic: "Flow administration",
    prompt:
      "An administrator needs to see every record-triggered flow on an object, in what order they run, and which contain asynchronous paths. Which tool shows this?",
    options: [
      "Flow Trigger Explorer",
      "The Migrate to Flow tool",
      "Setup Audit Trail",
      "Schema Builder",
    ],
    answers: [0],
    explanation:
      "Flow Trigger Explorer lists record-triggered flows per object and trigger type, separates before-save from after-save, surfaces asynchronous paths, and lets versions be activated or deactivated.",
  },
  {
    id: "data-junction-two-master-detail",
    domain: "Data Modeling and Management",
    topic: "Relationships",
    prompt:
      "Candidates must be able to apply to many positions, and each position must accept many candidates. What is required?",
    options: [
      "A junction object with two master-detail relationship fields, one to each parent",
      "A junction object with two lookup relationship fields, one to each parent",
      "A single master-detail relationship from Candidate to Position",
      "A hierarchical relationship between Candidate and Position",
    ],
    answers: [0],
    explanation:
      "Many-to-many is implemented with a junction object carrying two master-detail relationship fields. Lookups would not create the many-to-many behavior, and hierarchical relationships exist only on the User object.",
  },
  {
    id: "data-junction-report-scope",
    domain: "Data Modeling and Management",
    topic: "Relationships",
    prompt:
      "A many-to-many relationship provides two standard report types. What determines the scope of records returned?",
    options: [
      "The master object listed first in the report type",
      "The junction object's sharing settings",
      "Whichever master object has more records",
      "The order in which the master-detail fields were created",
    ],
    answers: [0],
    explanation:
      "Two standard report types are generated, joining the masters and the junction. The master object listed first sets the scope — a genuinely niche detail that separates people on reporting questions.",
  },
  {
    id: "data-master-detail-limit",
    domain: "Data Modeling and Management",
    topic: "Relationships",
    prompt:
      "Which two statements about master-detail relationships are correct?",
    options: [
      "An object can have up to two master-detail relationships",
      "A standard object cannot be on the detail side when a custom object is the master",
      "An object can have unlimited master-detail relationships",
      "Standard objects can always be on the detail side of any master-detail relationship",
    ],
    answers: [0, 1],
    explanation:
      "The limit is two per object, and the standard-object restriction is the constraint people forget: a standard object may not be the detail when a custom object is the master.",
  },
  {
    id: "data-master-detail-reparenting",
    domain: "Data Modeling and Management",
    topic: "Relationships",
    prompt:
      "A child record in a master-detail relationship must be moved to a different parent. What is true?",
    options: [
      "Reparenting is disabled by default, but 'Allow reparenting' can be selected on the relationship",
      "Reparenting is always permitted in master-detail relationships",
      "Reparenting requires converting the relationship to a lookup",
      "Reparenting is only possible through the Data Loader",
    ],
    answers: [0],
    explanation:
      "By default a detail record cannot change parents. The 'Allow reparenting' option on the master-detail relationship enables it for custom object child records.",
  },
  {
    id: "data-lookup-vs-master-detail",
    domain: "Data Modeling and Management",
    topic: "Relationships",
    prompt:
      "Two objects must be linked, but each has to survive independently and keep its own sharing. Which two statements support choosing a lookup?",
    options: [
      "The relationship field is optional, and the objects have independent security",
      "Deleting the parent does not delete the child",
      "It supports roll-up summary fields on the parent",
      "The child inherits the parent's sharing settings",
    ],
    answers: [0, 1],
    explanation:
      "Lookups link loosely: the field is optional, security and deletion are independent. What you give up is roll-up summaries and inherited sharing, both of which need master-detail.",
  },
  {
    id: "data-hierarchical-user-only",
    domain: "Data Modeling and Management",
    topic: "Relationships",
    prompt:
      "Each user record must store a reference to another user, such as their director. What should be created?",
    options: [
      "A hierarchical relationship field on the User object",
      "A lookup relationship field on the User object",
      "A master-detail relationship on the User object",
      "A junction object between User and User",
    ],
    answers: [0],
    explanation:
      "Hierarchical relationships exist solely on the User object and are the supported way to relate one user to another. Self-lookups work on other objects — a Contact's 'Assistant', for example — but User is the exception.",
  },
  {
    id: "data-lookup-self-relationship",
    domain: "Data Modeling and Management",
    topic: "Relationships",
    prompt:
      "A Contact must reference another Contact as their assistant. What supports this?",
    options: [
      "A lookup relationship from Contact to itself",
      "A hierarchical relationship on Contact",
      "A junction object between Contact and Contact",
      "A master-detail relationship from Contact to itself",
    ],
    answers: [0],
    explanation:
      "Lookup relationships can link an object to itself. Hierarchical is reserved for User, which is precisely why these two questions make good distractors for each other.",
  },
  {
    id: "data-master-detail-delete-behavior",
    domain: "Data Modeling and Management",
    topic: "Relationships",
    prompt:
      "Salary plans must be removed automatically when the related employee record is deleted. Which relationship achieves this?",
    options: [
      "A master-detail relationship from Salary Plan to Employee",
      "A lookup relationship from Salary Plan to Employee",
      "A hierarchical relationship on Employee",
      "A junction object between Salary Plan and Employee",
    ],
    answers: [0],
    explanation:
      "Master-detail cascades deletion from master to detail. A lookup would leave the salary plans behind. Any requirement phrased as 'deleted when the parent is deleted' points at master-detail.",
  },
  {
    id: "fund-restriction-rules-purpose",
    domain: "Salesforce Fundamentals",
    topic: "Sharing and visibility",
    prompt:
      "A group of users must be prevented from accessing a subset of records they would otherwise be able to see. What should be used?",
    options: [
      "A restriction rule",
      "A sharing rule",
      "A scoping rule",
      "A tighter organization-wide default",
    ],
    answers: [0],
    explanation:
      "Restriction rules are the one sharing mechanism that actually takes access away, filtering by user criteria and record criteria. Sharing rules only grant, and scoping rules change the default view without changing access.",
  },
  {
    id: "fund-restriction-rules-objects",
    domain: "Salesforce Fundamentals",
    topic: "Sharing and visibility",
    prompt:
      "Restriction rules are available on which objects?",
    options: [
      "Custom objects, contracts, tasks, events, and external objects",
      "All standard and custom objects",
      "Accounts, contacts, and opportunities only",
      "Custom objects only",
    ],
    answers: [0],
    explanation:
      "The supported list is deliberately narrow — custom objects, contracts, tasks, events, and external objects. A question naming Account or Opportunity is testing whether you know restriction rules do not apply there.",
  },
  {
    id: "fund-scoping-vs-restriction",
    domain: "Salesforce Fundamentals",
    topic: "Sharing and visibility",
    prompt:
      "What is the key difference between a scoping rule and a restriction rule?",
    options: [
      "A scoping rule filters which records users see by default but does not change what they can access",
      "A scoping rule permanently removes access while a restriction rule only hides records",
      "Scoping rules apply only to custom objects while restriction rules apply to all objects",
      "They are two names for the same feature",
    ],
    answers: [0],
    explanation:
      "Scoping rules narrow the default view by division, ownership, or record criteria — records remain accessible through sharing settings. Restriction rules genuinely revoke access. Same-sounding names, opposite effects.",
  },
  {
    id: "fund-muting-permission-set",
    domain: "Salesforce Fundamentals",
    topic: "Object and field access",
    prompt:
      "Users assigned a permission set group must be prevented from deleting records, even though one of the included permission sets grants Delete. What should be configured?",
    options: [
      "A muting permission set within the permission set group",
      "A second permission set that denies Delete",
      "A restriction rule on the object",
      "A validation rule blocking deletion",
    ],
    answers: [0],
    explanation:
      "An ordinary permission set is purely additive and cannot deny anything. A muting permission set is the exception: inside a permission set group it disables selected permissions for the assigned users.",
  },
  {
    id: "fund-view-all-modify-all",
    domain: "Salesforce Fundamentals",
    topic: "Object and field access",
    prompt:
      "What is the effect of granting View All Records or Modify All Records on an object?",
    options: [
      "It grants access to all records of that object, overriding record-level sharing settings",
      "It grants access only to records the user already owns",
      "It applies only when the organization-wide default is Public Read Only",
      "It affects field-level security but not record access",
    ],
    answers: [0],
    explanation:
      "These object permissions bypass the sharing model entirely for that object. That makes them a common right answer when a scenario needs broad access without restructuring sharing — and a common wrong answer when the requirement was narrow.",
  },
  {
    id: "fund-public-group-vs-queue",
    domain: "Salesforce Fundamentals",
    topic: "Sharing and visibility",
    prompt:
      "Which two statements distinguish public groups from queues?",
    options: [
      "Public groups are used to share records",
      "Queues assign record ownership to more than one user",
      "Queues are used to share records without changing ownership",
      "Public groups can own records directly",
    ],
    answers: [0, 1],
    explanation:
      "A public group is a sharing target; a queue is an ownership holder that lets a team take records from a shared pool. Both can contain users, roles, roles and subordinates, territories, and other public groups.",
  },
  {
    id: "fund-queue-supported-objects",
    domain: "Salesforce Fundamentals",
    topic: "Sharing and visibility",
    prompt:
      "Queues are supported on which of these objects?",
    options: [
      "Cases, Leads, Tasks, Orders, and custom objects",
      "Accounts, Contacts, and Opportunities",
      "Custom objects only",
      "All standard objects",
    ],
    answers: [0],
    explanation:
      "The supported set includes Tasks, Cases, Contact Requests, Service Contracts, Leads, Orders, Knowledge Article Versions, and custom objects. Accounts, Contacts, and Opportunities are not queue-enabled — a reliable distractor.",
  },
  {
    id: "fund-manager-groups",
    domain: "Salesforce Fundamentals",
    topic: "Sharing and visibility",
    prompt:
      "Records must be shared up a user's management chain based on the Manager field. Which two statements are correct?",
    options: [
      "Manager Groups must first be enabled in Sharing Settings",
      "Once enabled, Manager Groups and Manager Subordinates Groups appear in the 'Share with' options of a sharing rule",
      "Manager groups are based on the role hierarchy rather than the Manager field",
      "Manager groups replace the need for organization-wide defaults",
    ],
    answers: [0, 1],
    explanation:
      "Manager groups derive from the Manager field on the User record, not the role hierarchy — that distinction is the point of the feature. They are switched on in Sharing Settings and then become available as sharing rule targets.",
  },
  {
    id: "fund-profile-vs-permset-count",
    domain: "Salesforce Fundamentals",
    topic: "Object and field access",
    prompt:
      "How many profiles and permission sets can a user have?",
    options: [
      "Exactly one profile, and zero to many permission sets",
      "One profile and at most one permission set",
      "Zero to many profiles and zero to many permission sets",
      "At least one of each",
    ],
    answers: [0],
    explanation:
      "Every user has exactly one profile, which sets the baseline. Permission sets are optional and stack on top, which is why the recommended pattern is a minimal profile plus permission sets.",
  },
  {
    id: "auto-validation-true-blocks",
    domain: "Business Logic and Process Automation",
    topic: "Validation rules",
    prompt:
      "When does a validation rule prevent a record from being saved?",
    options: [
      "When the formula evaluates to TRUE",
      "When the formula evaluates to FALSE",
      "When the formula returns null",
      "Whenever the referenced field is blank",
    ],
    answers: [0],
    explanation:
      "The formula describes the error condition. TRUE means the rule fires and the save is blocked. Writing the formula the wrong way round is one of the most common practical mistakes and a reliable exam trap.",
  },
  {
    id: "auto-validation-order",
    domain: "Business Logic and Process Automation",
    topic: "Validation rules",
    prompt:
      "Relative to other automation, when are custom validation rules enforced?",
    options: [
      "Before workflow rules and processes run",
      "After all workflow rules and processes complete",
      "Only after an approval process finishes",
      "In parallel with record-triggered flows",
    ],
    answers: [0],
    explanation:
      "Validation runs before the other processing rules. That ordering is why a workflow field update can later leave a record holding values the validation rule would have rejected.",
  },
  {
    id: "auto-validation-lead-conversion",
    domain: "Business Logic and Process Automation",
    topic: "Validation rules",
    prompt:
      "Are validation rules enforced during lead conversion?",
    options: [
      "Only if validation and triggers for lead conversion are enabled in the org",
      "Always, without any additional configuration",
      "Never — conversion bypasses validation entirely",
      "Only for custom fields",
    ],
    answers: [0],
    explanation:
      "Lead conversion enforces validation only when that org-level setting is switched on. This is exactly the kind of conditional behavior scenario questions are built around.",
  },
  {
    id: "auto-validation-entry-points",
    domain: "Business Logic and Process Automation",
    topic: "Validation rules",
    prompt:
      "Which two statements about when validation rules apply are correct?",
    options: [
      "They run for records created through Web-to-Lead and Web-to-Case",
      "They apply even when the referenced field is not on the page layout or in the API call",
      "They apply to records created with Quick Create",
      "They are skipped during data imports",
    ],
    answers: [0, 1],
    explanation:
      "Web-generated records are validated, and the rule does not care whether the field is visible or supplied. The two exceptions worth memorizing are Quick Create, where rules do not apply, and lead conversion, which depends on an org setting. Imports are validated.",
  },
  {
    id: "auto-validation-workflow-invalidates",
    domain: "Business Logic and Process Automation",
    topic: "Validation rules",
    prompt:
      "How can a record end up holding values that violate an active validation rule?",
    options: [
      "A workflow field update or a process scheduled action modified it, and those updates do not trigger validation rules",
      "The validation rule was deactivated and reactivated",
      "The record was owned by a system administrator",
      "The record was created before the field existed",
    ],
    answers: [0],
    explanation:
      "Updates driven by workflow rules and process scheduled actions do not re-run validation, so they can quietly invalidate previously valid records. Hidden fields, field-level security, and assignment rules can likewise cause records to fail validation unexpectedly.",
  },
  {
    id: "data-import-wizard-limit",
    domain: "Data Modeling and Management",
    topic: "Data import and export",
    prompt:
      "10,000 account records must be imported from a CSV. Which two tools can do this?",
    options: [
      "Data Import Wizard",
      "Data Loader",
      "Schema Builder",
      "Report Builder",
    ],
    answers: [0, 1],
    explanation:
      "The Data Import Wizard handles fewer than 50,000 records and supports Accounts, so it fits. Data Loader covers roughly 50,000 up to 150 million and works here too. Schema Builder and Report Builder do not import data at all.",
  },
  {
    id: "data-loader-vs-wizard-volume",
    domain: "Data Modeling and Management",
    topic: "Data import and export",
    prompt:
      "Which statement correctly describes the volume boundary between the two native import tools?",
    options: [
      "Data Import Wizard handles fewer than 50,000 records; Data Loader covers roughly 50,000 up to 150 million",
      "Data Import Wizard handles up to 5 million records",
      "Data Loader is capped at 50,000 records",
      "Both tools have identical record limits",
    ],
    answers: [0],
    explanation:
      "50,000 is the dividing line. Anything above it, or any object the wizard does not support, points to Data Loader.",
  },
  {
    id: "data-import-wizard-objects",
    domain: "Data Modeling and Management",
    topic: "Data import and export",
    prompt:
      "Which objects does the Data Import Wizard support?",
    options: [
      "Accounts, Contacts, Leads, Solutions, Campaign Members, Person Accounts, and custom objects",
      "All standard and custom objects",
      "Custom objects only",
      "Opportunities, Cases, and Accounts",
    ],
    answers: [0],
    explanation:
      "The wizard's object list is fixed and notably excludes Opportunities and Cases. A scenario naming an unsupported object is steering you to Data Loader regardless of volume.",
  },
  {
    id: "data-loader-operations",
    domain: "Data Modeling and Management",
    topic: "Data import and export",
    prompt:
      "Which two operations are available in Data Loader but NOT in the Data Import Wizard?",
    options: [
      "Delete",
      "Export",
      "Insert",
      "Update",
    ],
    answers: [0, 1],
    explanation:
      "The wizard does insert, update, and upsert only. Delete, hard delete, export, and Export All — which includes archived records and the Recycle Bin — belong to Data Loader.",
  },
  {
    id: "data-import-scheduling",
    domain: "Data Modeling and Management",
    topic: "Data import and export",
    prompt:
      "A nightly automated export must run on a schedule. What supports this?",
    options: [
      "The Data Loader command line interface",
      "The Data Import Wizard",
      "The Data Loader desktop interface only",
      "Schema Builder",
    ],
    answers: [0],
    explanation:
      "Scheduling is a command line capability of Data Loader. The Data Import Wizard cannot be scheduled at all.",
  },
  {
    id: "data-import-parent-order",
    domain: "Data Modeling and Management",
    topic: "Data import and export",
    prompt:
      "Accounts and their contacts are being loaded. Which two steps preserve the relationships?",
    options: [
      "Load the parent Account records before the child Contact records",
      "Include a column of parent record IDs in the child import file",
      "Load contacts first so accounts can attach to them",
      "Disable validation rules during the import",
    ],
    answers: [0, 1],
    explanation:
      "Parents must exist before children can reference them, and the child file needs the parent IDs to make the link. Imported data still respects required fields and validation rules.",
  },
  {
    id: "data-loader-defaults",
    domain: "Data Modeling and Management",
    topic: "Data import and export",
    prompt:
      "A Data Loader import file leaves the owner and currency columns blank. What happens?",
    options: [
      "The owner defaults to the user performing the import, and the currency defaults to the corporate currency",
      "The import fails because both fields are required",
      "The owner defaults to the system administrator, and currency is left blank",
      "The records import with no owner assigned",
    ],
    answers: [0],
    explanation:
      "Both fields fall back to sensible defaults rather than failing. Relatedly, a value for an unrestricted picklist imports successfully but is not added to the active values list.",
  },
  {
    id: "data-import-workflow-suppression",
    domain: "Data Modeling and Management",
    topic: "Data import and export",
    prompt:
      "Which statement about suppressing automation during an import is correct?",
    options: [
      "The Data Import Wizard offers an option to prevent workflow rules and processes from firing",
      "Data Loader has a built-in setting to disable all automation",
      "Neither tool can prevent automation from running",
      "Automation never runs during any import",
    ],
    answers: [0],
    explanation:
      "The wizard exposes the choice directly. With Data Loader the automation has to be deactivated manually beforehand, which is the practical difference between the two.",
  },
  {
    id: "deploy-sandbox-refresh-intervals",
    domain: "App Deployment",
    topic: "Sandboxes",
    prompt:
      "Match the sandbox type to its refresh interval.",
    options: [
      "Developer 1 day, Developer Pro 1 day, Partial Copy 5 days, Full Copy 29 days",
      "Developer 1 day, Developer Pro 5 days, Partial Copy 29 days, Full Copy 30 days",
      "All sandbox types refresh once every 29 days",
      "Developer 5 days, Developer Pro 5 days, Partial Copy 29 days, Full Copy 60 days",
    ],
    answers: [0],
    explanation:
      "Developer and Developer Pro both refresh daily. Partial Copy is 5 days and Full Copy is 29 days. The 5-and-29 pair is the part worth memorizing — a scenario about frequent refreshes is steering away from Full Copy.",
  },
  {
    id: "deploy-sandbox-data-content",
    domain: "App Deployment",
    topic: "Sandboxes",
    prompt:
      "Which two sandbox types contain production data when created?",
    options: [
      "Partial Copy, using a subset defined by a template",
      "Full Copy, containing all production data",
      "Developer",
      "Developer Pro",
    ],
    answers: [0, 1],
    explanation:
      "Developer and Developer Pro copy configuration only. Partial Copy brings a template-defined subset, and Full Copy brings everything. Any requirement mentioning real records rules out the two developer types.",
  },
  {
    id: "deploy-sandbox-storage",
    domain: "App Deployment",
    topic: "Sandboxes",
    prompt:
      "What is the data storage limit of a Developer Pro sandbox?",
    options: [
      "1 GB",
      "200 MB",
      "5 GB",
      "The same as production",
    ],
    answers: [0],
    explanation:
      "Developer is 200 MB, Developer Pro is 1 GB, Partial Copy is 5 GB of data storage with file storage matching production, and Full Copy matches production for both.",
  },
  {
    id: "deploy-partial-copy-template",
    domain: "App Deployment",
    topic: "Sandboxes",
    prompt:
      "Which statement about sandbox templates is correct?",
    options: [
      "A Partial Copy sandbox requires a template to define which records are copied",
      "Templates are only available for Developer sandboxes",
      "A Full Copy sandbox requires a template",
      "Templates control metadata rather than records",
    ],
    answers: [0],
    explanation:
      "Partial Copy cannot be created without a template, since the template is what defines the subset. Full Copy may optionally use one to reduce the data it brings across, but does not require it.",
  },
  {
    id: "deploy-full-copy-purpose",
    domain: "App Deployment",
    topic: "Sandboxes",
    prompt:
      "Performance and load testing must run in an environment identical to production. Which sandbox fits?",
    options: [
      "Full Copy",
      "Partial Copy",
      "Developer Pro",
      "Developer",
    ],
    answers: [0],
    explanation:
      "Only Full Copy matches production for data and storage, which is what makes performance and load testing meaningful. Its 29-day refresh interval is the cost of that fidelity.",
  },
  {
    id: "deploy-sandbox-email-deliverability",
    domain: "App Deployment",
    topic: "Sandboxes",
    prompt:
      "Users report that a newly refreshed sandbox is not sending any email. What is the most likely cause?",
    options: [
      "Salesforce sets email deliverability to 'System Email Only' in new sandboxes",
      "Email deliverability must be purchased separately for sandboxes",
      "Sandboxes can never send email under any configuration",
      "The sandbox has exceeded its storage limit",
    ],
    answers: [0],
    explanation:
      "This is deliberate: it stops test environments from mailing real contacts. The setting can be changed under Email Deliverability. It is a favorite scenario question because it looks like a defect rather than a default.",
  },
  {
    id: "deploy-sandbox-record-ids",
    domain: "App Deployment",
    topic: "Sandboxes",
    prompt:
      "Which statement about IDs in sandboxes is correct?",
    options: [
      "Salesforce record IDs are copied over for Full Copy sandboxes, and field IDs are copied to sandboxes generally",
      "All record IDs are regenerated in every sandbox type",
      "Record IDs are never preserved in any sandbox",
      "Only Developer sandboxes preserve record IDs",
    ],
    answers: [0],
    explanation:
      "Full Copy preserves record IDs. Field IDs carry across to sandboxes generally, which matters for anything referencing them, such as a Web-to-Case form.",
  },
  {
    id: "deploy-sandbox-edition-availability",
    domain: "App Deployment",
    topic: "Sandboxes",
    prompt:
      "Which statement about sandbox availability by edition is correct?",
    options: [
      "Enterprise Edition does not include a Full Copy sandbox, while Performance and Unlimited do",
      "All editions include every sandbox type",
      "Only Developer Edition includes sandboxes",
      "Full Copy sandboxes are included in every paid edition",
    ],
    answers: [0],
    explanation:
      "The number and types of sandboxes depend on the edition, and some are only available at extra cost. Enterprise not including Full Copy is the specific fact that gets tested.",
  },
  {
    id: "deploy-sandbox-refresh-activation",
    domain: "App Deployment",
    topic: "Sandboxes",
    prompt:
      "Which two statements about refreshing a sandbox are correct?",
    options: [
      "A refresh replaces the sandbox with a new copy from production while keeping its name",
      "Activation can be automatic or deferred until you choose, using 'activate when ready'",
      "A refresh merges production changes into the existing sandbox without overwriting work",
      "A refreshed sandbox always keeps any unreleased changes made inside it",
    ],
    answers: [0, 1],
    explanation:
      "A refresh is a replacement, not a merge — anything in the sandbox that was not deployed elsewhere is lost. Deferred activation exists so the old sandbox stays usable until the new copy is ready.",
  },
  {
    id: "deploy-advanced-lifecycle-sandboxes",
    domain: "App Deployment",
    topic: "Application lifecycle",
    prompt:
      "Several projects are developed in parallel, each in its own sandbox. What is the correct progression before production?",
    options: [
      "Consolidate the changes in an integration sandbox, then move them to a UAT sandbox for acceptance testing and training",
      "Deploy each project sandbox directly to production in turn",
      "Merge all developer sandboxes into a Full Copy sandbox and release from there",
      "Perform acceptance testing in each individual developer sandbox",
    ],
    answers: [0],
    explanation:
      "The advanced lifecycle consolidates parallel work in an integration sandbox first, then promotes to a UAT sandbox where users test and train before anything reaches production. The four phases throughout are plan, build, test, deploy.",
  },
  {
    id: "deploy-change-set-metadata-only",
    domain: "App Deployment",
    topic: "Change sets",
    prompt:
      "Which of the following CANNOT be moved from one org to another using a change set?",
    options: [
      "Data records, such as a list of contacts",
      "Custom fields",
      "Validation rules",
      "Page layouts",
    ],
    answers: [0],
    explanation:
      "Change sets carry metadata — configuration — and never data. Moving records requires a data tool such as Data Loader. This metadata-versus-data line is the most frequently tested fact about change sets.",
  },
  {
    id: "deploy-change-set-no-delete-rename",
    domain: "App Deployment",
    topic: "Change sets",
    prompt:
      "A field must be renamed and an obsolete field deleted in production. Can a change set do this?",
    options: [
      "No — change sets cannot delete or rename components; both must be done manually in the target org",
      "Yes, renames and deletes deploy like any other change",
      "Only deletions are supported; renames are not",
      "Only renames are supported; deletions are not",
    ],
    answers: [0],
    explanation:
      "Neither operation is supported. Worse, a renamed component arrives in the target org as a brand new component, leaving the original behind — which is how duplicate fields quietly appear after a deployment.",
  },
  {
    id: "deploy-change-set-overwrite",
    domain: "App Deployment",
    topic: "Change sets",
    prompt:
      "An updated workflow rule is deployed to an org that already has that rule. What happens?",
    options: [
      "The existing metadata is overwritten, not merged",
      "The two versions are merged, keeping changes from both",
      "The deployment fails because the component already exists",
      "A second copy of the rule is created",
    ],
    answers: [0],
    explanation:
      "Change set deployment overwrites the component in the target org. Any change made directly in the target that is not represented in the change set is lost.",
  },
  {
    id: "deploy-change-set-all-or-none",
    domain: "App Deployment",
    topic: "Change sets",
    prompt:
      "One component in a large change set fails during deployment. What is the result?",
    options: [
      "Nothing is deployed — the entire transaction rolls back",
      "The successful components deploy and the failed one is skipped",
      "The deployment pauses until the error is resolved",
      "Components deploy in order until the failure, then stop",
    ],
    answers: [0],
    explanation:
      "Change set deployment is all or nothing. Partial deployment is not possible, and an incomplete deployment rolls back entirely.",
  },
  {
    id: "deploy-change-set-order",
    domain: "App Deployment",
    topic: "Change sets",
    prompt:
      "One component must be deployed before another. How is this handled with change sets?",
    options: [
      "Split the work into two change sets and deploy the prerequisite first",
      "Order the components within a single change set",
      "Use the deployment sequence field on the change set",
      "Change sets resolve deployment order automatically",
    ],
    answers: [0],
    explanation:
      "A change set can hold dependent components but cannot express the order they deploy in. When sequencing genuinely matters, the only option is to split it.",
  },
  {
    id: "deploy-change-set-connection",
    domain: "App Deployment",
    topic: "Change sets",
    prompt:
      "Which two statements about deployment connections are correct?",
    options: [
      "Change sets only work between related orgs with a deployment connection",
      "Creating a sandbox from production establishes a deployment connection automatically",
      "A deployment connection can be created between any two Salesforce orgs",
      "Deployment connections are configured in the source org only",
    ],
    answers: [0, 1],
    explanation:
      "Change sets are limited to related orgs — a production org and its sandboxes. That connection appears automatically when a sandbox is created, and the target org must separately allow inbound changes.",
  },
  {
    id: "deploy-change-set-list-view-tab-defaults",
    domain: "App Deployment",
    topic: "Change sets",
    prompt:
      "After deploying a change set, which two default visibility behaviors apply?",
    options: [
      "Deployed list views are visible to all users",
      "Deployed custom tabs are hidden from all users",
      "Deployed list views are hidden from all users",
      "Deployed custom tabs are visible to all users",
    ],
    answers: [0, 1],
    explanation:
      "The two defaults run opposite ways, which is exactly why they get tested together. To control tab visibility, include the relevant profiles in the change set.",
  },
  {
    id: "deploy-change-set-profiles",
    domain: "App Deployment",
    topic: "Change sets",
    prompt:
      "How are permission sets and profiles handled in a change set?",
    options: [
      "Permission sets are added as components; profiles are added under 'Profile Settings for Included Components'",
      "Both are added as ordinary components",
      "Profiles are added as components; permission sets cannot be deployed",
      "Neither can be deployed with change sets",
    ],
    answers: [0],
    explanation:
      "A permission set is a component in its own right. A profile is not — it rides along only as settings attached to the components already in the change set.",
  },
  {
    id: "deploy-change-set-private-reports",
    domain: "App Deployment",
    topic: "Change sets",
    prompt:
      "A report cannot be added to an outbound change set. What is the most likely reason?",
    options: [
      "The report is stored in a private folder",
      "Reports can never be deployed with change sets",
      "The report contains a cross-object formula",
      "The report has not been run recently",
    ],
    answers: [0],
    explanation:
      "Reports in private folders are not available to change sets. Moving the report into a shared folder makes it deployable.",
  },
  {
    id: "deploy-change-set-flow-active",
    domain: "App Deployment",
    topic: "Change sets",
    prompt:
      "Which two statements about deploying flows and processes with change sets are correct?",
    options: [
      "They deploy as inactive by default",
      "Deploying an active flow to production triggers test coverage requirements",
      "They always deploy as active",
      "Flows cannot be included in change sets at all",
    ],
    answers: [0, 1],
    explanation:
      "Inactive is the default, so a deployed flow often needs activating afterward — a common cause of 'the deployment succeeded but nothing happens'. Active deployment brings a test coverage requirement, and the option to set a minimum percentage exists only in production, since sandboxes always allow active versions.",
  },
  {
    id: "deploy-change-set-unavailable",
    domain: "App Deployment",
    topic: "Change sets",
    prompt:
      "An inbound change set that was visible yesterday has disappeared from the target org. Which two could explain this?",
    options: [
      "The change set expired or was deleted from the source org",
      "The source sandbox was deleted or refreshed",
      "The target org exceeded its data storage limit",
      "The change set was validated but not deployed",
    ],
    answers: [0, 1],
    explanation:
      "A change set becomes unavailable if it expires, is deleted at the source, or the source sandbox is deleted or refreshed. Validating without deploying leaves it available — that is the whole point of validation.",
  },
  {
    id: "deploy-change-set-validate",
    domain: "App Deployment",
    topic: "Change sets",
    prompt:
      "What does the Validate option on an inbound change set do?",
    options: [
      "Performs a test deployment that reports success or failure without committing changes",
      "Deploys the change set and allows a rollback afterward",
      "Checks only that all components exist in the source org",
      "Locks the change set so it cannot be modified",
    ],
    answers: [0],
    explanation:
      "Validation is a dry run in the target org. It surfaces missing dependencies and version problems before anything is committed, which is why it belongs in every production deployment.",
  },
  {
    id: "auto-approval-locking-defaults",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "Which two statements describe record locking defaults in an approval process?",
    options: [
      "The record is locked by default on initial submission",
      "The record is unlocked by default when recalled",
      "The record is unlocked by default on initial submission",
      "A locked record cannot be edited by anyone until approval completes",
    ],
    answers: [0, 1],
    explanation:
      "Submission locks, recall unlocks. On final approval or rejection you choose whether to leave it locked. While locked, the system administrator, the assigned approver, and anyone with Modify All Data can still edit it — locking is not absolute.",
  },
  {
    id: "auto-approval-parallel-modes",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "An approval step is assigned to three approvers at once. Which two configurations are available?",
    options: [
      "Unanimous — every assigned approver must approve, and a single rejection rejects the request",
      "First response — the first approver to respond determines the outcome",
      "Majority — the outcome follows whichever response most approvers give",
      "Sequential — approvers respond one after another in a fixed order",
    ],
    answers: [0, 1],
    explanation:
      "Parallel approval offers exactly two modes: unanimous or first response. There is no majority option, which makes it a clean distractor.",
  },
  {
    id: "auto-approval-delegated-limits",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "An approver is on leave and has a delegated approver configured. What can the delegate do?",
    options: [
      "Approve or reject the request, but not reassign it",
      "Approve, reject, or reassign the request",
      "Only view the request without acting on it",
      "Reassign the request but not approve or reject it",
    ],
    answers: [0],
    explanation:
      "A delegated approver receives the same request and can approve or reject it, but cannot reassign. The delegate is set in Approver Settings on the user record, and the approval step must allow delegates.",
  },
  {
    id: "auto-approval-actions-stages",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "At which four stages can approval actions be defined?",
    options: [
      "Initial submission, final approval, final rejection, and recall",
      "Initial submission, escalation, approval, and closure",
      "Entry, approval, rejection, and archive",
      "Submission, validation, approval, and deployment",
    ],
    answers: [0],
    explanation:
      "Recall is the stage most often forgotten. At every one of the four, the available actions are the same: Create a Task, Email Alert, Field Update, and Outbound Message.",
  },
  {
    id: "auto-approval-action-types",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "Which four action types can an approval process perform?",
    options: [
      "Create a Task, Email Alert, Field Update, and Outbound Message",
      "Create a Record, Send Email, Post to Chatter, and Call Apex",
      "Field Update, Screen Flow, Email Alert, and Platform Event",
      "Email Alert, Field Update, Delete Record, and Outbound Message",
    ],
    answers: [0],
    explanation:
      "This is a fixed set worth memorizing verbatim. Note what is absent: approval processes cannot create records or delete them, which is a common wrong answer.",
  },
  {
    id: "auto-approval-approver-limit",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "How many approvers can an administrator assign to a single approval step?",
    options: [
      "Up to 25",
      "Up to 10",
      "Up to 5",
      "Unlimited",
    ],
    answers: [0],
    explanation:
      "An admin-configured step supports up to 25 users. Approvers can also be a queue, a manually chosen user, a designated approver such as a manager, or a delegated approver.",
  },
  {
    id: "auto-approval-manager-field",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "Approval requests must route to each submitter's manager. What supports this?",
    options: [
      "The standard Manager field on the user record, or a custom hierarchical relationship",
      "The role hierarchy",
      "A public group containing all managers",
      "An assignment rule on the object",
    ],
    answers: [0],
    explanation:
      "Manager approval reads the hierarchical Manager field on the User record — not the role hierarchy, which is the natural-sounding wrong answer. A custom hierarchical field works too.",
  },
  {
    id: "auto-approval-related-user-routing",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "Approval requests must go to a user stored in a lookup field on the record being submitted. Is this possible?",
    options: [
      "Yes — the approver can be based on any related user field on the object",
      "No — approvers must be a fixed user, queue, or manager",
      "Only if that user is also the record owner",
      "Only through an Apex trigger",
    ],
    answers: [0],
    explanation:
      "Dynamic routing off a related user field is supported and is how per-record approver assignment is done declaratively.",
  },
  {
    id: "auto-approval-triggers",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "Which three can start an approval process?",
    options: [
      "A Submit for Approval button on the record",
      "A flow built in Flow Builder",
      "An Apex trigger",
      "A validation rule",
    ],
    answers: [0, 1, 2],
    explanation:
      "Submission can be manual or automated through Flow or Apex. Validation rules only block saves; they cannot submit anything.",
  },
  {
    id: "auto-approval-mobile-notifications",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "An approval step assigns requests to a queue, and approvers report receiving no mobile notification. Why?",
    options: [
      "Salesforce mobile app notifications are not sent to queues or delegates; individual users must be added",
      "Approval processes are not supported in the Salesforce mobile app",
      "Mobile notifications require the record to be unlocked",
      "Queues cannot be used as approvers at all",
    ],
    answers: [0],
    explanation:
      "Queues and delegates are valid approvers but do not receive mobile push notifications. For a step to notify on mobile, individual users have to be assigned.",
  },
  {
    id: "auto-approval-entry-criteria",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "Only opportunities above $50,000 should be eligible for an approval process. Where is that defined?",
    options: [
      "The entry criteria on the approval process",
      "The step criteria on the first approval step",
      "A validation rule on Opportunity",
      "The approval request page layout",
    ],
    answers: [0],
    explanation:
      "Entry criteria decide which records may enter the process at all. Step criteria are a separate, later filter deciding whether a record enters a particular step once it is already in the process.",
  },
  {
    id: "auto-approval-step-criteria",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "A record enters an approval process but does not meet the criteria for step two. What controls the outcome?",
    options: [
      "The 'not meeting criteria' action configured on that step",
      "The entry criteria, which re-evaluates at each step",
      "The record is automatically rejected",
      "The record is returned to the submitter",
    ],
    answers: [0],
    explanation:
      "Each step defines what happens when its criteria are not met — typically skip to the next step or reject. This is how conditional routing is built, for example skipping director approval below a threshold.",
  },
  {
    id: "auto-approval-record-editability",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "An approver needs to correct a field on a record that is locked pending approval. What makes this possible?",
    options: [
      "The Record Editability setting, which lets the assigned approver and the administrator edit a locked record",
      "Removing the lock action from the initial submission",
      "Granting the approver Modify All Data",
      "Recalling and resubmitting the record",
    ],
    answers: [0],
    explanation:
      "Record Editability is set when creating the approval process and is the intended mechanism. Granting Modify All Data would also work but is wildly disproportionate — that pairing makes it a good distractor.",
  },
  {
    id: "auto-approval-initial-submitters",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "Which can be designated as initial submitters on an approval process?",
    options: [
      "Users, roles, and members of public groups",
      "Users only",
      "Profiles and permission sets",
      "Any user with read access to the record",
    ],
    answers: [0],
    explanation:
      "Initial Submitters controls who may submit a record for approval and accepts users, roles, and public group members. Profiles and permission sets are not options here.",
  },
  {
    id: "auto-approval-approver-field",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "When creating an approval process, what does the Approver Field setting specify?",
    options: [
      "A standard or custom user field on the record, or the record owner, used to determine the approver",
      "The email address approval notifications are sent from",
      "The field updated when the record is approved",
      "Which fields appear on the approval request page",
    ],
    answers: [0],
    explanation:
      "The Approver Field is how the process derives an approver from the record itself. The approval request page layout is a separate setting controlling which fields the approver sees when deciding.",
  },
  {
    id: "auto-approval-history",
    domain: "Business Logic and Process Automation",
    topic: "Approval processes",
    prompt:
      "Where can the full audit trail of an approval, including comments across multiple resubmissions, be seen?",
    options: [
      "The Approval History related list on the record",
      "The Setup Audit Trail",
      "The record's Chatter feed",
      "The field history tracking related list",
    ],
    answers: [0],
    explanation:
      "Approval History is its own related list and retains comments and approval or rejection status through the original submission and every resubmission. Setup Audit Trail tracks configuration changes, not record approvals.",
  },
];

