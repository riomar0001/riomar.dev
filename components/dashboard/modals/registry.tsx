import type { ModalKey, ShowToast } from '@/lib/dashboard/types';
import AchievementForm from '@/components/dashboard/forms/AchievementForm';
import CertificationForm from '@/components/dashboard/forms/CertificationForm';
import ChangePasswordForm from '@/components/dashboard/forms/ChangePasswordForm';
import ContactCardForm from '@/components/dashboard/forms/ContactCardForm';
import ExperienceForm from '@/components/dashboard/forms/ExperienceForm';
import PersonalInfoForm from '@/components/dashboard/forms/PersonalInfoForm';
import ProfilePhotoForm from '@/components/dashboard/forms/ProfilePhotoForm';
import ProjectForm from '@/components/dashboard/forms/ProjectForm';
import SkillForm from '@/components/dashboard/forms/SkillForm';

/** Item being edited, or undefined when the dialog was opened to create one. */
type Editing = Record<string, unknown> | null;

type ModalContext = { close: () => void; showToast: ShowToast };

export type ModalDefinition = {
  /** Dialog heading; receives whether an existing item is being edited. */
  title: (editing: boolean) => string;
  render: (editing: Editing, ctx: ModalContext) => React.ReactNode;
  maxWidthCls?: string;
};

/** "Add Project" / "Edit Project" from a single noun. */
const addOrEdit = (noun: string) => (editing: boolean) => `${editing ? 'Edit' : 'Add'} ${noun}`;

/**
 * The forms are keyed by their own entity type, so the initial value is cast
 * back from the untyped `editingItem` the dashboard tracks.
 */
const initialOf = <T,>(editing: Editing) => (editing ? (editing as unknown as T) : undefined);

/** Every dialog the dashboard can open, keyed by `modal` state. */
export const MODALS: Record<ModalKey, ModalDefinition> = {
  personalInfo: {
    title: () => 'Edit Personal Info',
    render: () => <PersonalInfoForm />
  },
  profilePhoto: {
    title: () => 'Profile Photo',
    render: () => <ProfilePhotoForm />
  },
  skill: {
    title: addOrEdit('Skill Group'),
    render: (editing) => <SkillForm initial={initialOf(editing)} />
  },
  project: {
    title: addOrEdit('Project'),
    render: (editing) => <ProjectForm initial={initialOf(editing)} />
  },
  experience: {
    title: addOrEdit('Experience'),
    render: (editing) => <ExperienceForm initial={initialOf(editing)} />
  },
  achievement: {
    title: addOrEdit('Achievement'),
    render: (editing) => <AchievementForm initial={initialOf(editing)} />
  },
  certification: {
    title: addOrEdit('Certification'),
    render: (editing) => <CertificationForm initial={initialOf(editing)} />
  },
  contactCard: {
    title: addOrEdit('Contact Card'),
    render: (editing) => <ContactCardForm initial={initialOf(editing)} />
  },
  changePassword: {
    title: () => 'Change Password',
    render: (_editing, { close, showToast }) => <ChangePasswordForm onClose={close} showToast={showToast} />
  }
};
