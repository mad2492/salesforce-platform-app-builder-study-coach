# Niche Facts — Platform App Builder

The details that actually separate answers. Written for skimming in short gaps, not for
reading front to back. Each **Decoy** line is the wrong answer the question will dangle.

Coverage: 16 of roughly 31 course topics, chosen by what the practice exam said you actually
missed rather than by working through the course in order. See "Not yet covered" at the bottom.

---

## Declarative vs. programmatic boundaries

**Retirement dates are separate — and that's the question.**

| Tool | New creation blocked |
| --- | --- |
| Workflow Rules | Winter '23 |
| Process Builder | Summer '23 |

- Creation survives **only in Developer Edition orgs, for use in managed packages**.
- Anything already in the org **keeps running** and can still be edited, activated, deactivated.
- **Migrate to Flow** (in Setup) converts workflow rules and processes. **Not** Apex triggers.
- Decoy: "new processes can still be created in production." No.

**The one requirement with no declarative option at all:**

- **Providing** a custom web service → always Apex.
- **Consuming** one → Flow Builder for the simple case, Apex once the logic gets complex.

That asymmetry is worth memorizing as a pair; questions test the direction.

**Other hard boundaries (Apex or custom components required):**

- Inbound email processing beyond Email-to-Case settings → **Apex email service handler**
- Complex validation beyond validation rules → Apex
- Reporting beyond the report builder → Visualforce / custom Lightning component + Apex
  - Decoy: "create a new report type" or "share the folder." Those address *which data* and
    *which users*, not the builder's own limits.

**Visualforce vs. custom Lightning components** — the tiebreaker is visual design.
Visualforce **retains the Salesforce Classic look**. So any requirement phrased as
"must not look like Classic," "override a standard action in Lightning Experience," or
"invoke custom client-side behavior in LEX" rules Visualforce out regardless of everything else.

**Three ways to extend an org:** Configure (Setup) · Buy (AppExchange) · Build (code).
Decoy: "ask Salesforce Support to add the feature."

**Cited advantages of declarative:** faster to deliver, less maintenance, automatic upgrades
each release, cheaper. It does *not* remove the need to test.

---

## AppExchange and packages

**Five solution types** — the type is shown right under the name on the listing page:
Salesforce App · Lightning Data · Bolt Solution · Flow · Component

**Managed vs. unmanaged — the four-way contrast that gets tested:**

| | Managed | Unmanaged |
| --- | --- | --- |
| Built from | Developer Edition org | any org |
| Upgradeable | yes, fully | **no** — creator cannot upgrade it |
| Components | locked / limited | fully editable |
| Apex code | hidden from subscriber | readable and modifiable |
| Typical use | partners selling apps | open-source, templates |

- Managed = **intellectual property protection**. Subscribers can't view the Apex.
- Unmanaged = distributing editable templates. **Not upgradeable** is the fact most often missed.
- Packages install into **sandbox or production**.

**When to install rather than build:** the app is already developed, proven and reviewed by
Salesforce, and often ships with support and maintenance — which matters most when you lack
resources to maintain a custom solution.

**Lightning Data** — validates CRM data against outside sources; aimed at **Sales and Marketing**.

---

## Roll-up summary fields

**Only on the master side of a master-detail relationship.** Recalculated whenever a
referenced detail record is saved.

**Limits:**

- **25 per object by default; Salesforce Support can raise it to 40.**

**Field type support — memorize as a pair:**

| Roll-up type | Accepts |
| --- | --- |
| SUM | number, currency, percent |
| MIN / MAX | number, currency, percent, **date, date/time** |
| COUNT | no field selected at all |

**Over dates: MIN = oldest, MAX = most recent.** Easy to invert when rushing. "Earliest
related Opportunity" → MIN.

**Cannot roll up:**

- Autonumber fields
- A formula field with a **cross-object** reference
- A formula field using **dynamic date functions** (`TODAY()`, `NOW()`)

**Two constraints that look like they're about something else:**

- A roll-up summary field on the parent **blocks converting master-detail → lookup.**
  Delete the field first. Questions frame this as a relationship problem.
- It **cannot be the Error Location field** on a validation rule — though it *can* be
  referenced in the rule's formula. The distinction is the whole question.

