import { equals, type TagUriData } from "./data.ts";
import { TagUriParsingError, UnreachableError } from "./error.ts";
import { TagUriParser } from "./parser.ts";

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
 * By using {@linkcode TagUri.prototype.get}, you can get the string
 * representation of the tag.
 * Other contained values can be accessed via the various getters.
 * Some getters may return `null` as not every tag has to contain them
 * (e.g. the `day` of the `date`).
 *
 * @example Get a instance via `parse`
 * ```ts
 * import { TagUri } from "@cptpiepmatz/tag-uri";
 * import { expect } from "jsr:@std/expect";
 *
 * // Parse a tag URI
 * const tag = TagUri.parse("tag:timothy@hpl.hp.com,2001:web/externalHome");
 *
 * // Access different parts of the tag URI
 * expect(tag.get()).toBe("tag:timothy@hpl.hp.com,2001:web/externalHome");
 * expect(tag.authorityName).toBe("timothy@hpl.hp.com");
 * expect(tag.date).toBe("2001");
 * expect(tag.specific).toBe("web/externalHome");
 * ```
 */
export class TagUri {
  private [internal]: TagUriData;

  constructor(data: TagUriData) {
    this[internal] = data;
  }

  /**
   * Tries to parse a `tag:` URI.
   *
   * @param input
   * String expecting to contain a `tag:` URI.
   * Ensure that your string is trimmed, otherwise the string will not be
   * accepted.
   *
   * @throws {TagUriParsingError}
   * Throws an error if the passed tag is not a valid `tag:` URI.
   * You can find out where the tag is not valid by checking
   * the {@linkcode TagUriParsingError.prototype.where} value.
   *
   * @returns
   * An instance of a {@linkcode TagUri} that represents a valid `tag:` URI.
   */
  static parse(input: string): TagUri {
    return new TagUri(TagUriParser.parse(input));
  }

  /**
   * Get the string representation of this `tag:` URI.
   *
   * As the string is internally held in a deconstructed way, will this
   * construct a new string every time this method is called.
   */
  get(): string {
    let tag = `tag:${this.taggingEntity}:${this.specific}`;
    let fragment = this.fragment;
    if (fragment) tag += `#${fragment}`;
    return tag;
  }

  /**
   * Tagging entity of the `tag:` URI.
   *
   * Represents the `taggingEntity` part of the RFC.
   */
  get taggingEntity(): string {
    return `${this.authorityName},${this.date}`;
  }

  /**
   * Authority name of the `tag:` URI.
   *
   * Represents the `authorityName` part of the RFC.
   */
  get authorityName(): string {
    let { dnsName, emailAddress } = this[internal].authorityName;
    if (dnsName) return dnsName;
    if (emailAddress) return emailAddress;
    throw new UnreachableError(
      `"authorityName" should have either "dnsName" or "emailAddress"`,
    );
  }

  /**
   * DNS name of the authority name of the `tag:` URI.
   *
   * Represents the `DNSname` part of the RFC.
   *
   * This value is nullable as `authorityName` can be either a dns name or an
   * email address.
   */
  get dnsName(): string | null {
    return this[internal].authorityName.dnsName;
  }

  /**
   * Email address of the authority name of the `tag:` URI.
   *
   * Represents the `emailAddress` part of the RFC.
   *
   * This value is nullable as `authorityName` can be either a dns name or an
   * email address.
   */
  get emailAddress(): string | null {
    return this[internal].authorityName.emailAddress;
  }

  /**
   * Date of the `tag:` URI.
   *
   * Represents the `date` part of the RFC.
   */
  get date(): string {
    let { year, month, day } = this[internal].date;
    if (day) return `${year}-${month}-${day}`;
    if (month) return `${year}-${month}`;
    return year;
  }

  /**
   * Year of the `tag:` URI.
   *
   * Represents the `year` part of the RFC.
   */
  get year(): string {
    return this[internal].date.year;
  }

  /**
   * Month of the `tag:` URI.
   *
   * Represents the `month` part of the RFC.
   *
   * This value is nullable as `date` might contain only a year.
   * The `day` will then be also `null`.
   */
  get month(): string | null {
    return this[internal].date.month;
  }

  /**
   * Day of the `tag:` URI.
   *
   * Represents the `day` part of the RFC.
   *
   * This value is nullable as `date` might contain only a month and year or
   * only a year.
   */
  get day(): string | null {
    return this[internal].date.day;
  }

  /**
   * Specific of the `tag:` URI.
   *
   * Represents the `specific` part of the RFC.
   *
   * Might be an empty string as they are valid according to the RFC.
   */
  get specific(): string {
    return this[internal].specific;
  }

  /**
   * Fragment of the `tag:` URI.
   *
   * Represents the `fragment` part of the RFC.
   *
   * Might be an empty string as they are valid according to the RFC.
   * Might also be `null` if the `#` is omitted.
   *
   * @example
   * ```ts
   * import { TagUri } from "@cptpiepmatz/tag-uri";
   * import { expect } from "jsr:@std/expect";
   *
   * expect(TagUri.parse("tag:example.com,2000:").fragment).toBeNull();
   * expect(TagUri.parse("tag:example.com,2000:#").fragment).toBe("");
   * expect(TagUri.parse("tag:example.com,2000:#abc").fragment).toBe("abc");
   */
  get fragment(): string | null {
    return this[internal].fragment;
  }

  /**
   * Compare two `TagUri` instances for equality.
   *
   * This does a equality check on all fields in the internal, deconstructed
   * representation.
   * This allows comparing two instances without getting the string
   * representation first.
   *
   * @param other
   * Instance to compare against.
   * Allows comparison even if two different constructors were used.
   *
   * @example Allow comparison with different instances
   * ```ts
   * import { expect } from "jsr:@std/expect";
   *
   * const tag = "tag:timothy@hpl.hp.com,2001:web/externalHome";
   * const a = TagUri.parse(tag);
   * const b = TagUri.parse(tag);
   *
   * expect(a == b).toBe(false);
   * expect(a.equals(b)).toBe(true);
   * ```
   *
   * @returns `true`, if both instances represent the same tag.
   */
  equals(other: TagUri): boolean {
    return equals(this[internal], other[internal]);
  }

  /**
   * Get the string representation of this instance.
   *
   * @see {@link TagUri.prototype.get}
   */
  toString(): string {
    return this.get();
  }

  /** @ignore */
  [Symbol.toPrimitive](hint: "default"): TagUriData;
  /** @ignore */
  [Symbol.toPrimitive](hint: "string"): string;
  /** @ignore */
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

export { TagUriParsingError };
