export interface EmailData {
  to: string | string[];
  subject: string;
  body?: string;
  html?: string;
  from?: string;
}