**Supported standard relationships — exactly three:**

- Account ← Opportunity
- Opportunity ← Opportunity Product
- Campaign ← Campaign Member

Decoy: Contact ← Case. That's a lookup; not supported.

**Lookup relationship workarounds:** Flow Builder · Apex trigger · batch/scheduled Apex ·
AppExchange tool (e.g. Roll-up Helper). A cross-object formula can pull a *parent* value down
to a child, but cannot aggregate children up to a parent.

---

## Sharing and visibility

*Diagnostic: this cluster accounted for several Fundamentals misses. Highest-priority section.*

**Three layers, in order.** Each opens up what the one before it allows:

1. **Object-level** — profiles and permission sets. Read / Create / Edit / Delete.
2. **Record-level** — organization-wide defaults, then role hierarchy, sharing rules, manual sharing.
3. **Field-level** — field-level security. Visible / Read-Only.

**Organization-wide defaults set the baseline, and the baseline is the only thing that
restricts.** Everything layered on top can *only* grant more.

- **Sharing rules cannot take access away.** Owner-based or criteria-based, they only open up.
  To restrict, tighten the OWD. This is the single most-tested misconception here.
- **Role hierarchy grants access vertically, never horizontally.** A manager sees records owned
  by or shared with people below them. Two peers in the same role still can't see each other.
- **Manual sharing** is for individual records when no rule can describe the users or criteria.
  Only the **record owner or someone with full access** can do it.
- Criteria-based sharing rules have an option to include records owned by **high-volume site
  or system users**.

**Correction to the rule above: two mechanisms *do* take access away.**

- **Restriction rules** genuinely revoke access — they limit a group of users to a subset of
  records using **user criteria + record criteria**. Available **only** on **custom objects,
  contracts, tasks, events, and external objects**. A scenario naming Account or Opportunity is
  checking whether you know that.
- **Scoping rules** only filter the **default view** (by division, ownership, or record criteria).
  **Records stay accessible through sharing settings.** Similar name, opposite effect — the two
  are made for each other as distractors.

So the accurate version: *sharing rules* only open up; restriction rules restrict; scoping rules
change what you see first without changing what you can reach.

**Same correction on the permission-set side.** A plain permission set is purely additive and
cannot deny anything — but a **muting permission set**, inside a permission set group, disables
selected permissions for assigned users. That's the one way a permission set takes something away.

**View All Records / Modify All Records** override record-level sharing entirely for that object.

**Profiles vs. permission sets, by count:** exactly **one** profile per user; **zero to many**
permission sets.

**Public groups vs. queues:** groups are a **sharing target**; queues **hold ownership** so a team
can work a shared pool. Both can contain users, roles, roles and subordinates, territories, and
other public groups. Queues work on **Tasks, Cases, Contact Requests, Service Contracts, Leads,
Orders, Knowledge Article Versions, and custom objects** — *not* Accounts, Contacts, or
Opportunities.

**Manager groups** derive from the **Manager field on the User record**, not the role hierarchy.
Enable in Sharing Settings; then Manager Groups and Manager Subordinates Groups appear as sharing
rule targets.

**Campaign Member has two special OWDs — know the pair:**

| Setting | Access derives from |
| --- | --- |
| **Controlled by Campaign Member** | the related **contact or lead** record |
| **Controlled by Campaign** | the related **campaign** |

Standard OWD options otherwise: Private · Public Read Only · Public Read/Write · Controlled by Parent.

**Field-level security vs. page layout** — removing a field from a layout hides it *in the
interface only*. The value is still reachable through reports and the API. Real restriction
requires FLS. Decoy: "remove it from the page layout."

**Profiles vs. permission sets** — reach for a **permission set** to give a subset of users
something extra; don't clone a profile. Standard profiles can't be edited directly anyway.
**Restricted Profile Cloning** (User Management Settings) stops a clone from carrying
permissions the org doesn't actually have.

---

## Mobile actions and layouts

*Diagnostic: two Fundamentals misses here.*

**Global vs. object-specific — the distinction the exam actually tests:**

