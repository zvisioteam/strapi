---
title: API Tokens
slug: /api-tokens
tags:
  - admin
  - content-api
  - api-tokens
---

# API Tokens 🔑

## Summary

The "API Tokens" feature aims to implement granularity to the content API’s token auth strategy by **enabling token customization**.

This customization happens thanks to different components:

- Granular permissions (_à la_ Users & Permissions)
- Custom expiration date (tokens are created with a lifespan)

New features also include:

- Token regeneration (invalidate old access key and provide a new one)
- "last used at" timestamp now on each token that updates whenever a token is successfully authenticated
- More precise RBAC integration

> On a lower level, it has also been decided to bring more consistency to the auth strategies by **abstracting the notion of a Strapi “permission engine”** and using it as a basis to create more precise implementations that match business needs in different locations (Admin API with RBAC, Content API with Users & Permissions and API Token, …). It should also bring consistency and a better developer experience for potential new auth systems that are yet to be developed.

## Detailed design

- _Explaining the software design and reasoning._
- _Api specifications._
- _Benchmarks_
- _Add necessary diagrams and code examples._
- _Think about edge-cases and include examples._

## Tradeoffs

_What potential tradeoffs are involved with this system/implementation._

- _Complexity._
- _Limitations of the feature itself._
- _How does this proposal integrate with the current features implemented._

## Alternatives

_What other approaches did we consider?_

## Resources

- _Link to product documents._
- _Link to user documentation._
- _Any usefull research used for it_
