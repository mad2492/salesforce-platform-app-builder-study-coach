# Niche Facts — Platform App Builder

The details that actually separate answers. Written for skimming in short gaps, not for reading
front to back. Each **Decoy** line is the wrong answer a question will dangle in front of you.

Coverage: 16 of roughly 31 course topics. They were chosen by what the practice exam said you
missed, not by working through the course in order. The rest are listed under "Not yet covered"
at the end.

---

## Declarative vs. programmatic boundaries

### What is retired, and when

The two retirement dates are different, and that difference is the question.

| Tool | New ones blocked since |
| --- | --- |
| Workflow Rules | Winter '23 |
| Process Builder | Summer '23 |

- New ones can still be created in **Developer Edition orgs**, and only for use in managed packages.
- Anything already in the org keeps running. It can still be edited, activated, and deactivated.
- **Migrate to Flow**, in Setup, converts workflow rules and processes. It does not convert Apex
  triggers.
- Decoy: "new processes can still be created in production." They cannot.

### The one requirement with no declarative option

- **Providing** a custom web service always needs Apex.
- **Consuming** one can be declarative. Flow Builder handles the simple case; Apex takes over once
  the logic gets complex.

Memorize the two directions as a pair. Questions test which direction you are being asked about.

### Other boundaries that force Apex or a custom component

- Inbound email processing beyond what Email-to-Case settings offer → **Apex email service handler**
- Validation too complex for a validation rule → Apex
- Reporting beyond what the report builder can express → Visualforce or a custom Lightning
  component, plus Apex
  - Decoy: "create a new report type" or "share the folder." Those change *which data* and
    *which users*, not what the builder itself can do.

### Visualforce vs. custom Lightning components

The tiebreaker is visual design: Visualforce keeps the **Salesforce Classic look**.

That rules Visualforce out whenever a requirement is phrased as "must not look like Classic,"
"override a standard action in Lightning Experience," or "invoke custom client-side behavior in
LEX." Once one of those appears, nothing else about the requirement matters.

### Two more recall items

- Three ways to extend an org: **configure** in Setup, **buy** on AppExchange, **build** with code.
  Decoy: "ask Salesforce Support to add the feature."
- Advantages of declarative, as the course states them: faster to deliver, less maintenance,
  upgraded automatically each release, cheaper. It does *not* remove the need to test.

---

## AppExchange and packages

There are **five solution types**, and the type is shown directly under the name on a listing page:
Salesforce App, Lightning Data, Bolt Solution, Flow, and Component.

### Managed vs. unmanaged

| Aspect | Managed | Unmanaged |
| --- | --- | --- |
| Built from | a Developer Edition org | any org |
| Upgradeable | yes, by the creator | **no, ever** |
| Components | locked, limited editing | fully editable |
| Apex code | hidden from the subscriber | readable and modifiable |
| Typical use | partners selling apps | open-source projects, templates |

- A managed package exists for **intellectual property protection**: the subscriber cannot read the
  Apex.
- An unmanaged package exists to hand someone an editable starting point. That it is **never
  upgradeable** is the fact most often missed.
- Either kind installs into a **sandbox or production**.

**When to install rather than build.** The app already exists, is proven, and has been reviewed by
Salesforce. It usually ships with support and maintenance too. That matters most when you have no
resources to maintain a custom solution.

**Lightning Data** validates CRM data against outside sources. It is aimed at Sales and Marketing.

---

## Roll-up summary fields

A roll-up summary can be created **only on the master side of a master-detail relationship**. It
recalculates whenever a detail record it counts is saved.

**The limit is 25 per object.** Salesforce Support can raise it to 40.

### What each roll-up type accepts

| Roll-up | Field types it can total |
| --- | --- |
| SUM | number, currency, percent |
| MIN / MAX | number, currency, percent, and also **date and date/time** |
| COUNT | none — it counts records, so no field is selected |

Dates are the trap: **MIN is the oldest date and MAX is the most recent.** "Earliest related
Opportunity" is MIN.

### What cannot be rolled up

- Autonumber fields
- A formula field that **references another object**
- A formula field using a **dynamic date function** such as `TODAY()` or `NOW()`

### Two constraints that arrive disguised as other questions

- A roll-up summary on the parent **blocks converting master-detail to lookup**. Delete the field
  first. The question will look like a relationship question.
