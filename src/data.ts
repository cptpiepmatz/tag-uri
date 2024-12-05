export interface TagUriData {
  authorityName: {
    dnsName: string;
    emailAddress: null;
  } | {
    dnsName: null;
    emailAddress: string;
  };
  date: {
    year: string;
    month: null;
    day: null;
  } | {
    year: string;
    month: string;
    day: null;
  } | {
    year: string;
    month: string;
    day: string;
  };
  specific: string;
  fragment: string | null;
}

export function equals(a: TagUriData, b: TagUriData): boolean {
  return (
    (a.authorityName.dnsName == b.authorityName.dnsName) &&
    (a.authorityName.emailAddress == b.authorityName.emailAddress) &&
    (a.date.year == b.date.year) &&
    (a.date.month == b.date.month) &&
    (a.date.day == b.date.day) &&
    (a.specific == b.specific) &&
    (a.fragment == b.fragment)
  );
}
