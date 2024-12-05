/**
 * Error class thrown when there is a parsing error in a `tag:` URI.
 * 
 * Instances of this class provide information about which part of the `tag:` 
 * URI caused the error. 
 * The `where` property indicates the specific component of the URI that failed 
 * validation, such as the `taggingEntity`, `authorityName`, `date`, or other 
 * parts defined by [RFC 4151](https://datatracker.ietf.org/doc/html/rfc4151).
 */
export class TagUriParsingError extends Error {
  /** The part of the `tag:` URI that caused the parsing error. */
  readonly where:
    | "tagUri"
    | "taggingEntity"
    | "authorityName"
    | "date"
    | "year"
    | "month"
    | "day"
    | "dnsName"
    | "dnsComp"
    | "emailAddress"
    | "specific"
    | "fragment";

  /**
   * Constructs a new `TagUriParsingError`.
   * 
   * @param where The part of the URI that caused the error.
   * @param input The segment that failed to parse.
   */
  constructor(
    where: TagUriParsingError["where"],
    readonly input: string,
  ) {
    super(`invalid tag URI, error while parsing "${where}" at "${input}"`);
    this.where = where;
    this.name = TagUriParsingError.name;
  }
}

// this part of the code is supposed to be unreachable
export class UnreachableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = UnreachableError.name;
  }
}
