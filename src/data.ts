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
