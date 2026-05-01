export type { Role, ChannelType, TaskStatus, TaskPriority, NotificationType, SubscriptionStatus, SubscriptionPlan, VoiceRoomType } from "@prisma/client";

export interface CreateUserInput {
  email: string;
  name?: string;
  password: string;
}

export interface CreateWorkspaceInput {
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
}

export interface CreateNoteInput {
  workspaceId: string;
  title: string;
  content?: unknown;
  icon?: string;
  parentId?: string;
  createdById: string;
}

export interface CreateMessageInput {
  channelId: string;
  content: string;
  authorId: string;
  parentId?: string;
}

export interface CreateTaskInput {
  workspaceId: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  createdById: string;
  dueDate?: Date;
}
