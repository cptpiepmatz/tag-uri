import type { TagUriData } from "./data.ts";
import { UnreachableError } from "./error.ts";
import { TagUriParser } from "./parser.ts";
export { TagUriParsingError } from "./error.ts";

const internal = Symbol("internal");

/**
 * Data structure containing the contents of a `tag:` URI.
 * 
 * Instances of this class hold the data for `tag:` URIs as defined by the
 * [RFC 4151](https://datatracker.ietf.org/doc/html/rfc4151) or otherwise 
 * described by [taguri.org](https://taguri.org).
 * 
 * Getting an instance of this can either be done by manually constructing one 
 * by passing all the necessary data into the {@link constructor} or by parsing
 * a `tag:` URI string with {@linkcode parse}.
 * 
 * By using {@linkcode get}, you can get the string representation of the tag.
 * Other contained values can be accessed via the various getters.
 * Some getters may return `null` as not every tag has to contain them 
 * (e.g. the `day` of the `date`).
 * 
 * @example Get a instance via `parse`
 * ```ts
 * const tag = TagUri.parse("tag:timothy@hpl.hp.com,2001:web/externalHome");
 * 
 * // Access different parts of the tag URI
 * console.log(tag.get()); // tag:timothy@hpl.hp.com,2001:web/externalHome
 * console.log(tag.authorityName); // timothy@hpl.hp.com
 * console.log(tag.date); // 2001
 * console.log(tag.specific); // web/externalHome
 * ```
 */
export class TagUri {
  private [internal]: TagUriData;

  constructor(data: TagUriData) {
    this[internal] = data;
  }

  static parse(input: string): TagUri {
    return new TagUri(TagUriParser.parse(input));
  }

  get(): string {
    let tag = `tag:${this.taggingEntity}:${this.specific}`;
    let fragment = this.fragment;
    if (fragment) tag += `#${fragment}`;
    return tag;
  }

  get taggingEntity(): string {
    return `${this.authorityName},${this.date}`;
  }

  get authorityName(): string {
    let { dnsName, emailAddress } = this[internal].authorityName;
    if (dnsName) return dnsName;
    if (emailAddress) return emailAddress;
    throw new UnreachableError(
      `"authorityName" should have either "dnsName" or "emailAddress"`,
    );
  }

  get dnsName(): string | null {
    return this[internal].authorityName.dnsName;
  }

  get emailAddress(): string | null {
    return this[internal].authorityName.emailAddress;
  }

  get date(): string {
    let { year, month, day } = this[internal].date;
    if (day) return `${year}-${month}-${day}`;
    if (month) return `${year}-${month}`;
    return year;
  }

  get year(): string {
    return this[internal].date.year;
  }

  get month(): string | null {
    return this[internal].date.month;
  }

  get day(): string | null {
    return this[internal].date.day;
  }

  get specific(): string {
    return this[internal].specific;
  }

  get fragment(): string | null {
    return this[internal].fragment;
  }

  toString(): string {
    return this.get();
  }

  [Symbol.toPrimitive](hint: "default"): TagUriData;
  [Symbol.toPrimitive](hint: "string"): string;
  [Symbol.toPrimitive](
    hint: "number" | "string" | "default",
  ): string | TagUriData {
    switch (hint) {
      case "number":
        throw new TypeError();
      case "string":
        return this.get();
      default:
        return this[internal];
    }
  }
}
