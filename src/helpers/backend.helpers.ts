import { NextResponse } from 'next/server';

function statusRes(status: number): string {
  const statusMessages: { [key: number]: string } = {
    // Success
    200: 'Success',
    201: 'Created',

    // Redirection
    301: 'Moved Permanently',
    302: 'Found',

    // Client Errors
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    408: 'Request Timeout',
    429: 'Too Many Requests',

    // Server Errors
    500: 'Internal Server Error',
    501: 'Not Implemented',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  };

  return statusMessages[status] || 'Unknown Error';
}

export interface Response {
  status: number;
  message?: string;
  errors?: {
    [key: string]: string;
  };
  data?: {
    [key: string]: unknown;
  };
}

function response(body: Response, init?: ResponseInit | object) {
  if (!body.message) {
    body.message = statusRes(body.status);
  }

  if (body.status >= 400) {
    if (body.message && !body.errors)
      body.errors = {
        message: body.message,
      };
    else
      body.errors = {
        message: statusRes(body.status),
      };
  }

  init = Object.assign({ status: body.status }, init);
  return NextResponse.json(body, init);
}

export default response;
