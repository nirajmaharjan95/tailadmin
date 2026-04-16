export type ModalType = "add" | "edit" | "delete" | null;

export interface Notification {
  id: number;
  name: string;
  action: string;
  target: string;
  category: string;
  time: string;
  avatar: string;
  online: boolean;
}
