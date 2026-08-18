/**
 * Barrel for the dashboard's data-access layer — import from
 * `@/lib/dashboard/api`.
 */
export { apiFetch, apiSend, fetchJson } from './client';
export { handleFilePick, uploadFile, type UploadFolder } from './upload';
export {
  AUTH_ENDPOINTS,
  COLLECTION_ENDPOINTS,
  LINK_ENDPOINTS,
  VISITOR_ENDPOINTS,
  itemEndpoint
} from './endpoints';
