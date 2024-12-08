<h1 align="center">@cptpiepmatz/tag-uri</h1>
<p align="center">
  <b>
    <a href="https://taguri.org">RFC 4151 Tag URI</a>
    parser and generator
  </b>
</p>

<br>
<div align="center">

[![JSR Version](https://jsr.io/badges/@cptpiepmatz/tag-uri?style=for-the-badge)](https://jsr.io/@cptpiepmatz/tag-uri)
[![Docs via JSR](https://img.shields.io/badge/docs-%23083344?style=for-the-badge&logo=jsr)](https://jsr.io/@cptpiepmatz/tag-uri/doc)
[![Build Status](https://img.shields.io/github/actions/workflow/status/cptpiepmatz/tag-uri/cicd.yml?style=for-the-badge)](https://github.com/cptpiepmatz/tag-uri/actions/workflows/cicd.yml)
[![License](https://img.shields.io/github/license/cptpiepmatz/tag-uri?style=for-the-badge)](https://github.com/cptpiepmatz/tag-uri/blob/main/LICENSE)

</div>

## About

The main entry point and default export of this library is the `TagUri` class,
which is all you’ll usually need. It simplifies working with
[RFC 4151 Tag URIs](https://taguri.org) by parsing them into their components or
allowing you to construct new ones programmatically.

## Features

- **Parsing Tag URIs:** Extract structured components like the authority name,
  date, and specific part.

- **Helpful Errors:** Parsing failures include errors pointing to where the
  issue occurred.

- **Tag URI Construction:** Create tag URIs using the `TagUri` constructor
  _(note: validation is not yet implemented)_.

- **Platform Agnostic:** Fully dependency-free, works with
  [Deno](https://deno.com), [Node.js](https://nodejs.org), and modern browsers
  using
  [baseline web compatibility](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility).

## Usage

### Parsing Tag URIs

```ts
import { TagUri } from "@cptpiepmatz/tag-uri";
import { expect } from "jsr:@std/expect";

// Parse a tag URI
const tag = TagUri.parse("tag:timothy@hpl.hp.com,2001:web/externalHome");

// Access different parts of the tag URI
expect(tag.get()).toBe("tag:timothy@hpl.hp.com,2001:web/externalHome");
expect(tag.authorityName).toBe("timothy@hpl.hp.com");
expect(tag.date).toBe("2001");
expect(tag.specific).toBe("web/externalHome");
```

### Constructing Tag URIs

```ts
import { TagUri } from "@cptpiepmatz/tag-uri";
import { expect } from "jsr:@std/expect";

// Create a new tag URI
const tag = new TagUri({
  authorityName: {
    emailAddress: "timothy@hpl.hp.com",
    dnsName: null,
  },
  date: {
    year: "2001",
    month: null,
    day: null,
  },
  specific: "web/externalHome",
  fragment: null,
});

expect(tag.get()).toBe("tag:timothy@hpl.hp.com,2001:web/externalHome");
```
