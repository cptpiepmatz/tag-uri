import { expect } from "jsr:@std/expect";
import TagUri from "./mod.ts";
import { TagUriParsingError } from "./error.ts";

const tags = [
  "tag:timothy@hpl.hp.com,2001:web/externalHome",
  "tag:sandro@w3.org,2004-05:Sandro",
  "tag:my-ids.com,2001-09-15:TimKindberg:presentations:UBath2004-05-19",
  "tag:blogger.com,1999:blog-555",
  "tag:yaml.org,2002:int",
];

Deno.test(`parsing "${tags[0]}" works`, () => {
  let tag = TagUri.parse(tags[0]);
  expect(tag.get()).toBe(tags[0]);
  expect(tag.taggingEntity).toBe("timothy@hpl.hp.com,2001");
  expect(tag.authorityName).toBe("timothy@hpl.hp.com");
  expect(tag.dnsName).toBeNull();
  expect(tag.emailAddress).toBe("timothy@hpl.hp.com");
  expect(tag.date).toBe("2001");
  expect(tag.year).toBe("2001");
  expect(tag.month).toBeNull();
  expect(tag.day).toBeNull();
  expect(tag.specific).toBe("web/externalHome");
  expect(tag.fragment).toBeNull();
});

Deno.test(`parsing "${tags[1]}" works`, () => {
  let tag = TagUri.parse(tags[1]);
  expect(tag.get()).toBe(tags[1]);
  expect(tag.taggingEntity).toBe("sandro@w3.org,2004-05");
  expect(tag.authorityName).toBe("sandro@w3.org");
  expect(tag.dnsName).toBeNull();
  expect(tag.emailAddress).toBe("sandro@w3.org");
  expect(tag.date).toBe("2004-05");
  expect(tag.year).toBe("2004");
  expect(tag.month).toBe("05");
  expect(tag.day).toBeNull();
  expect(tag.specific).toBe("Sandro");
  expect(tag.fragment).toBeNull();
});

Deno.test(`parsing "${tags[2]}" works`, () => {
  let tag = TagUri.parse(tags[2]);
  expect(tag.get()).toBe(tags[2]);
  expect(tag.taggingEntity).toBe("my-ids.com,2001-09-15");
  expect(tag.authorityName).toBe("my-ids.com");
  expect(tag.dnsName).toBe("my-ids.com");
  expect(tag.emailAddress).toBeNull();
  expect(tag.date).toBe("2001-09-15");
  expect(tag.year).toBe("2001");
  expect(tag.month).toBe("09");
  expect(tag.day).toBe("15");
  expect(tag.specific).toBe("TimKindberg:presentations:UBath2004-05-19");
  expect(tag.fragment).toBeNull();
});

Deno.test(`parsing "${tags[3]}" works`, () => {
  let tag = TagUri.parse(tags[3]);
  expect(tag.get()).toBe(tags[3]);
  expect(tag.taggingEntity).toBe("blogger.com,1999");
  expect(tag.authorityName).toBe("blogger.com");
  expect(tag.dnsName).toBe("blogger.com");
  expect(tag.emailAddress).toBeNull();
  expect(tag.date).toBe("1999");
  expect(tag.year).toBe("1999");
  expect(tag.month).toBeNull();
  expect(tag.day).toBeNull();
  expect(tag.specific).toBe("blog-555");
  expect(tag.fragment).toBeNull();
});

Deno.test(`parsing "${tags[4]}" works`, () => {
  let tag = TagUri.parse(tags[4]);
  expect(tag.get()).toBe(tags[4]);
  expect(tag.taggingEntity).toBe("yaml.org,2002");
  expect(tag.authorityName).toBe("yaml.org");
  expect(tag.dnsName).toBe("yaml.org");
  expect(tag.emailAddress).toBeNull();
  expect(tag.date).toBe("2002");
  expect(tag.year).toBe("2002");
  expect(tag.month).toBeNull();
  expect(tag.day).toBeNull();
  expect(tag.specific).toBe("int");
  expect(tag.fragment).toBeNull();
});

Deno.test(`parsing a tag with missing "tag:" prefix should error`, () => {
  const invalidTag = "timothy@hpl.hp.com,2001:web/externalHome";
  try {
    TagUri.parse(invalidTag);
  } catch (error) {
    if (error instanceof TagUriParsingError) {
      expect(error.where).toBe("tagUri");
      expect(error.input).toBe(invalidTag);
    } else {
      throw new Error("Unexpected error type");
    }
  }
});

Deno.test(`parsing a tag with missing date should error`, () => {
  const invalidTag = "tag:yaml.org::int";
  try {
    TagUri.parse(invalidTag);
  } catch (error) {
    if (error instanceof TagUriParsingError) {
      expect(error.where).toBe("taggingEntity");
      expect(error.input).toBe("yaml.org");
    } else {
      throw new Error("Unexpected error type");
    }
  }
});

Deno.test(`parsing a tag with invalid date format should error`, () => {
  const invalidTag = "tag:yaml.org,20-2:int";
  try {
    TagUri.parse(invalidTag);
  } catch (error) {
    if (error instanceof TagUriParsingError) {
      expect(error.where).toBe("date");
      expect(error.input).toBe("20-2");
    } else {
      throw new Error("Unexpected error type");
    }
  }
});

Deno.test(`parsing a tag with missing authorityName and date should error`, () => {
  const invalidTag = "tag::int";
  try {
    TagUri.parse(invalidTag);
  } catch (error) {
    if (error instanceof TagUriParsingError) {
      expect(error.where).toBe("taggingEntity");
      expect(error.input).toBe("");
    } else {
      throw new Error("Unexpected error type");
    }
  }
});

Deno.test(`parsing a tag with invalid authorityName should error`, () => {
  const invalidTag = "tag:invalid@@name.com,2002:int";
  try {
    TagUri.parse(invalidTag);
  } catch (error) {
    if (error instanceof TagUriParsingError) {
      expect(error.where).toBe("emailAddress");
      expect(error.input).toBe("@name.com");
    } else {
      throw new Error("Unexpected error type");
    }
  }
});

Deno.test(`parsing a tag with missing specific should error`, () => {
  const invalidTag = "tag:yaml.org,2002:";
  try {
    TagUri.parse(invalidTag);
  } catch (error) {
    if (error instanceof TagUriParsingError) {
      expect(error.where).toBe("specific");
      expect(error.input).toBe(invalidTag);
    } else {
      throw new Error("Unexpected error type");
    }
  }
});

Deno.test(`parsing a tag with extra components should error`, () => {
  const invalidTag = "tag:yaml.org,2002:int:extra";
  try {
    TagUri.parse(invalidTag);
  } catch (error) {
    if (error instanceof TagUriParsingError) {
      expect(error.where).toBe("tagUri");
      expect(error.input).toBe(invalidTag);
    } else {
      throw new Error("Unexpected error type");
    }
  }
});