- A roll-up summary **cannot be the Error Location** of a validation rule. It *can* be referenced
  inside that rule's formula. The distinction between the two is the whole question.

### Standard relationships that support roll-ups — exactly three

- Account ← Opportunity
- Opportunity ← Opportunity Product
- Campaign ← Campaign Member

Decoy: Contact ← Case. That one is a lookup, so it is not supported.

**Rolling up a lookup** takes Flow Builder, an Apex trigger, batch or scheduled Apex, or an
AppExchange tool such as Roll-up Helper. A cross-object formula does not help: it pulls a *parent*
value down to a child, and cannot aggregate children up to a parent.

---

## Sharing and visibility

*Diagnostic: this cluster accounted for several Fundamentals misses. Highest-priority section.*

### Three layers, in order

Each layer can only open up what the layer before it allowed.

1. **Object level** — profiles and permission sets. Read, Create, Edit, Delete.
2. **Record level** — organization-wide defaults first, then role hierarchy, sharing rules, and
   manual sharing.
3. **Field level** — field-level security. Visible or Read-Only.

The **organization-wide default sets the baseline, and the baseline is the only thing that
restricts**. Everything layered on top can only grant more.

- **Sharing rules never take access away.** Owner-based or criteria-based, they only open up. To
  restrict, tighten the OWD instead. This is the single most-tested misconception here.
- **The role hierarchy grants access vertically, never horizontally.** A manager sees records owned
  by or shared with people below them. Two peers in the same role still cannot see each other's
  records.
- **Manual sharing** covers the individual record that no rule can describe. Only the record owner,
  or someone with full access to that record, can grant it.
- A criteria-based sharing rule can optionally include records owned by **high-volume site or
  system users**.

### The two mechanisms that do take access away

The rule above has exactly two exceptions, and they are built to be confused with each other.

- **Restriction rules** genuinely revoke access. They limit a group of users to a subset of records,
  using user criteria plus record criteria. They exist only on custom objects, contracts, tasks,
  events, and external objects. A scenario naming Account or Opportunity is checking whether you
  know that list.
- **Scoping rules** change only the **default view**, by division, ownership, or record criteria.
  The records stay reachable through sharing settings. Same shape of name, opposite effect.

So the accurate summary is three-part: sharing rules only open up, restriction rules restrict, and
scoping rules change what you see first without changing what you can reach.

**Permission sets have the same exception.** A plain permission set is purely additive and can never
deny anything. A **muting permission set**, used inside a permission set group, disables selected
permissions for the users assigned to it. That is the one way a permission set takes something away.

**View All Records** and **Modify All Records** ignore record-level sharing entirely for their
object.

### Profiles, permission sets, groups, and queues

- Every user has exactly **one profile** and **zero or more permission sets**.
- To give a subset of users something extra, use a **permission set** rather than cloning a profile.
  Standard profiles cannot be edited directly anyway.
- **Restricted Profile Cloning**, in User Management Settings, stops a cloned profile from carrying
  permissions the org does not actually have.
- A public group is a **sharing target**. A queue **holds ownership** of records, so a team can work
  a shared pool.
- Both can contain users, roles, roles and subordinates, territories, and other public groups.
- Queues work on Tasks, Cases, Contact Requests, Service Contracts, Leads, Orders, Knowledge Article
  Versions, and custom objects. They do *not* work on Accounts, Contacts, or Opportunities.
- **Manager groups** come from the **Manager field on the User record**, not from the role hierarchy.
  Enable them in Sharing Settings, and Manager Groups and Manager Subordinates Groups appear as
  sharing rule targets.

### Campaign Member has two organization-wide defaults of its own

| Setting | Access comes from |
| --- | --- |
| Controlled by Campaign Member | the related **contact or lead** |
| Controlled by Campaign | the related **campaign** |

Every other object uses the standard options: Private, Public Read Only, Public Read/Write, and
Controlled by Parent.

**Field-level security vs. page layout.** Removing a field from a layout hides it in the interface
only. The value is still readable through reports and the API. Only field-level security actually
restricts it. Decoy: "remove it from the page layout."

---

## Mobile actions and layouts

*Diagnostic: two Fundamentals misses here.*

### Global vs. object-specific actions

