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
];

