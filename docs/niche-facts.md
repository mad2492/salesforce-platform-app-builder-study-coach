# Niche Facts — Platform App Builder

The details that actually separate answers. Written for skimming in short gaps, not for
reading front to back. Each **Decoy** line is the wrong answer the question will dangle.

Coverage so far: 3 of 40 course topics. See "Not yet covered" at the bottom.

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

## Not yet covered

Remaining 37 topics, in exam-weight order:

| Domain | Weight | Status |
| --- | --- | --- |
| Business Logic and Process Automation | 28% | 1 of 8 topics |
| Salesforce Fundamentals | 23% | 2 of 11 topics |
| Data Modeling and Management | 22% | 0 of 9 topics |
| User Interface | 17% | 0 of 7 topics |
| App Deployment | 10% | 0 of 5 topics |

Highest value next: formula fields, validation rules, approval processes, and the
"determine the tool" topics in Business Logic; then relationship types and field data type
change considerations in Data Modeling.