| Aspect | Global action | Object-specific action |
| --- | --- | --- |
| Record context | none | the related record, automatically |
| Configured in | Setup → Global Actions | the object's page layout editor |
| Appears on | the (+) menu in the header, Home, the Chatter tab and groups, object pages, custom Lightning app pages | that object's record detail page |
| Action types only it offers | custom canvas, Aura components | **Update a Record**, flow, Aura and LWC |

**The fastest tiebreaker: only an object-specific action can update a record.** A global action has
no record context, so there is nothing for it to update. The same reasoning explains why flows and
LWCs appear on the object-specific side.

### Why an action does not show up

- A page layout that has never been customized **inherits the global publisher layout**.
- To add your own object-specific actions, tick **"Override global publisher layout."**
- An action renders only if it sits in the **Publisher Actions** section of the layout.
- Global publisher layouts are assigned **by profile**. Decoy: by role.

### Four flavors of action worth telling apart

- **Standard publisher actions** — Post, File, and Link. They arrive with Chatter and need feed
  tracking enabled per object.
- **Mobile smart actions** — a preconfigured bundle. It appears as **one element** in the layout
  editor and works in the **mobile app only**.
- **Productivity actions** — predefined by Salesforce and attached to a limited set of objects.
- **Dynamic actions** — control when an action is *visible*, based on conditions.

The navigation menu is configured in Setup → Salesforce Navigation. Users can reorder the items in
a Lightning app themselves, from their phone. **Smart Search Items** is what puts objects into the
Recent section.

---

## Chatter

*Diagnostic: two Fundamentals misses here.*

### The numbers, which are pure recall

| Fact | Value |
| --- | --- |
| Feed tracking fields per object | 20 |
| Maximum Chatter file size | 2 GB |
| Chatter Free licenses per standard license | 5,000 |
| Chatter External licenses per standard license | 500 |
| Custom objects a Chatter Only user may modify | 10 |

### Group privacy and broadcast are two separate questions

Privacy is public, private, or unlisted. **Broadcast is a separate flag**, and any of the three
privacy levels can carry it. In a broadcast group the owner and managers post, and members can only
respond. So a question about *who can post* is not a question about privacy.

**Private groups:** joining needs the owner's permission. The feed is visible to members, to the
system administrator, and to anyone with View All Data.

### Licenses

The three are Chatter Free, Chatter External, and Chatter Only, also called Plus. The Lightning
Platform license includes Chatter as well.

- **Chatter Free** gives feeds, people, groups, and files. It gives no access to Salesforce objects
  or data, and no tabs.
- **Chatter External** is for customers *outside the company email domain*. They see only the groups
  they are invited to.
- **Conversion runs one way.** Chatter Free can be upgraded at any time. A standard or Chatter Only
  license cannot be converted down to Chatter Free.

**Security:** Chatter has no sharing model of its own. Who can see a post follows **record or group
access**. Decoy: an organization-wide default "for Chatter."

Chatter is enabled by default, and a **profile-based rollout** is how you restrict it. Groups have
list views and customizable page layouts, much like objects. A flow can post to a user, to a group,
or to the triggering record's feed, mentioning people by ID.

---

## Leads and campaigns

*Diagnostic: flagged as a true blind spot rather than rust — no org experience to fall back on.*

**Conversion always creates an account and a contact, and creates an opportunity only if you ask for
one.** Existing accounts and contacts can be selected instead of new ones being created. Any answer
that makes the opportunity mandatory is wrong. Everything else here hangs off that one sentence.

### Four lead features, separated by when they act

| Feature | What it does |
| --- | --- |
| Web-to-Lead | **creates** the lead, from HTML embedded on a website |
| Auto-response rules | **reply** by email to a Web-to-Lead submission, chosen by the record's attributes |
| Assignment rules | **route** the lead, applying criteria to sort it, queue it, or act on it |
| Queues | **hold** leads that have no owner, so a team can share and distribute them |

Only Web-to-Lead brings a lead into existence. The other three act on leads that already exist, and
a queue is a valid target for an assignment rule.

A **lead process** defines which status values apply. Record types and page layouts are assigned to
a lead process, and that is how two teams end up with different status picklists on one object.

Also worth knowing: **Path** in Lightning Experience tracks the lead lifecycle, and social profiles
and LinkedIn can be linked to a lead.

### Campaigns

- Campaign members can be **contacts, leads, or person accounts**. Person accounts are the forgotten
  third. Opportunities are *never* campaign members.
