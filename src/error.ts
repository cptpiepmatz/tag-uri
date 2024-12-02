export class TagUriParsingError extends Error {
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