| | Global | Object-specific |
| --- | --- | --- |
| Record relationship | **none** automatic | auto-associated with the related record |
| Configured in | Setup → Global Actions | the object's **page layout editor** |
| Found on | (+) in the header, home, Chatter tab and groups, object pages, custom Lightning app pages | that object's record detail page |
| Extra action types | custom canvas, **Aura** components | **Update a Record**, **flow**, Aura **and LWC** |

**The fastest tiebreaker: only object-specific actions can *update* a record.** A global action
has no record context, so there's nothing for it to update. Same logic for flows and LWCs.

**Layout inheritance — the rule behind "why don't my actions show up":**

- An object page layout that hasn't been customized **inherits the global publisher layout**.
- Adding your own object-specific actions requires ticking **"Override global publisher layout."**
- Actions must sit in the **Publisher Actions** section of the page layout to render.
- Global publisher layouts are assigned **by profile**. Decoy: by role.

**Action flavors worth telling apart:**

- **Standard publisher actions** — Post, File, Link. Arrive with Chatter; need **feed tracking** per object.
- **Mobile smart actions** — preconfigured bundle, **one element** in the layout editor,
  **mobile app only**.
- **Productivity actions** — predefined by Salesforce, attached to a limited set of objects.
- **Dynamic actions** — control action *visibility* conditionally.

Navigation menu lives in Setup → Salesforce Navigation. Users can reorder Lightning app items
themselves from the phone. **Smart Search Items** puts objects into the Recent section.

---

## Chatter

*Diagnostic: two Fundamentals misses here.*

**The numbers — pure recall, and they show up:**

| Fact | Value |
| --- | --- |
| Feed tracking fields per object | **20** |
| Max Chatter file size | **2 GB** |
| Chatter Free per standard license | **5,000** |
| Chatter External per standard license | **500** |
| Custom objects a Chatter Only user may modify | **10** |

**Group types are two independent questions.** Privacy is public / private / unlisted.
**Broadcast is a separate flag** that any of the three can carry — owner and managers post,
members may only respond. A question about *who can post* is not a question about privacy.

**Private group access:** joining needs the owner's permission; the feed is visible to members,
the system administrator, and users with **View All Data**.

**Licenses:** Chatter Free · Chatter External · Chatter Only (Plus). Lightning Platform also
includes Chatter.

- **Chatter Free** — feeds, people, groups, files. **No Salesforce objects or data, and no tabs.**
- **Chatter External** — customers *outside the company email domain*, limited to groups they're
  invited to.
- **Conversion runs one way:** Chatter Free can be upgraded any time; a standard or Chatter Only
  license **cannot** be converted down to Chatter Free.

**Security:** Chatter has no sharing model of its own. Post visibility follows **record or group
access**. Decoy: an organization-wide default "for Chatter."

Chatter is enabled by default; restrict it with **profile-based rollout**. Groups have list views
and customizable page layouts, like objects. Flow can post to a **user**, a **group**, or the
**triggering record's** feed, mentioning people by ID.

---

## Leads and campaigns

*Diagnostic: flagged as a true blind spot rather than rust — no org experience to fall back on.*

**The one fact everything else hangs off: conversion creates an account and a contact
*always*, and an opportunity *optionally*.** Existing accounts and contacts can be selected
instead of new ones being created. Any answer that makes the opportunity mandatory is wrong.

**Four features that get confused with each other — separate them by *when* they act:**

| Feature | Acts |
| --- | --- |
| **Web-to-Lead** | *creates* the lead, from HTML embedded on a website |
| **Auto-response rules** | *replies* by email to a Web-to-Lead submission, chosen by record attributes |
| **Assignment rules** | *routes* — applies criteria to sort, queue, or act on leads |
| **Queues** | *holds* leads with no owner, so a team can share and distribute them |

Only Web-to-Lead brings a lead into existence. The other three act on leads that already exist,
and a queue is a valid assignment-rule target.

**Lead process** defines which status values apply. Record types and page layouts are assigned
to the process — that's how two teams get different status picklists on one object.

Also: **Path** (Lightning Experience) tracks lead lifecycle. Social profiles and LinkedIn can be
linked to leads.

**Campaigns:**

- **Campaign members can be contacts, leads, or person accounts.** Person accounts are the
  forgotten third. Opportunities are *never* campaign members.
- **Campaign hierarchy is a lookup relationship** between campaigns — a self-lookup, not
  master-detail. Useful counter-example to "grouping implies master-detail."