- **Campaign hierarchy is a lookup** from campaign to campaign — a self-lookup, not master-detail.
  It is a useful counter-example to "grouping implies master-detail."

---

## Automation: choosing the tool

*Diagnostic: four Business Logic misses were flow-related.*

### Before-save vs. after-save

| Aspect | Before-save | After-save |
| --- | --- | --- |
| Runs | before the record is written to the database | after the record is written |
| Can update | the **triggering record only** | the triggering record, related records, and unrelated records |
| Interaction elements | **Custom Error Message only** | Custom Error Message, Action, Subflow |
| Scheduled and async paths | not available | available |
| Speed | faster | slower |
| Built for | defaulting or calculating a field on the record itself | cross-object updates, notifications, callouts, Apex |

If a requirement mentions anything beyond the triggering record — a related record, an email, an
Apex call, a scheduled path — it cannot be before-save. That single rule answers most questions
in this area.

### Flow types, by what triggers them

| Flow type | Triggered by | Built for |
| --- | --- | --- |
| Screen | a person: button, page, tab, or URL | guided input, call center scripts |
| Record-Triggered | a record being created, updated, or deleted | the before-save and after-save work above |
| Schedule-Triggered | a date and time schedule | recurring batch processing |
| Platform Event-Triggered | a platform event message | reacting to events from an external system |
| Autolaunched (no trigger) | another flow, a process, Apex, or the API | reusable logic |
| Orchestration | a record change, or a manual launch | multi-step, multi-user work spread over time |

### Decision shortcuts

- Several users, assigned sequential tasks over time → **Orchestration**
- A structured approve, reject, and **recall** cycle → **Approval Process**
- Collecting input from a person, step by step → **Screen Flow**
- Batch work on a schedule → **Schedule-Triggered Flow**

Orchestration and approval processes are not substitutes. A question describing a human approval
decision wants an approval process, even though orchestration also spans several users.

### Element gotchas

- **Subflow is not supported** in a platform event-triggered flow.
- **Custom Error** rolls back the record change, and it works in both before-save and after-save.
- **External Services** call a REST API declaratively. Give it an endpoint URL and a named
  credential registered in Setup, and Salesforce generates invocable actions from it.

**Flow Trigger Explorer** lists every record-triggered flow on an object. It splits them by trigger
type and by before or after save, shows which ones have asynchronous paths, and manages version
activation.

---

## Relationships

*Diagnostic: two Data Modeling misses were junction/relationship questions.*

| Aspect | Master-detail | Lookup |
| --- | --- | --- |
| The relationship field is | required on every child | optional |
| Child sharing | inherited from the parent | independent of the parent |
| Deleting the parent | **deletes the children too** | leaves the child in place |
| Roll-up summaries | supported | **not supported** |
| Maximum per object | **2** | many |
| Changing the parent | blocked unless "Allow reparenting" is ticked | always allowed |

### Two master-detail constraints people forget

- **Two per object, maximum.**
- **A standard object can never be on the detail side** when a custom object is the master.

Deleting a *detail* record sends it to the Recycle Bin and leaves the master untouched. The cascade
runs downward only.

**Requirement phrasing, translated.** "Deleted when the parent is deleted" or "inherits the parent's
sharing" means master-detail. "Must exist independently" means lookup.

### Junction objects (many-to-many)

- A junction object is a custom object carrying **two master-detail fields**, one for each parent.
- It provides **two standard report types**, each joining the two masters and the junction.
- **The master listed first in the report type determines which records the report can return.**
  Niche, and exactly the sort of detail that decides a reporting question.
- Access to junction records comes from the **sharing settings on both parents**.

### Self-relationships

A lookup can point an object at itself, such as a Contact's 'Assistant'. **User is the exception**:
it needs a **hierarchical relationship** instead, and hierarchical relationships exist only on User.
The two make ideal distractors for each other.

**External objects** support lookup, external lookup, and indirect lookup.

Every lookup relationship also generates a **standard report type**, and lookup fields can be added
to custom report types.

---

## Validation rules

*Diagnostic: one Business Logic miss.*

**A validation rule fires when its formula evaluates to TRUE.** The formula describes the *error*
condition, not the valid state. Getting that backwards is the classic mistake.

**Validation runs before workflow rules and processes.** That ordering explains the gotcha below.

### When validation applies, and the two exceptions

