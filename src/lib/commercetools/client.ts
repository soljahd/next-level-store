import { ClientBuilder, type AuthMiddlewareOptions, type HttpMiddlewareOptions } from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const projectKey = process.env.NEXT_PUBLIC_CTP_PROJECT_KEY;
const clientSecret = process.env.NEXT_PUBLIC_CTP_CLIENT_SECRET;
const clientId = process.env.NEXT_PUBLIC_CTP_CLIENT_ID;
const authUrl = process.env.NEXT_PUBLIC_CTP_AUTH_URL;
const apiUrl = process.env.NEXT_PUBLIC_CTP_API_URL;
const scopes = process.env.NEXT_PUBLIC_CTP_SCOPES?.split(' ');

if (!projectKey || !clientSecret || !clientId || !authUrl || !apiUrl || !scopes) {
  throw new Error('CommerceTools environment variables are missing');
}

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
  httpClient: fetch,
};

const authMiddlewareOptions: AuthMiddlewareOptions = {
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
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: projectKey });
export default apiRoot;