---

## Automation: choosing the tool

*Diagnostic: four Business Logic misses were flow-related.*

**Before-save vs. after-save is the highest-yield distinction in this domain:**

| | Before-save | After-save |
| --- | --- | --- |
| Runs | before commit | after commit |
| Can update | **triggering record only** | triggering record, related records, other records |
| Interaction elements | **Custom Error Message only** | Custom Error Message, Action, Subflow |
| Scheduled / async paths | **no** | yes |
| Speed | faster | slower |
| Use for | field defaulting, calculated fields | cross-object updates, notifications, callouts, Apex |

If a requirement mentions *anything* beyond the triggering record — a related record, an email,
an Apex call, a scheduled path — it cannot be before-save. That one rule answers most of them.

**Flow types, by trigger:**

| Type | Triggered by | Use for |
| --- | --- | --- |
| Screen | manual — button, page, tab, URL | guided input, call center scripts |
| Record-Triggered | record create / update / delete | see table above |
| Schedule-Triggered | date/time schedule | recurring batch processing |
| Platform Event-Triggered | platform event message | reacting to external system events |
| Autolaunched (no trigger) | another flow, process, Apex, API | reusable logic |
| Orchestration | record change or manual | multi-step, multi-user work over time |

**Decision shortcuts:**

- Multiple users, sequential assigned tasks over time → **Orchestration**
- Structured approve / reject / **recall** cycle → **Approval Process**
- Guided input collection → **Screen Flow**
- Batch on a schedule → **Schedule-Triggered**

Orchestration and approval processes are *not* substitutes — a question describing a human
approval decision wants an approval process even though orchestration also spans users.

**Element gotchas:**

- **Subflow is not supported in platform event-triggered flows.**
- **Custom Error** rolls back the record change, and works in **both** before-save and after-save.
- **External Services** call a REST API declaratively — needs an endpoint URL and a **named
  credential** registered in Setup; Salesforce then generates invocable actions.

**Flow Trigger Explorer** shows every record-triggered flow on an object, split by trigger type
and before/after save, including which have asynchronous paths, and manages version activation.

---

## Relationships

*Diagnostic: two Data Modeling misses were junction/relationship questions.*

| | Master-detail | Lookup |
| --- | --- | --- |
| Relationship field | **required** | optional |
| Security / sharing | child **inherits** from parent | independent |
| Deletion | **cascades** to children | independent |
| Roll-up summaries | yes | **no** |
| Max per object | **2** | many |
| Reparenting | **off by default** ("Allow reparenting" to enable) | free |

**Two master-detail constraints people forget:**

- **Two per object, maximum.**
- **A standard object cannot be on the detail side when a custom object is the master.**

**Deleting a *detail* record** sends it to the Recycle Bin and leaves the master alone. Cascade
runs downward only.

**Requirement phrasing → answer:** "deleted when the parent is deleted" or "inherits the parent's
sharing" → master-detail. "Must exist independently" → lookup.

**Junction objects (many-to-many):**

- A custom object carrying **two master-detail relationship fields**, one per parent.
- Provides **two standard report types**, joining the masters and the junction.
- **The master object listed first in the report type determines record scope.** Niche, and
  exactly the sort of detail that decides a reporting question.
- Access to junction records is governed by the **sharing settings on each parent**.

**Self-relationships:** a lookup can point an object at itself — Contact → 'Assistant'.
**The exception is User**, which needs a **hierarchical relationship** instead. Hierarchical
exists *only* on User. These two make ideal distractors for each other.

**External objects** support lookup, external lookup, and indirect lookup.

Each lookup relationship also generates a **standard report type**, and lookup fields can be
added to custom report types.

---

## Validation rules

*Diagnostic: one Business Logic miss.*

**The rule fires when the formula is TRUE.** The formula describes the *error condition*, not the
valid state. Getting this backwards is the classic mistake.

**Validation runs before workflow rules and processes.** That ordering explains the gotcha below.

**When they apply — memorize the exceptions, not the rule:**

| Situation | Validated? |
| --- | --- |
| Normal create and edit | yes |
| Data import | yes |
| Web-to-Lead / Web-to-Case | **yes** |
| Field not on the page layout, or absent from the API call | **yes — still applies** |
| **Quick Create** | **no** |
| **Lead conversion** | **only if enabled in the org** |