| Situation | Validated? |
| --- | --- |
| Normal create and edit | yes |
| Data import | yes |
| Web-to-Lead and Web-to-Case | yes |
| A field missing from the page layout or from the API call | yes — the rule still applies |
| Quick Create | **no** |
| Lead conversion | **only if the org has enabled it** |

**The invalid-data gotcha:** workflow field updates and scheduled actions in a process **do not fire
validation rules**. They can leave a record that was valid holding values the rule would have
rejected. Field-level security, hidden fields, and assignment rules can produce the same puzzling
result.

Use cases worth recognizing: enforcing a value range, using **REGEX** to enforce a format,
validating across objects, enforcing field dependency, and making a standard field effectively
required.

---

## Data import and export

*Diagnostic: two Data Modeling misses.*

**50,000 records is the dividing line between the two tools.**

| Aspect | Data Import Wizard | Data Loader |
| --- | --- | --- |
| Volume | under 50,000 records | 50,000 up to **150 million** |
| Objects | Accounts, Contacts, Leads, Solutions, Campaign Members, Person Accounts, and custom objects | **all** standard and custom objects |
| Operations | insert, update, upsert | insert, update, upsert, and also **delete, hard delete, export, Export All** |
| Suppressing workflow and processes | a **built-in option** | not available — deactivate them by hand first |
| Duplicate prevention | yes, with richer matching | ID and External ID matching only |
| Can be scheduled | no | **yes, from the command line** |
| Installation | none, it lives in Setup | a client app that must be downloaded |

**Two ways a question steers you to Data Loader:** the volume is over 50,000, or the object is one
the wizard does not support. The wizard's list notably excludes **Opportunities and Cases**.

**Export All** exists only in Data Loader, and it includes archived records and the Recycle Bin.
Plain Export does not.

**Importing related records:** load **parents before children**, and include a column of parent
record IDs in the child file. Imported data still has to satisfy required fields and validation
rules.

**Data Loader defaults:** a blank owner becomes the user running the import, and a blank currency
becomes the corporate currency. A value for an *unrestricted* picklist imports fine, but it is not
added to that picklist's active values.

---

## Sandboxes and the application lifecycle

*Diagnostic: only 10% of the exam, but the app's thinnest coverage — worth an evening, not a week.*

| Sandbox | Data storage | What it starts with | Minimum wait between refreshes |
| --- | --- | --- | --- |
| Developer | 200 MB | configuration only | **1 day** |
| Developer Pro | 1 GB | configuration only | **1 day** |
| Partial Copy | 5 GB, with file storage matching production | the subset a template defines | **5 days** |
| Full Copy | same as production | all production data, unless a template narrows it | **29 days** |

**The two numbers that matter are 5 and 29.** A scenario stressing frequent refreshes is pushing you
away from Full Copy. One demanding production-identical scale is pushing you toward it.

**Only Partial Copy and Full Copy contain records.** Any requirement that mentions real data rules
out both developer types immediately.

- **Partial Copy requires a template**, because the template is what defines the subset. Full Copy
  may use one optionally, to copy less.
- **Full Copy is for** performance testing, load testing, and staging that matches production.
- **Developer Pro is for** larger data volumes, integrating several developer sandboxes, QA, and
  user training.

### Three gotchas that read like bugs

- **A new or refreshed sandbox sends no email.** Salesforce sets deliverability to "System Email
  Only" so a test environment cannot mail real contacts. Change it under Email Deliverability.
- **A refresh is a replacement, not a merge.** It builds a fresh copy from production under the same
  name, and undeployed work in that sandbox is gone. Activation can be deferred, using "activate
  when ready," so the old copy stays usable meanwhile.
- **Full Copy preserves record IDs**, and field IDs carry across to sandboxes generally. That matters
  to anything referencing an ID, such as a Web-to-Case form.

**Editions differ.** Availability varies and some types cost extra. Enterprise does not include Full
Copy; Performance and Unlimited do.

### Lifecycle: plan → build → test → deploy

- *Simple:* change production directly, isolating the work with profiles.
- *With a sandbox:* build and test in the sandbox, then move the work with change sets.
- *Advanced, for parallel projects:* give each project or developer a sandbox, consolidate the work
  in an **integration sandbox**, promote it to a **UAT sandbox** for acceptance testing and training,
  then release to production.

---

## Change sets

*Diagnostic: this was the very first question missed on the practice exam.*

