import { redirect } from 'next/navigation';

/**
 * Login Page - Redirect to Agent Portal Login
 *
 * The admin dashboard does not need its own login page.
 * All authentication goes through the agent portal login on the public site.
 */
export default function LoginPage() {
  redirect('https://smartagentalliance.com/agent-portal/login');
}