**The invalid-data gotcha:** workflow field updates and process scheduled actions **do not
trigger validation rules**, so they can leave a previously valid record holding values the rule
would reject. Field-level security, hidden fields, and assignment rules can likewise cause
records to fail validation in ways that look mysterious.

Use cases worth recognizing: value ranges, **REGEX** for format enforcement, cross-object
validation, field dependency, making a standard field effectively required.

---

## Data import and export

*Diagnostic: two Data Modeling misses.*

**50,000 records is the dividing line.**

| | Data Import Wizard | Data Loader |
| --- | --- | --- |
| Volume | **under 50,000** | ~50,000 up to **150 million** |
| Objects | Accounts, Contacts, Leads, Solutions, Campaign Members, Person Accounts, custom | **all** standard and custom |
| Operations | insert, update, upsert | insert, update, upsert, **delete, hard delete, export, Export All** |
| Suppress workflow/processes | **yes, built-in option** | no — deactivate manually first |
| Prevent duplicates | yes, richer matching | ID / External ID matching only |
| Schedule | **no** | **yes, via the command line** |
| Install | native, in Setup | client app, must be downloaded |

**Two ways a question steers you to Data Loader:** volume over 50,000, *or* an object the wizard
doesn't support. The wizard's list notably **excludes Opportunities and Cases**.

**Export All** is Data Loader only and includes **archived records and the Recycle Bin** —
distinct from plain Export.

**Relationships on import:** load **parents before children**, and include a column of **parent
record IDs** in the child file. Imported data still honors required fields and validation rules.

**Data Loader defaults:** blank owner → **the user running the import**; blank currency → **the
corporate currency**. A value for an *unrestricted* picklist imports fine but is **not** added to
the active picklist values.

---

## Sandboxes and the application lifecycle

*Diagnostic: only 10% of the exam, but the app's thinnest coverage — worth an evening, not a week.*

| Type | Data storage | Initial data | Refresh |
| --- | --- | --- | --- |
| Developer | 200 MB | **configuration only** | **1 day** |
| Developer Pro | 1 GB | **configuration only** | **1 day** |
| Partial Copy | **5 GB** (file storage = production) | subset defined by **template** | **5 days** |
| Full Copy | same as production | all data (template can subset it) | **29 days** |

**The two numbers that matter: 5 and 29.** A scenario emphasizing frequent refreshes is pushing
you away from Full Copy; one demanding production-identical scale is pushing you toward it.

**Only Partial and Full contain records.** Any requirement mentioning real data rules out both
developer types immediately.

- **Partial Copy *requires* a template** — it's what defines the subset. Full Copy may optionally
  use one to reduce what it copies.
- **Full Copy purpose:** performance testing, load testing, staging identical to production.
- **Developer Pro purpose:** larger data volumes, integrating multiple developer sandboxes, QA and
  user training.

**Gotchas that read like bugs:**

- **A new or refreshed sandbox sends no email** — Salesforce sets deliverability to **"System Email
  Only"** so test environments can't mail real contacts. Change it under Email Deliverability.
- **A refresh is a replacement, not a merge.** It builds a fresh copy from production and keeps
  the name; undeployed work in that sandbox is gone. Activation can be automatic or deferred
  ("activate when ready") so the old one stays usable meanwhile.
- **Record IDs are preserved in Full Copy**, and field IDs carry to sandboxes generally — which
  matters for anything referencing them, like a Web-to-Case form.

**Edition:** availability varies, and some types cost extra. **Enterprise does not include Full
Copy; Performance and Unlimited do.**

**Lifecycle phases: plan → build → test → deploy.**

- *Simple:* change production directly, isolating work with profiles.
- *With a sandbox:* build and test in the sandbox, then move via change sets.
- *Advanced (parallel projects):* each project or developer gets a sandbox → consolidate in an
  **integration sandbox** → promote to a **UAT sandbox** for acceptance testing and training →
  production.

---

## Change sets

*Diagnostic: this was the very first question missed on the practice exam.*

**Change sets move metadata, never data.** A list of contact records cannot travel in a change
set — that needs Data Loader. This is the most-tested fact here and almost certainly what the
"which cannot be transferred" question was after.