**Change sets move metadata, never data.** A list of contact records cannot travel in a change set;
that needs Data Loader. This is the most-tested fact here, and almost certainly what the "which
cannot be transferred" question was after.

**They work between related orgs only.** A change set needs a **deployment connection**, which
exists between a production org and its own sandboxes. Creating a sandbox establishes one
automatically. The target org must also allow inbound changes.

A change set is created as **outbound** in the source org, and arrives as **inbound** in the target.

### The four hard limits

| Limit | What it means in practice |
| --- | --- |
| Components cannot be deleted or renamed | do it by hand in the target; a renamed component arrives as a brand new one, and the original stays behind |
| Deployment overwrites, never merges | changes made directly in the target are lost |
| All or nothing | one failure rolls the whole deployment back, and there is no partial deploy |
| Deployment order cannot be expressed | split the work into two change sets when sequence matters |

Not every metadata type is supported. Unsupported ones have to be configured by hand in the target.

**Two defaults that run in opposite directions**, which is why they get tested together:

- A deployed **list view is visible to all users**.
- A deployed **custom tab is hidden from all users**. Include the profiles to fix its visibility.

### Other considerations

- **Permission sets** are components in their own right. **Profiles** are not: they ride along under
  *"Profile Settings for Included Components."*
- **A report in a private folder cannot be added.** Move it to a shared folder first.
- **Flows and processes deploy inactive by default.** This is the classic "deployment succeeded but
  nothing happens." Deploying them active brings a test-coverage requirement, and the
  minimum-percentage option exists only in production, because sandboxes always allow active
  versions.
- **An uploaded change set cannot be edited**, and its status becomes Closed. Clone it to make a
  variant. The same change set can be uploaded to several connected orgs.
- **Validate** is a dry run in the target. It reports success or failure and commits nothing.

### Troubleshooting cues

- *Insufficient Privileges* on Deployment Connections → the org probably has **no sandboxes
  provisioned**
- The deployment fails → a **dependent component is missing** from the target
- The change set has vanished → it **expired**, it was **deleted at the source**, or the **source
  sandbox was deleted or refreshed**
- A **cross-version validation error** → source and target are running different Salesforce versions

---

## Approval processes

*Added after a live miss in the app — this was the one gap the practice exam hadn't already flagged.*

### Locking, which is where most questions live

| Event | Record state afterwards |
| --- | --- |
| Initial submission | **locked**, by default |
| Final approval or rejection | your choice: locked or unlocked |
| Recall | **unlocked**, by default |

**Locking is not absolute.** While a record is locked, the system administrator, the assigned
approver, and anyone with Modify All Data can still edit it. The Record Editability setting controls
this.

### Actions

Actions can fire at **four stages**: initial submission, final approval, final rejection, and
**recall**. Recall is the one people forget.

The same **four action types** are available at every stage: **Create a Task, Email Alert, Field
Update, and Outbound Message**.

Note what is absent. An approval process cannot create or delete records. Any option offering
"Create a Record" or "Call Apex" is wrong.

### Parallel approval has exactly two modes

- **Unanimous** — everyone must approve, and a single rejection rejects the whole request.
- **First response** — the first approver to answer decides it.

There is **no majority option**. That is the standard distractor.

### Who can approve

An approver can be a user or queue the submitter picks; a user, users, related users, or queue the
admin configures, **up to 25 per step**; a designated approver such as a manager; or a delegated
approver.

- **Manager approval reads the Manager field on the User record**, not the role hierarchy. A custom
  hierarchical field works too.
- **Dynamic routing** means the approver can be any related user field on the record.
- **A delegated approver can approve or reject, but cannot reassign.** Set one in Approver Settings
  on the user record. The step must also allow delegates.

Submission can be triggered by a Submit for Approval button, a **flow**, or an **Apex trigger**.

**Mobile gotcha:** approval notifications are **not sent to queues or delegates**. Individual users
have to be assigned to a step for mobile push to reach anyone.

### The settings that get confused with each other

| Setting | What it controls |
| --- | --- |
| Entry criteria | which records may enter the process **at all** |
| Step criteria | whether a record enters **that particular step** |
| "Not meeting criteria" action | what happens when a step's criteria fail: skip the step, or reject the record |
| Approver Field | the user field on the record, standard or custom, used to derive the approver; the record owner is also an option |
| Record Editability | whether the assigned approver and the administrator may edit a locked record |
| Approval Request Page Layout | which fields the approver sees while deciding |
| Initial Submitters | who may submit: users, roles, or public group members — not profiles |

