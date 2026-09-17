# Audit Mentor, Titan Internal Audit

A demonstration build of an AI audit mentor delivered as an app inside Microsoft Teams.
Netscribes, prepared for Titan Industries.

## What this is

A learning tool for an internal audit function. An auditor asks a question the way they
would ask a colleague, and the mentor explains the answer from the department's own
methodology, its audit programmes and the IIA standards, citing the source for every claim.

It explains and teaches. It does not form audit opinions.

## Running it

Requires Node.js 18 or later.

```
npm install
npm run dev
```

Then open the address printed in the terminal, usually http://localhost:5173

To produce a static build for hosting:

```
npm run build
```

The output lands in `dist` and can be served from any static host.

## What to look at in a demo

1. Ask the first fieldwork question. It arrives carrying context from the exceptions
   dashboard, showing the join between continuous control testing and the mentor.
2. Use `Switch role` in the header. The same question is answered differently for a first
   year rotational auditor and for a lead auditor, driven by job title from Entra.
3. Ask whether an exception means the control has failed. It declines, because that
   conclusion is an audit opinion carrying the auditor's name.
4. Ask about vendor payment in cryptocurrency. It declines, because nothing in the loaded
   corpus supports an answer.
5. Open the `Sources` tab. Every document the mentor can answer from, ranked by authority,
   with version and effective date, plus what is deliberately excluded.

## Important

Responses are scripted. There is no live model call, no retrieval and no connection to any
Titan system. The corpus shown in the Sources tab is illustrative of how a deployment would
be structured, not a list of documents that have been seen or reviewed.

Scripting is deliberate. A demonstration in front of stakeholders should behave identically
every time it is run.

## Production architecture

The build this prototype represents would run on Microsoft Foundry and Azure AI Search,
using hybrid keyword and vector retrieval, with identity and role context from Entra ID, and
delivery through a Teams app backed by a service so the same backend can also serve an
embedded panel in the exceptions dashboard.
