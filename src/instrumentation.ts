import type { Instrumentation } from 'next';
import { reportError } from './lib/log';

export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  reportError(err, {
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
  });
};