Entry versus step criteria is the pairing most worth keeping straight. Entry criteria gate the
process; step criteria gate the step. Conditional routing — skipping director sign-off below some
threshold — is built from step criteria plus the "not meeting criteria" action, never from entry
criteria.

**Approval History** is a related list of its own. It retains comments and the approval or rejection
status across the original submission and every resubmission. It is not the Setup Audit Trail, which
tracks configuration changes.

Approval processes live under **Process Automation** in Setup.

---

## User interface

*Added after the question bank exam: roughly a quarter of its 20 questions were User Interface —
far more than its 17% weight suggested, and the domain that had been deliberately skipped.*

### Compact layouts

A compact layout drives three surfaces: the **record highlights panel**, the **lookup hover card**,
and the **record landing page in the mobile app**. Related lists are not one of them; those come
from the page layout.

- A new compact layout does nothing until it is **marked primary**. The system default is read-only
  and cannot be deleted.
- It supports every field type except four: **Text Area, Long Text Area, Rich Text Area, and
  Multi-Select Picklist**. All four are things that cannot render on one compact line.

### How Lightning pages are assigned

| Page type | Can be assigned by |
| --- | --- |
| Lightning **Home** page | app, or app plus profile |
| Lightning **Record** page | app, profile, **record type**, and **form factor** |

Role, permission set, and queue are never assignment criteria for either one. They are the standard
wrong answers.

### Record page vocabulary

- **Three record page layouts:** Grouped View, Full View, and **Record View**, which is Lightning
  console only. "Compact View" is not one of them; that word belongs to compact layouts.
- Record pages accept three kinds of component: **standard, custom, and third-party**.
- The **Accordion** component is the vertical equivalent of Classic's Tabs.
- Templates state which **form factors** they support: desktop only, or desktop and phone.
- **Three related list types:** Basic List, Tile, and **Enhanced List**. Only Enhanced List adds a
  row count, column resizing and sorting, text wrapping, and mass actions.

### Page layouts and mini page layouts

**Page layouts** control fields, sections, buttons, links, actions, and related lists, and they are
associated with **profiles**. Visualforce pages can be embedded in them. **A field created in Schema
Builder has to be placed on the layout by hand** — the field wizard offers to do it, Schema Builder
does not.

**Mini page layouts** apply to the Agent console mini view, hover details, and event overlays. They
inherit record type and profile associations, related lists, fields, and field access from their
parent layout. **Hover details are Salesforce Classic only.**

### List views

- Users set their own default by **pinning** a list view. No admin is needed.
- **There are exactly three chart types: vertical bar, horizontal bar, and donut.** Not line, not
  pie.
- The fields shown in **Recently Viewed** are configured under **Search Layouts**, not in the list
  view itself. Unintuitive, therefore testable.
- In Classic, list views on **contacts, leads, users, and cases** can build mass email recipient
  lists. Accounts cannot.
- Lightning adds inline editing, Kanban and Split views, infinite scrolling, and list view charts.

---

## Not yet covered

Every cluster the practice exam flagged is now covered. What remains was never implicated by a
question you actually missed.

| Domain | Weight | Covered | Still open |
| --- | --- | --- | --- |
| Business Logic | 28% | 4 of 6 | formula fields, avoiding automation errors |
| Salesforce Fundamentals | 23% | 6 of 9 | reports, report types, dashboards |
| Data Modeling | 22% | 3 of 7 | record types, field data type changes, Schema Builder |
| User Interface | 17% | 1 of 5 | Lightning components, declarative and programmatic, plus custom buttons and links |
| App Deployment | 10% | 3 of 4 | deployment plan |

**Read the User Interface row carefully.** It is the second heaviest domain and still mostly
untouched, and skipping it is still the right call. At 90% accuracy it is worth only about 1.7
points of recoverable score, less than any other domain. That is a decision, not an oversight.

**If more time appears, in this order:** formula fields (Business Logic, 28%), then record types and
field data type change considerations (Data Modeling, 22%). Both sit adjacent to questions you
missed without being the direct cause.

**A better use of that time:** take Practice Exam 2 and re-target from the result. This digest was
built from a single 60-question sample, and a second sample is worth more than another topic.
