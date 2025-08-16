import { headers } from 'next/headers';

/**
 * Safely retrieves the user's email from IAP-injected headers.
 * Throws an error if the email cannot be identified, ensuring that
 * subsequent operations are not performed without a valid user context.
 * @returns {string} The user's email address.
 */
export function getUserEmail(): string {
  const headersList = headers();
  const userEmailHeader = headersList.get('x-goog-authenticated-user-email');

  if (!userEmailHeader) {
    // 在生产环境中，IAP 应该总是提供这个头。如果缺失，说明请求可能绕过了 IAP，这是一个严重的安全问题。
    console.error("Critical: 'x-goog-authenticated-user-email' header is missing. Request might have bypassed IAP.");
    throw new Error('User identity could not be verified.');
  }

  // IAP 返回的 email 格式为 "accounts.google.com:user@example.com"，我们需要提取实际的 email 部分。
  const email = userEmailHeader.split(':').pop();

  if (!email) {
    throw new Error('Could not parse user email from IAP header.');
  }

  return email;
}
