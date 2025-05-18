import { NextRequest, NextResponse } from 'next/server';
import getAllEmailsFromAllTables from '../../../../get-emails-puppeteer';

export async function POST(req: NextRequest) {
  const { urls } = await req.json();
  if (!urls || !Array.isArray(urls)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const allEmails: Set<string> = new Set();
  for (const url of urls) {
    try {
      const emails = await getAllEmailsFromAllTables(url);
      emails.forEach((email) => allEmails.add(email));
      emails.filter((email) => email.includes('<img'));
    } catch {
      // ignora erro de uma URL
    }
  }
  return NextResponse.json({ emails: Array.from(allEmails) });
}
