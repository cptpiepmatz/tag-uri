import type { TagUriData } from "./data.ts";
import { TagUriParsingError } from "./error.ts";

const tagUriRegex =
  /^tag:(?<taggingEntity>[^:\s]*):(?<specific>[^#\s]*)(?:#?(?<fragment>\S*))`?$/;
const taggingEntityRegex = /^(?<authorityName>[\S]*),(?<date>[\S]*)$/;
const emailAddressRegex = /^[a-zA-Z0-9-._]+@(?<domain>\S+)$/;
const dnsNameRegex =
  /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9]))(\.([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])))*$/;
const dateRegex = /^(?<year>\d{4})(-(?<month>\d{2})(-(?<day>\d{2}))?)?$/;
const specificRegex = /^([a-zA-Z0-9-._~!$&'()*+,;=:@\/?]|(%[0-9a-fA-F]{2}))*$/;
const fragmentRegex = specificRegex;

export class TagUriParser {
  static parse(input: string): TagUriData {
    let tagUriMatched = input.match(tagUriRegex);
    if (!tagUriMatched || !tagUriMatched.groups) {
      throw new TagUriParsingError("tagUri", input);
    }

    let taggingEntity = tagUriMatched.groups["taggingEntity"];
    let specific = tagUriMatched.groups["specific"];
    let fragment = tagUriMatched.groups["fragment"];

    let taggingEntityMatched = taggingEntity.match(taggingEntityRegex);
    if (!taggingEntityMatched || !taggingEntityMatched.groups) {
      throw new TagUriParsingError("taggingEntity", taggingEntity);
    }

    let authorityName = taggingEntityMatched.groups["authorityName"];
    let date = taggingEntityMatched.groups["date"];

    return {
      authorityName: TagUriParser.parseAuthorityName(authorityName),
      date: TagUriParser.parseDate(date),
      specific: TagUriParser.parseSpecific(specific),
      fragment: TagUriParser.parseFragment(fragment),
    };
  }

  static parseAuthorityName(input: string): TagUriData["authorityName"] {
    if (input.includes("@")) {
      let emailAddressMatched = input.match(emailAddressRegex);
      if (!emailAddressMatched || !emailAddressMatched.groups) {
        throw new TagUriParsingError("emailAddress", input);
      }

      let domain = emailAddressMatched.groups["domain"];
      let domainMatched = domain.match(dnsNameRegex);
      if (!domainMatched) throw new TagUriParsingError("emailAddress", domain);

      return {
        emailAddress: input,
        dnsName: null,
      };
    }

    let dnsNameMatched = input.match(dnsNameRegex);
    if (!dnsNameMatched) throw new TagUriParsingError("dnsName", input);
    return {
      dnsName: input,
      emailAddress: null,
    };
  }

  static parseDate(input: string): TagUriData["date"] {
    let dateMatched = input.match(dateRegex);
    if (!dateMatched || !dateMatched.groups) {
      throw new TagUriParsingError("date", input);
    }

    let { year, month, day } = dateMatched.groups;

    if (month && day) return { year, month, day };
    if (month) return { year, month, day: null };
    return { year, month: null, day: null };
  }

  static parseSpecific(input: string): TagUriData["specific"] {
    let specificMatched = input.match(specificRegex);
    if (!specificMatched) throw new TagUriParsingError("specific", input);
    return input;
  }

  static parseFragment(input: string): TagUriData["fragment"] {
    if (input.length === 0) return null;
    let fragmentMatched = input.match(fragmentRegex);
    if (!fragmentMatched) throw new TagUriParsingError("fragment", input);
    return input;
  }
}
