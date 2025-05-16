import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type PasswordAuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const projectKey = process.env.NEXT_PUBLIC_CTP_PROJECT_KEY;
const clientSecret = process.env.NEXT_PUBLIC_CTP_CLIENT_SECRET;
const clientId = process.env.NEXT_PUBLIC_CTP_CLIENT_ID;
const authUrl = process.env.NEXT_PUBLIC_CTP_AUTH_URL;
const apiUrl = process.env.NEXT_PUBLIC_CTP_API_URL;
const scopes = process.env.NEXT_PUBLIC_CTP_SCOPES?.split(' ');

function createAnonymousApiRoot() {
  if (!projectKey || !clientSecret || !clientId || !authUrl || !apiUrl || !scopes) {
    throw new Error('CommerceTools environment variables are missing');
  }

  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: apiUrl,
    httpClient: fetch,
  };

  const AnonymousAuthMiddlewareOptions: AuthMiddlewareOptions = {
    host: authUrl,
    projectKey: projectKey,
    credentials: {
      clientId: clientId,
      clientSecret: clientSecret,
    },
    scopes: scopes,
    httpClient: fetch,
  };

  const ctpClient = new ClientBuilder()
    .withAnonymousSessionFlow(AnonymousAuthMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: projectKey });
}

function createPasswordApiRoot(username: string, password: string) {
  if (!projectKey || !clientSecret || !clientId || !authUrl || !apiUrl || !scopes) {
    throw new Error('CommerceTools environment variables are missing');
  }

  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: apiUrl,
    httpClient: fetch,
  };

  const PasswordAuthAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
    host: authUrl,
    projectKey: projectKey,
    credentials: {
      clientId: clientId,
      clientSecret: clientSecret,
      user: { username, password },
    },
    scopes: scopes,
    httpClient: fetch,
  };

  const ctpClient = new ClientBuilder()
    .withPasswordFlow(PasswordAuthAuthMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: projectKey });
}

let apiRoot = createAnonymousApiRoot();
export { apiRoot };

export function setPasswordApiRoot(email: string, password: string) {
  apiRoot = createPasswordApiRoot(email, password);
}

export function resetApiRoot() {
  apiRoot = createAnonymousApiRoot();
}
