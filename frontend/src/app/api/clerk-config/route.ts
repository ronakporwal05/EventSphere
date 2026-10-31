import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { publishableKey, secretKey } = await req.json();

    if (!publishableKey || !publishableKey.startsWith('pk_')) {
      return NextResponse.json(
        { error: 'Invalid Clerk Publishable Key. It should start with pk_test_ or pk_live_' },
        { status: 400 }
      );
    }

    // Paths to .env files
    const cwd = process.cwd();
    const envLocalPath = path.join(cwd, '.env.local');
    const rootEnvPath = path.join(cwd, '..', '.env');

    const clerkLines = [
      `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${publishableKey.trim()}`,
      secretKey ? `CLERK_SECRET_KEY=${secretKey.trim()}` : '',
      `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login`,
      `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register`,
    ].filter(Boolean).join('\n');

    // Update .env.local in frontend
    let currentLocal = '';
    if (fs.existsSync(envLocalPath)) {
      currentLocal = fs.readFileSync(envLocalPath, 'utf-8');
    }
    // Remove old clerk lines
    const cleanLocal = currentLocal
      .split('\n')
      .filter((l) => !l.startsWith('NEXT_PUBLIC_CLERK_') && !l.startsWith('CLERK_SECRET_KEY='))
      .join('\n')
      .trim();
    fs.writeFileSync(envLocalPath, `${cleanLocal}\n\n# Clerk Authentication\n${clerkLines}\n`, 'utf-8');

    // Update root .env if it exists
    if (fs.existsSync(rootEnvPath)) {
      let rootEnv = fs.readFileSync(rootEnvPath, 'utf-8');
      const cleanRoot = rootEnv
        .split('\n')
        .filter((l) => !l.startsWith('NEXT_PUBLIC_CLERK_') && !l.startsWith('CLERK_SECRET_KEY='))
        .join('\n')
        .trim();
      fs.writeFileSync(rootEnvPath, `${cleanRoot}\n\n# Clerk Authentication\n${clerkLines}\n`, 'utf-8');
    }

    return NextResponse.json({
      success: true,
      message: 'Clerk configuration successfully updated.',
      publishableKey,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update Clerk configuration' }, { status: 500 });
  }
}

export async function GET() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
  return NextResponse.json({
    configured: Boolean(publishableKey && publishableKey.startsWith('pk_')),
    publishableKey: publishableKey ? `${publishableKey.substring(0, 10)}...` : '',
  });
}
