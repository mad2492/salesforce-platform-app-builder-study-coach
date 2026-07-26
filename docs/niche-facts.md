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
