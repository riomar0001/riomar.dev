/** Resource keys shared by the modal router, delete endpoints and reloaders. */
export type ResourceType =
  | 'skill'
  | 'project'
  | 'experience'
  | 'achievement'
  | 'certification'
  | 'contactCard';

/** Every dialog the dashboard can open, keyed by `modal` state. */
export type ModalKey = ResourceType | 'personalInfo' | 'profilePhoto' | 'changePassword';

/** Top-level sections selectable from the dashboard header. */
export type DashboardTab = 'content' | 'history' | 'visitors' | 'links';

export type ToastType = 'success' | 'error';

export type Toast = { msg: string; type: ToastType };

export type ShowToast = (msg: string, type?: ToastType) => void;

export type DeleteTarget = { type: string; id: string; label: string };