**Related orgs only.** They require a **deployment connection**, which exists between a production
org and its sandboxes. Creating a sandbox establishes one automatically; the target org must
separately allow inbound changes.

**Outbound** is created in the source org; it arrives as **inbound** in the target.

**The four hard limits:**

| Limit | Consequence |
| --- | --- |
| **Cannot delete or rename** components | do it manually in the target — a renamed component arrives as a **brand new** one, leaving the original behind |
| **Overwrites, never merges** | changes made directly in the target are lost |
| **All or nothing** | one failure rolls the whole deployment back; no partial deploy |
| **Cannot express deployment order** | split into two change sets when sequence matters |

Not all metadata types are supported — unsupported ones must be configured manually in the target.

**Two defaults that run opposite ways, so they get tested together:**

- Deployed **list views are visible to all users**.
- Deployed **custom tabs are hidden from all users**. Include the profiles to fix visibility.

**Other considerations:**

- **Permission sets** are components. **Profiles** are not — they ride along under *"Profile
  Settings for Included Components."*
- **Reports in private folders cannot be added.** Move to a shared folder first.
- **Flows and processes deploy as inactive by default** — a classic "deployment succeeded but
  nothing happens." Deploying active brings a test-coverage requirement, and the minimum-percentage
  option exists **only in production**, since sandboxes always permit active versions.
- An uploaded change set **cannot be edited** — status goes **Closed**. **Clone** it to make a
  variant. It can be uploaded to several connected orgs.
- **Validate** is a dry run in the target: success or failure, nothing committed.

**Troubleshooting cues:**

- *Insufficient Privileges* on Deployment Connections → the org likely has **no sandboxes provisioned**
- Deployment fails → a **dependent component is missing** from the target
- Change set vanished → it **expired**, was **deleted at source**, or the **source sandbox was
  deleted or refreshed**
- **Cross-version validation error** → source and target are on different Salesforce versions

---

## Approval processes

*Added after a live miss in the app — this was the one gap the practice exam hadn't already flagged.*

**Locking, which is where most questions live:**

| Event | Record state |
| --- | --- |
| Initial submission | **locked** (default) |
| Final approval / rejection | your choice — locked or unlocked |
| **Recall** | **unlocked** (default) |

**Locking is not absolute.** While locked, the **system administrator**, the **assigned approver**,
and anyone with **Modify All Data** can still edit. The Record Editability setting controls this.

**Four action stages: initial submission · final approval · final rejection · recall.**
*Recall is the one people forget.*

**Four action types, same at every stage — memorize verbatim:**
**Create a Task · Email Alert · Field Update · Outbound Message**

Note what's missing: approval processes **cannot create or delete records**. Any option offering
"Create a Record" or "Call Apex" is wrong.

**Parallel approval has exactly two modes:**

- **Unanimous** — everyone must approve; **one rejection rejects the whole request**
- **First response** — the first approver to answer decides

There is **no majority option**. That's the standard distractor.

**Approvers can be:** a user or queue the submitter picks · a user, users, related users, or queue
the admin configures (**up to 25 per step**) · a designated approver such as a manager · a
**delegated approver**.

- **Manager approval reads the Manager field on the User record** — *not* the role hierarchy.
  A custom hierarchical field works too.
- **Dynamic routing**: the approver can be **any related user field** on the object.
- **A delegated approver can approve or reject but cannot reassign.** Set in Approver Settings on
  the user record; the step must allow delegates.

**Submission can be triggered by** a Submit for Approval button, a **flow**, or an **Apex trigger**.

**Mobile gotcha:** notifications are **not sent to queues or delegates**. Individual users must be
assigned to a step for mobile push to reach anyone.

**Building one — the settings that get confused with each other:**

| Setting | Controls |
| --- | --- |
| **Entry criteria** | which records may enter the process **at all** |
| **Step criteria** | whether a record enters **that particular step** |
| *Not meeting criteria* action | what happens when a step's criteria fail — skip or reject |
| **Approver Field** | a standard or custom **user field on the record**, or the record owner, used to derive the approver |
| **Record Editability** | lets the **assigned approver and administrator** edit a locked record |
| **Approval Request Page Layout** | which fields the approver **sees when deciding** |
| **Initial Submitters** | who may submit — **users, roles, public group members** (not profiles) |

Entry vs. step criteria is the pairing most worth keeping straight: entry gates the process,
step gates the step. Conditional routing — skipping director sign-off below a threshold — is
built with step criteria plus the *not meeting criteria* action, not with entry criteria.

**Approval History** is its own related list, retaining comments and approval or rejection status
across the original submission and every resubmission. Not the Setup Audit Trail, which tracks
configuration changes.

Approval processes live under **Process Automation** in Setup.

---

## User interface

*Added after the question bank exam: roughly a quarter of its 20 questions were User Interface —
far more than its 17% weight suggested, and the domain that had been deliberately skipped.*

**Compact layouts** drive three surfaces: the **record highlights panel**, the **lookup hover
card**, and the **record landing page in the mobile app**. Related lists are *not* one of them —
that's the page layout.

- A new compact layout does nothing until it is **marked primary**. The system default is
  read-only and cannot be deleted.
- **Supports every field type except four: Text Area, Long Text Area, Rich Text Area,
  Multi-Select Picklist.** All four are things that can't render in one compact line.

**Assignment models differ between page types — this is the pairing to keep straight:**

| Page type | Assigned by |
| --- | --- |
| Lightning **Home** Page | app · **app + profile** |
| Lightning **Record** Page | app · profile · **record type** · **form factor** |

Role, permission set, and queue are *never* assignment criteria for either. They are the
standard wrong answers.

**Record page layouts — three:** Grouped View · Full View · **Record View** (Lightning console
only). "Compact View" is not one; that word belongs to compact layouts.

Record pages take three component kinds: **standard, custom, third-party**. The **Accordion**
component is the vertical equivalent of Classic's Tabs. Templates advertise which **form factors**
they support (desktop only, or desktop and phone).

**Related list types — three:** Basic List · Tile · **Enhanced List**. Only Enhanced List adds row
count, column resizing and sorting, text wrapping, and mass actions.

**Page layouts** control fields, sections, buttons, links, actions, and related lists, and are
associated with **profiles**. Visualforce pages can be embedded in them.
**Fields created in Schema Builder must be placed on the layout manually** — the field wizard
offers to do it, Schema Builder does not.

**Mini page layouts** apply to the Agent console mini view, hover details, and event overlays,
and inherit record type and profile associations, related lists, fields, and field access from
their parent layout. **Hover details are Salesforce Classic only.**

**List views:**

- Users set their own default by **pinning** — no admin needed.
- **Chart types are exactly three: vertical bar, horizontal bar, donut.** Not line, not pie.
- Fields in the **Recently Viewed** list are configured under **Search Layouts**, not in the list
  view itself. Unintuitive, therefore testable.
- In Classic, list views on **contacts, leads, users, and cases** can build **mass email**
  recipient lists. Accounts cannot.
- Lightning adds inline editing, Kanban and Split views, infinite scrolling, and list view charts.

---

## Not yet covered

Every cluster the practice exam flagged is now covered. What remains was not implicated by a
question you actually missed.

| Domain | Weight | Covered | Still open |
| --- | --- | --- | --- |
| Business Logic | 28% | 4 of 6 | formula fields · avoiding automation errors |
| Salesforce Fundamentals | 23% | 6 of 9 | reports · report types · dashboards |
| Data Modeling | 22% | 3 of 7 | record types · field data type change · schema builder |
| User Interface | 17% | 1 of 5 | Lightning components (declarative + programmatic) · custom buttons and links |
| App Deployment | 10% | 3 of 4 | deployment plan |

**Read that User Interface row carefully.** It is the largest untouched block and the second
heaviest domain, and it is still the *right* thing to skip: at 90% accuracy it is worth only about
1.7 points of recoverable score, less than any other domain. Skipping it is a decision, not an
oversight.

**If more time appears, in order:** approval processes and formula fields (Business Logic, 28%),
then record types and field data type change considerations (Data Modeling, 22%). Both were
adjacent to questions you missed without being the direct cause.

**Better use of that time:** take Practice Exam 2 and re-target from the result. This digest was
built from one 60-question sample; a second one is worth more than another topic.
