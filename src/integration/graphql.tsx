import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  UUID: { input: any; output: any };
};

export type Asset = {
  __typename?: "Asset";
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["UUID"]["output"];
  kind: AssetKind;
  name: Scalars["String"]["output"];
  owner: Member;
  ownerId: Scalars["UUID"]["output"];
  project?: Maybe<Project>;
  projectId?: Maybe<Scalars["UUID"]["output"]>;
  updatedAt: Scalars["DateTime"]["output"];
};

export enum AssetKind {
  Audio = "AUDIO",
  Image = "IMAGE",
  Pdf = "PDF",
  Text = "TEXT",
  Unknown = "UNKNOWN",
  Video = "VIDEO",
  Website = "WEBSITE",
}

export type Change = {
  __typename?: "Change";
  createdAt: Scalars["DateTime"]["output"];
  diffJson: Scalars["String"]["output"];
  id: Scalars["UUID"]["output"];
  operation: ChangeOperation;
  owner: Member;
  ownerId: Scalars["UUID"]["output"];
  resourceId: Scalars["UUID"]["output"];
  resourceType: ChangeResourceType;
  updatedAt: Scalars["DateTime"]["output"];
};

export enum ChangeOperation {
  Delete = "DELETE",
  Insert = "INSERT",
  Update = "UPDATE",
}

export enum ChangeResourceType {
  Assets = "ASSETS",
  Changes = "CHANGES",
  Chats = "CHATS",
  Labels = "LABELS",
  Members = "MEMBERS",
  Messages = "MESSAGES",
  Projects = "PROJECTS",
  Tasks = "TASKS",
  Teams = "TEAMS",
}

export type Chat = {
  __typename?: "Chat";
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["UUID"]["output"];
  owner: Member;
  ownerId: Scalars["UUID"]["output"];
  resourceId: Scalars["UUID"]["output"];
  resourceType: Scalars["String"]["output"];
  status: ChatStatus;
  updatedAt: Scalars["DateTime"]["output"];
};

export type ChatResponseChunk = {
  __typename?: "ChatResponseChunk";
  delta: Scalars["String"]["output"];
  message: Scalars["String"]["output"];
  messageId?: Maybe<Scalars["UUID"]["output"]>;
  toolCalls?: Maybe<Array<ChatResponseToolCall>>;
};

export type ChatResponseFunctionCall = {
  __typename?: "ChatResponseFunctionCall";
  arguments?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
};

export type ChatResponseInput = {
  chatId: Scalars["UUID"]["input"];
  message: Scalars["String"]["input"];
};

export type ChatResponseToolCall = {
  __typename?: "ChatResponseToolCall";
  function?: Maybe<ChatResponseFunctionCall>;
  id?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
};

export enum ChatStatus {
  Active = "ACTIVE",
  Archived = "ARCHIVED",
  None = "NONE",
}

export type CreateAssetInput = {
  kind?: InputMaybe<AssetKind>;
  name: Scalars["String"]["input"];
  projectId?: InputMaybe<Scalars["UUID"]["input"]>;
};

export type CreateChatInput = {
  resourceId: Scalars["UUID"]["input"];
  resourceType: Scalars["String"]["input"];
  status?: InputMaybe<ChatStatus>;
};

export type CreateLabelInput = {
  color?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
};

export type CreateMemberInput = {
  email: Scalars["String"]["input"];
  githubId?: InputMaybe<Scalars["String"]["input"]>;
  googleId?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  passwordHash?: InputMaybe<Scalars["String"]["input"]>;
  photoUrl?: InputMaybe<Scalars["String"]["input"]>;
  role: MemberRole;
};

export type CreateMessageInput = {
  chatId: Scalars["UUID"]["input"];
  content: Scalars["String"]["input"];
  ownerId: Scalars["UUID"]["input"];
  parentId?: InputMaybe<Scalars["UUID"]["input"]>;
  resourceType: Scalars["String"]["input"];
  status?: InputMaybe<MessageStatus>;
};

export type CreateProjectInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  leadId?: InputMaybe<Scalars["UUID"]["input"]>;
  members?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  name: Scalars["String"]["input"];
  prefix?: InputMaybe<Scalars["String"]["input"]>;
  startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  status?: InputMaybe<ProjectStatus>;
  teams?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  visibility?: InputMaybe<ProjectVisibility>;
};

export type CreateTaskInput = {
  assets?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  assignees?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  labels?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  leadId?: InputMaybe<Scalars["UUID"]["input"]>;
  parentId?: InputMaybe<Scalars["UUID"]["input"]>;
  priority?: InputMaybe<TaskPriority>;
  projectId?: InputMaybe<Scalars["UUID"]["input"]>;
  status?: InputMaybe<TaskStatus>;
  subtasks?: InputMaybe<Array<CreateTaskInput>>;
  title: Scalars["String"]["input"];
};

export type CreateTasksInput = {
  tasks: Array<CreateTaskInput>;
};

export type CreateTeamInput = {
  members?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  name: Scalars["String"]["input"];
  prefix?: InputMaybe<Scalars["String"]["input"]>;
  projects?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  visibility: TeamVisibility;
};

export type GetAssetsInput = {
  filter?: InputMaybe<GetAssetsWhere>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<SortOrder>;
};

export type GetAssetsWhere = {
  and?: InputMaybe<Array<GetAssetsWhere>>;
  ids?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  kind?: InputMaybe<AssetKind>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<GetAssetsWhere>>;
  ownerId?: InputMaybe<Scalars["UUID"]["input"]>;
  projectId?: InputMaybe<Scalars["UUID"]["input"]>;
};

export type GetChangesInput = {
  filter?: InputMaybe<GetChangesWhere>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<SortOrder>;
};

export type GetChangesWhere = {
  and?: InputMaybe<Array<GetChangesWhere>>;
  ids?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  operation?: InputMaybe<ChangeOperation>;
  or?: InputMaybe<Array<GetChangesWhere>>;
  ownerId?: InputMaybe<Scalars["UUID"]["input"]>;
  resourceId?: InputMaybe<Scalars["UUID"]["input"]>;
  resourceType?: InputMaybe<ChangeResourceType>;
};

export type GetChatsInput = {
  filter?: InputMaybe<GetChatsWhere>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<SortOrder>;
};

export type GetChatsWhere = {
  and?: InputMaybe<Array<GetChatsWhere>>;
  ids?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  or?: InputMaybe<Array<GetChatsWhere>>;
  ownerId?: InputMaybe<Scalars["UUID"]["input"]>;
  resourceId?: InputMaybe<Scalars["UUID"]["input"]>;
  status?: InputMaybe<ChatStatus>;
};

export type GetLabelsInput = {
  filter?: InputMaybe<GetLabelsWhere>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<SortOrder>;
};

export type GetLabelsWhere = {
  and?: InputMaybe<Array<GetLabelsWhere>>;
  color?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  ids?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<GetLabelsWhere>>;
};

export type GetMembersInput = {
  filter?: InputMaybe<GetMembersWhere>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<SortOrder>;
};

export type GetMembersWhere = {
  and?: InputMaybe<Array<GetMembersWhere>>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  githubId?: InputMaybe<Scalars["String"]["input"]>;
  googleId?: InputMaybe<Scalars["String"]["input"]>;
  ids?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<GetMembersWhere>>;
  photoUrl?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<MemberRole>;
};

export type GetMessagesInput = {
  filter?: InputMaybe<GetMessagesWhere>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<SortOrder>;
};

export type GetMessagesWhere = {
  and?: InputMaybe<Array<GetMessagesWhere>>;
  chatId?: InputMaybe<Scalars["UUID"]["input"]>;
  ids?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  or?: InputMaybe<Array<GetMessagesWhere>>;
  parentId?: InputMaybe<Scalars["UUID"]["input"]>;
  resourceId?: InputMaybe<Scalars["UUID"]["input"]>;
};

export type GetProjectsInput = {
  filter?: InputMaybe<GetProjectsWhere>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<SortOrder>;
};

export type GetProjectsWhere = {
  and?: InputMaybe<Array<GetProjectsWhere>>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  ids?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  leadId?: InputMaybe<Scalars["UUID"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<GetProjectsWhere>>;
  ownerId?: InputMaybe<Scalars["UUID"]["input"]>;
  prefix?: InputMaybe<Scalars["String"]["input"]>;
  startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type GetTasksInput = {
  filter?: InputMaybe<GetTasksWhere>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<SortOrder>;
};

export type GetTasksWhere = {
  and?: InputMaybe<Array<GetTasksWhere>>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  ids?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  leadId?: InputMaybe<Scalars["UUID"]["input"]>;
  or?: InputMaybe<Array<GetTasksWhere>>;
  ownerId?: InputMaybe<Scalars["UUID"]["input"]>;
  parentId?: InputMaybe<Scalars["UUID"]["input"]>;
  priority?: InputMaybe<TaskPriority>;
  projectId?: InputMaybe<Scalars["UUID"]["input"]>;
  status?: InputMaybe<TaskStatus>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type GetTeamsInput = {
  filter?: InputMaybe<GetTeamsWhere>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<SortOrder>;
};

export type GetTeamsWhere = {
  and?: InputMaybe<Array<GetTeamsWhere>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<GetTeamsWhere>>;
  ownerId?: InputMaybe<Scalars["UUID"]["input"]>;
  prefix?: InputMaybe<Scalars["String"]["input"]>;
  visibility?: InputMaybe<TeamVisibility>;
};

export type Label = {
  __typename?: "Label";
  color?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["UUID"]["output"];
  name: Scalars["String"]["output"];
  owner: Member;
  ownerId: Scalars["UUID"]["output"];
  tasks: Array<Task>;
  updatedAt: Scalars["DateTime"]["output"];
};

export type ListenEvent = {
  __typename?: "ListenEvent";
  operation: ChangeOperation;
  resource: ChangeResourceType;
  rowId: Scalars["UUID"]["output"];
};

export type LoginResponse = {
  __typename?: "LoginResponse";
  memberId: Scalars["String"]["output"];
  token: Scalars["String"]["output"];
};

export type Member = {
  __typename?: "Member";
  createdAt: Scalars["DateTime"]["output"];
  email: Scalars["String"]["output"];
  githubId?: Maybe<Scalars["String"]["output"]>;
  googleId?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["UUID"]["output"];
  name: Scalars["String"]["output"];
  photoUrl?: Maybe<Scalars["String"]["output"]>;
  projects: Array<Project>;
  role: MemberRole;
  tasks: Array<Task>;
  teams: Array<Team>;
  updatedAt: Scalars["DateTime"]["output"];
};

export enum MemberRole {
  Admin = "ADMIN",
  Member = "MEMBER",
  ReadOnly = "READ_ONLY",
}

export type Message = {
  __typename?: "Message";
  chat: Chat;
  chatId: Scalars["UUID"]["output"];
  content: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["UUID"]["output"];
  owner: Member;
  ownerId: Scalars["UUID"]["output"];
  parentId?: Maybe<Scalars["UUID"]["output"]>;
  status: MessageStatus;
  updatedAt: Scalars["DateTime"]["output"];
};

export enum MessageStatus {
  Read = "READ",
  Received = "RECEIVED",
  Sent = "SENT",
}

export type MutationRoot = {
  __typename?: "MutationRoot";
  chat: ChatResponseChunk;
  createAsset: Asset;
  createChat: Chat;
  createLabel: Label;
  createMember: Member;
  createMessage: Message;
  createProject: Project;
  createTask: Task;
  createTasks: Array<Task>;
  createTeam: Team;
  deleteAsset: Asset;
  deleteChat: Chat;
  deleteLabel: Label;
  deleteMember: Member;
  deleteMessage: Message;
  deleteProject: Project;
  deleteTask: Task;
  deleteTeam: Team;
  login: LoginResponse;
  register: LoginResponse;
  updateAsset: Asset;
  updateChat: Chat;
  updateLabel: Label;
  updateMember: Member;
  updateMessage: Message;
  updatePassword: Member;
  updateProfile: Member;
  updateProject: Project;
  updateTask: Task;
  updateTeam: Team;
};

export type MutationRootChatArgs = {
  input: ChatResponseInput;
};

export type MutationRootCreateAssetArgs = {
  input: CreateAssetInput;
};

export type MutationRootCreateChatArgs = {
  input: CreateChatInput;
};

export type MutationRootCreateLabelArgs = {
  input: CreateLabelInput;
};

export type MutationRootCreateMemberArgs = {
  input: CreateMemberInput;
};

export type MutationRootCreateMessageArgs = {
  input: CreateMessageInput;
};

export type MutationRootCreateProjectArgs = {
  input: CreateProjectInput;
};

export type MutationRootCreateTaskArgs = {
  input: CreateTaskInput;
};

export type MutationRootCreateTasksArgs = {
  input: CreateTasksInput;
};

export type MutationRootCreateTeamArgs = {
  input: CreateTeamInput;
};

export type MutationRootDeleteAssetArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationRootDeleteChatArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationRootDeleteLabelArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationRootDeleteMemberArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationRootDeleteMessageArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationRootDeleteProjectArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationRootDeleteTaskArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationRootDeleteTeamArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationRootLoginArgs = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type MutationRootRegisterArgs = {
  email: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type MutationRootUpdateAssetArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdateAssetInput;
};

export type MutationRootUpdateChatArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdateChatInput;
};

export type MutationRootUpdateLabelArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdateLabelInput;
};

export type MutationRootUpdateMemberArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdateMemberInput;
};

export type MutationRootUpdateMessageArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdateMessageInput;
};

export type MutationRootUpdatePasswordArgs = {
  input: UpdatePasswordInput;
};

export type MutationRootUpdateProfileArgs = {
  input: UpdateProfileInput;
};

export type MutationRootUpdateProjectArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdateProjectInput;
};

export type MutationRootUpdateTaskArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdateTaskInput;
};

export type MutationRootUpdateTeamArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdateTeamInput;
};

export type Project = {
  __typename?: "Project";
  assets: Array<Asset>;
  changes: Array<Change>;
  createdAt: Scalars["DateTime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  dueDate?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["UUID"]["output"];
  lead?: Maybe<Member>;
  leadId?: Maybe<Scalars["UUID"]["output"]>;
  members: Array<Member>;
  name: Scalars["String"]["output"];
  owner: Member;
  ownerId: Scalars["UUID"]["output"];
  prefix?: Maybe<Scalars["String"]["output"]>;
  startDate?: Maybe<Scalars["DateTime"]["output"]>;
  status: ProjectStatus;
  tasks: Array<Task>;
  teams: Array<Team>;
  updatedAt: Scalars["DateTime"]["output"];
  visibility: ProjectVisibility;
};

export enum ProjectStatus {
  Backlog = "BACKLOG",
  Canceled = "CANCELED",
  Done = "DONE",
  InProgress = "IN_PROGRESS",
  None = "NONE",
  ToDo = "TO_DO",
}

export type ProjectSuggestion = {
  __typename?: "ProjectSuggestion";
  description: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  prefix: Scalars["String"]["output"];
  status: ProjectStatus;
  tasks?: Maybe<Array<TaskSuggestion>>;
  visibility: ProjectVisibility;
};

export type ProjectSuggestionInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  generateTasksNumber?: InputMaybe<Scalars["Int"]["input"]>;
  initialTasks?: InputMaybe<Array<ProjectTaskSuggestionInput>>;
  title: Scalars["String"]["input"];
};

export type ProjectTaskSuggestionInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  priority?: InputMaybe<TaskPriority>;
  status?: InputMaybe<TaskStatus>;
  title: Scalars["String"]["input"];
};

export enum ProjectVisibility {
  Internal = "INTERNAL",
  None = "NONE",
  Private = "PRIVATE",
  Public = "PUBLIC",
}

export type QueryRoot = {
  __typename?: "QueryRoot";
  asset: Asset;
  assets: Array<Asset>;
  change: Change;
  changes: Array<Change>;
  chat: Chat;
  chats: Array<Chat>;
  label: Label;
  labels: Array<Label>;
  me: Member;
  member: Member;
  members: Array<Member>;
  message: Message;
  messages: Array<Message>;
  project: Project;
  projects: Array<Project>;
  subdivideTask: Array<TaskSuggestion>;
  suggestNextProject: ProjectSuggestion;
  suggestNextTask: TaskSuggestion;
  task: Task;
  tasks: Array<Task>;
  team: Team;
  teams: Array<Team>;
};

export type QueryRootAssetArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryRootAssetsArgs = {
  input?: InputMaybe<GetAssetsInput>;
};

export type QueryRootChangeArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryRootChangesArgs = {
  input?: InputMaybe<GetChangesInput>;
};

export type QueryRootChatArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryRootChatsArgs = {
  input?: InputMaybe<GetChatsInput>;
};

export type QueryRootLabelArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryRootLabelsArgs = {
  input?: InputMaybe<GetLabelsInput>;
};

export type QueryRootMemberArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryRootMembersArgs = {
  input?: InputMaybe<GetMembersInput>;
};

export type QueryRootMessageArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryRootMessagesArgs = {
  input?: InputMaybe<GetMessagesInput>;
};

export type QueryRootProjectArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryRootProjectsArgs = {
  input?: InputMaybe<GetProjectsInput>;
};

export type QueryRootSubdivideTaskArgs = {
  input: SubdivideTaskInput;
};

export type QueryRootSuggestNextProjectArgs = {
  input: ProjectSuggestionInput;
};

export type QueryRootSuggestNextTaskArgs = {
  input: TaskSuggestionInput;
};

export type QueryRootTaskArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryRootTasksArgs = {
  input?: InputMaybe<GetTasksInput>;
};

export type QueryRootTeamArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryRootTeamsArgs = {
  input?: InputMaybe<GetTeamsInput>;
};

export enum SortOrder {
  Asc = "ASC",
  Desc = "DESC",
}

export type SubdivideTaskInput = {
  subtasks: Scalars["Int"]["input"];
  taskId: Scalars["UUID"]["input"];
  withTasksContext?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type SubscriptionRoot = {
  __typename?: "SubscriptionRoot";
  assets: ListenEvent;
  chat: ChatResponseChunk;
  chats: ListenEvent;
  labels: ListenEvent;
  members: ListenEvent;
  messages: ListenEvent;
  projects: ListenEvent;
  tasks: ListenEvent;
  teams: ListenEvent;
};

export type SubscriptionRootChatArgs = {
  input: ChatResponseInput;
};

export type Task = {
  __typename?: "Task";
  assignees: Array<Member>;
  changes: Array<Change>;
  count: Scalars["Int"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  dueDate?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["UUID"]["output"];
  labels: Array<Label>;
  lead?: Maybe<Member>;
  leadId?: Maybe<Scalars["UUID"]["output"]>;
  owner: Member;
  ownerId: Scalars["UUID"]["output"];
  parent?: Maybe<Task>;
  parentId?: Maybe<Scalars["UUID"]["output"]>;
  priority: TaskPriority;
  project?: Maybe<Project>;
  projectId?: Maybe<Scalars["UUID"]["output"]>;
  status: TaskStatus;
  subtasks: Array<Task>;
  title: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
};

export enum TaskPriority {
  High = "HIGH",
  Low = "LOW",
  Medium = "MEDIUM",
  None = "NONE",
  Urgent = "URGENT",
}

export enum TaskStatus {
  Backlog = "BACKLOG",
  Canceled = "CANCELED",
  Done = "DONE",
  Draft = "DRAFT",
  InProgress = "IN_PROGRESS",
  None = "NONE",
  ToDo = "TO_DO",
}

export type TaskSuggestion = {
  __typename?: "TaskSuggestion";
  description: Scalars["String"]["output"];
  dueDate: Scalars["DateTime"]["output"];
  priority: TaskPriority;
  status: TaskStatus;
  title: Scalars["String"]["output"];
};

export type TaskSuggestionInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  priority?: InputMaybe<TaskPriority>;
  projectId?: InputMaybe<Scalars["UUID"]["input"]>;
  status?: InputMaybe<TaskStatus>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type Team = {
  __typename?: "Team";
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["UUID"]["output"];
  members: Array<Member>;
  name: Scalars["String"]["output"];
  owner: Member;
  ownerId: Scalars["UUID"]["output"];
  prefix?: Maybe<Scalars["String"]["output"]>;
  projects: Array<Project>;
  updatedAt: Scalars["DateTime"]["output"];
  visibility: TeamVisibility;
};

export enum TeamVisibility {
  Internal = "INTERNAL",
  None = "NONE",
  Private = "PRIVATE",
  Public = "PUBLIC",
}

export type UpdateAssetInput = {
  kind?: InputMaybe<AssetKind>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  projectId?: InputMaybe<Scalars["UUID"]["input"]>;
};

export type UpdateChatInput = {
  status?: InputMaybe<ChatStatus>;
};

export type UpdateLabelInput = {
  color?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateListInput = {
  add: Array<Scalars["UUID"]["input"]>;
  remove: Array<Scalars["UUID"]["input"]>;
};

export type UpdateMemberInput = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  githubId?: InputMaybe<Scalars["String"]["input"]>;
  googleId?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  passwordHash?: InputMaybe<Scalars["String"]["input"]>;
  photoUrl?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<MemberRole>;
};

export type UpdateMessageInput = {
  content?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<MessageStatus>;
};

export type UpdatePasswordInput = {
  currentPassword: Scalars["String"]["input"];
  newPassword: Scalars["String"]["input"];
};

export type UpdateProfileInput = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  photoUrl?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateProjectInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  leadId?: InputMaybe<Scalars["UUID"]["input"]>;
  members?: InputMaybe<UpdateListInput>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  prefix?: InputMaybe<Scalars["String"]["input"]>;
  startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  status?: InputMaybe<ProjectStatus>;
  teams?: InputMaybe<UpdateListInput>;
  visibility?: InputMaybe<ProjectVisibility>;
};

export type UpdateTaskInput = {
  assets?: InputMaybe<UpdateListInput>;
  assignees?: InputMaybe<UpdateListInput>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  labels?: InputMaybe<UpdateListInput>;
  leadId?: InputMaybe<Scalars["UUID"]["input"]>;
  parentId?: InputMaybe<Scalars["UUID"]["input"]>;
  priority?: InputMaybe<TaskPriority>;
  projectId?: InputMaybe<Scalars["UUID"]["input"]>;
  status?: InputMaybe<TaskStatus>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateTeamInput = {
  members?: InputMaybe<UpdateListInput>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  ownerId?: InputMaybe<Scalars["UUID"]["input"]>;
  prefix?: InputMaybe<Scalars["String"]["input"]>;
  teams?: InputMaybe<UpdateListInput>;
  visibility?: InputMaybe<TeamVisibility>;
};

export type RegisterMutationVariables = Exact<{
  name: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
}>;

export type RegisterMutation = {
  __typename?: "MutationRoot";
  register: { __typename?: "LoginResponse"; token: string };
};

export type LoginMutationVariables = Exact<{
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
}>;

export type LoginMutation = {
  __typename?: "MutationRoot";
  login: { __typename?: "LoginResponse"; token: string };
};

export type SendMessageSubscriptionVariables = Exact<{
  chatId: Scalars["UUID"]["input"];
  message: Scalars["String"]["input"];
}>;

export type SendMessageSubscription = {
  __typename?: "SubscriptionRoot";
  chat: {
    __typename?: "ChatResponseChunk";
    delta: string;
    message: string;
    messageId?: any | null;
    toolCalls?: Array<{
      __typename?: "ChatResponseToolCall";
      id?: string | null;
      type?: string | null;
      function?: {
        __typename?: "ChatResponseFunctionCall";
        name?: string | null;
        arguments?: string | null;
      } | null;
    }> | null;
  };
};

export type GetChatQueryVariables = Exact<{
  id?: InputMaybe<Scalars["UUID"]["input"]>;
}>;

export type GetChatQuery = {
  __typename?: "QueryRoot";
  chats: Array<{ __typename?: "Chat"; id: any; resourceId: any }>;
};

export type NewChatMutationVariables = Exact<{
  resourceId: Scalars["UUID"]["input"];
}>;

export type NewChatMutation = {
  __typename?: "MutationRoot";
  createChat: { __typename?: "Chat"; id: any; resourceId: any };
};

export type GetMessagesQueryVariables = Exact<{
  chatId?: InputMaybe<Scalars["UUID"]["input"]>;
}>;

export type GetMessagesQuery = {
  __typename?: "QueryRoot";
  messages: Array<{ __typename?: "Message"; id: any; content: string; createdAt: any }>;
};

export type LabelsQueryVariables = Exact<{ [key: string]: never }>;

export type LabelsQuery = {
  __typename?: "QueryRoot";
  labels: Array<{
    __typename?: "Label";
    id: any;
    name: string;
    description?: string | null;
    color?: string | null;
    createdAt: any;
  }>;
};

export type CreateLabelMutationVariables = Exact<{
  input: CreateLabelInput;
}>;

export type CreateLabelMutation = {
  __typename?: "MutationRoot";
  createLabel: {
    __typename?: "Label";
    id: any;
    name: string;
    color?: string | null;
    description?: string | null;
  };
};

export type UpdateLabelMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
  input: UpdateLabelInput;
}>;

export type UpdateLabelMutation = {
  __typename?: "MutationRoot";
  updateLabel: {
    __typename?: "Label";
    id: any;
    name: string;
    color?: string | null;
    description?: string | null;
  };
};

export type DeleteLabelMutationVariables = Exact<{
  labelId: Scalars["UUID"]["input"];
}>;

export type DeleteLabelMutation = {
  __typename?: "MutationRoot";
  deleteLabel: {
    __typename?: "Label";
    id: any;
    name: string;
    color?: string | null;
    description?: string | null;
  };
};

export type MembersQueryVariables = Exact<{ [key: string]: never }>;

export type MembersQuery = {
  __typename?: "QueryRoot";
  members: Array<{
    __typename?: "Member";
    id: any;
    createdAt: any;
    updatedAt: any;
    name: string;
    email: string;
    role: MemberRole;
    githubId?: string | null;
    googleId?: string | null;
    photoUrl?: string | null;
  }>;
};

export type UpdateMemberMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
  input: UpdateMemberInput;
}>;

export type UpdateMemberMutation = {
  __typename?: "MutationRoot";
  updateMember: { __typename?: "Member"; id: any; name: string; email: string; role: MemberRole };
};

export type DeleteMemberMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type DeleteMemberMutation = {
  __typename?: "MutationRoot";
  deleteMember: { __typename?: "Member"; id: any; name: string; email: string };
};

export type ProjectsQueryVariables = Exact<{ [key: string]: never }>;

export type ProjectsQuery = {
  __typename?: "QueryRoot";
  projects: Array<{
    __typename?: "Project";
    id: any;
    createdAt: any;
    updatedAt: any;
    name: string;
    prefix?: string | null;
    ownerId: any;
    description?: string | null;
    leadId?: any | null;
    startDate?: any | null;
    dueDate?: any | null;
    status: ProjectStatus;
    owner: { __typename?: "Member"; id: any };
    tasks: Array<{ __typename?: "Task"; id: any; title: string }>;
    members: Array<{ __typename?: "Member"; id: any; name: string }>;
    lead?: { __typename?: "Member"; id: any; name: string; photoUrl?: string | null } | null;
  }>;
};

export type ProjectByIdQueryVariables = Exact<{
  projectId: Scalars["UUID"]["input"];
}>;

export type ProjectByIdQuery = {
  __typename?: "QueryRoot";
  project: {
    __typename?: "Project";
    id: any;
    name: string;
    prefix?: string | null;
    description?: string | null;
    leadId?: any | null;
    startDate?: any | null;
    dueDate?: any | null;
    status: ProjectStatus;
    visibility: ProjectVisibility;
    owner: { __typename?: "Member"; id: any; name: string };
    lead?: { __typename?: "Member"; id: any; name: string; photoUrl?: string | null } | null;
    members: Array<{ __typename?: "Member"; id: any; name: string }>;
    tasks: Array<{ __typename?: "Task"; id: any; title: string }>;
    teams: Array<{ __typename?: "Team"; id: any; name: string }>;
  };
};

export type NewProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;

export type NewProjectMutation = {
  __typename?: "MutationRoot";
  createProject: { __typename?: "Project"; id: any; name: string };
};

export type DeleteProjectMutationVariables = Exact<{
  projectId: Scalars["UUID"]["input"];
}>;

export type DeleteProjectMutation = {
  __typename?: "MutationRoot";
  deleteProject: { __typename?: "Project"; id: any; name: string };
};

export type UpdateProjectMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
  input: UpdateProjectInput;
}>;

export type UpdateProjectMutation = {
  __typename?: "MutationRoot";
  updateProject: { __typename?: "Project"; id: any; name: string };
};

export type SuggestProjectQueryVariables = Exact<{
  input: ProjectSuggestionInput;
}>;

export type SuggestProjectQuery = {
  __typename?: "QueryRoot";
  suggestNextProject: {
    __typename?: "ProjectSuggestion";
    name: string;
    status: ProjectStatus;
    visibility: ProjectVisibility;
    description: string;
    tasks?: Array<{
      __typename?: "TaskSuggestion";
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
    }> | null;
  };
};

export type TasksQueryVariables = Exact<{ [key: string]: never }>;

export type TasksQuery = {
  __typename?: "QueryRoot";
  tasks: Array<{
    __typename?: "Task";
    id: any;
    priority: TaskPriority;
    status: TaskStatus;
    count: number;
    title: string;
    createdAt: any;
    leadId?: any | null;
    ownerId: any;
    projectId?: any | null;
    labels: Array<{ __typename?: "Label"; id: any; name: string; color?: string | null }>;
    project?: { __typename?: "Project"; id: any; name: string } | null;
    lead?: { __typename?: "Member"; id: any; name: string; photoUrl?: string | null } | null;
    assignees: Array<{ __typename?: "Member"; id: any; name: string }>;
  }>;
};

export type TaskByIdQueryVariables = Exact<{
  taskId: Scalars["UUID"]["input"];
}>;

export type TaskByIdQuery = {
  __typename?: "QueryRoot";
  task: {
    __typename: "Task";
    id: any;
    title: string;
    description?: string | null;
    ownerId: any;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: any | null;
    count: number;
    parent?: { __typename?: "Task"; id: any; count: number } | null;
    labels: Array<{ __typename?: "Label"; id: any; name: string }>;
    assignees: Array<{ __typename?: "Member"; id: any; name: string }>;
    lead?: { __typename?: "Member"; id: any; name: string; photoUrl?: string | null } | null;
    project?: { __typename?: "Project"; id: any; name: string } | null;
    subtasks: Array<{
      __typename?: "Task";
      id: any;
      createdAt: any;
      updatedAt: any;
      title: string;
      description?: string | null;
      status: TaskStatus;
      priority: TaskPriority;
      ownerId: any;
      count: number;
      leadId?: any | null;
      projectId?: any | null;
      dueDate?: any | null;
      labels: Array<{ __typename?: "Label"; id: any; name: string; color?: string | null }>;
      owner: { __typename?: "Member"; id: any };
      assignees: Array<{ __typename?: "Member"; id: any; name: string }>;
      project?: { __typename?: "Project"; id: any; name: string } | null;
      lead?: { __typename?: "Member"; id: any; name: string } | null;
    }>;
  };
};

export type NewTaskMutationVariables = Exact<{
  input: CreateTaskInput;
}>;

export type NewTaskMutation = {
  __typename?: "MutationRoot";
  createTask: { __typename?: "Task"; id: any; title: string; status: TaskStatus };
};

export type DeleteTaskMutationVariables = Exact<{
  taskId: Scalars["UUID"]["input"];
}>;

export type DeleteTaskMutation = {
  __typename?: "MutationRoot";
  deleteTask: { __typename?: "Task"; id: any; title: string };
};

export type UpdateTaskMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
  input: UpdateTaskInput;
}>;

export type UpdateTaskMutation = {
  __typename?: "MutationRoot";
  updateTask: { __typename: "Task"; id: any; title: string };
};

export type SuggestNewTaskQueryVariables = Exact<{
  input: TaskSuggestionInput;
}>;

export type SuggestNewTaskQuery = {
  __typename?: "QueryRoot";
  suggestNextTask: {
    __typename?: "TaskSuggestion";
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: any;
  };
};

export type SubdivideTaskQueryVariables = Exact<{
  input: SubdivideTaskInput;
}>;

export type SubdivideTaskQuery = {
  __typename?: "QueryRoot";
  subdivideTask: Array<{
    __typename?: "TaskSuggestion";
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: any;
  }>;
};

export type CreateTasksMutationVariables = Exact<{
  input: CreateTasksInput;
}>;

export type CreateTasksMutation = {
  __typename?: "MutationRoot";
  createTasks: Array<{ __typename?: "Task"; id: any; title: string }>;
};

export type TaskChangesQueryVariables = Exact<{
  input?: InputMaybe<GetChangesInput>;
}>;

export type TaskChangesQuery = {
  __typename?: "QueryRoot";
  changes: Array<{
    __typename?: "Change";
    id: any;
    createdAt: any;
    resourceId: any;
    operation: ChangeOperation;
    resourceType: ChangeResourceType;
    owner: { __typename?: "Member"; name: string; photoUrl?: string | null };
  }>;
};

export type TeamsQueryVariables = Exact<{ [key: string]: never }>;

export type TeamsQuery = {
  __typename?: "QueryRoot";
  teams: Array<{
    __typename?: "Team";
    id: any;
    createdAt: any;
    updatedAt: any;
    name: string;
    ownerId: any;
    visibility: TeamVisibility;
    owner: { __typename?: "Member"; id: any };
    members: Array<{ __typename?: "Member"; id: any }>;
  }>;
};

export type TeamByIdQueryVariables = Exact<{
  teamId: Scalars["UUID"]["input"];
}>;

export type TeamByIdQuery = {
  __typename?: "QueryRoot";
  team: {
    __typename?: "Team";
    id: any;
    name: string;
    prefix?: string | null;
    visibility: TeamVisibility;
    members: Array<{ __typename?: "Member"; id: any; name: string }>;
    projects: Array<{ __typename?: "Project"; id: any; name: string }>;
  };
};

export type NewTeamMutationVariables = Exact<{
  input: CreateTeamInput;
}>;

export type NewTeamMutation = {
  __typename?: "MutationRoot";
  createTeam: { __typename?: "Team"; id: any; name: string };
};

export type DeleteTeamMutationVariables = Exact<{
  teamId: Scalars["UUID"]["input"];
}>;

export type DeleteTeamMutation = {
  __typename?: "MutationRoot";
  deleteTeam: { __typename?: "Team"; id: any; name: string };
};

export type UpdateTeamMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
  input: UpdateTeamInput;
}>;

export type UpdateTeamMutation = {
  __typename?: "MutationRoot";
  updateTeam: { __typename?: "Team"; id: any; name: string };
};

export type UserQueryVariables = Exact<{ [key: string]: never }>;

export type UserQuery = {
  __typename?: "QueryRoot";
  me: {
    __typename?: "Member";
    id: any;
    name: string;
    email: string;
    photoUrl?: string | null;
    role: MemberRole;
  };
};

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;

export type UpdateProfileMutation = {
  __typename?: "MutationRoot";
  updateProfile: { __typename?: "Member"; name: string };
};

export type UpdatePasswordMutationVariables = Exact<{
  input: UpdatePasswordInput;
}>;

export type UpdatePasswordMutation = {
  __typename?: "MutationRoot";
  updatePassword: { __typename?: "Member"; name: string };
};

export const RegisterDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Register" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "email" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "password" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "register" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: { kind: "Variable", name: { kind: "Name", value: "name" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "email" },
                value: { kind: "Variable", name: { kind: "Name", value: "email" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "password" },
                value: { kind: "Variable", name: { kind: "Name", value: "password" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "token" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Login" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "email" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "password" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "login" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "email" },
                value: { kind: "Variable", name: { kind: "Name", value: "email" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "password" },
                value: { kind: "Variable", name: { kind: "Name", value: "password" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "token" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const SendMessageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "SendMessage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "chatId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "message" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "chat" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "chatId" },
                      value: { kind: "Variable", name: { kind: "Name", value: "chatId" } },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "message" },
                      value: { kind: "Variable", name: { kind: "Name", value: "message" } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "delta" } },
                { kind: "Field", name: { kind: "Name", value: "message" } },
                { kind: "Field", name: { kind: "Name", value: "messageId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "toolCalls" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "type" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "function" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "arguments" } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SendMessageSubscription, SendMessageSubscriptionVariables>;
export const GetChatDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetChat" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "chats" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "filter" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "resourceId" },
                            value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "resourceId" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetChatQuery, GetChatQueryVariables>;
export const NewChatDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "NewChat" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "resourceId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createChat" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "resourceId" },
                      value: { kind: "Variable", name: { kind: "Name", value: "resourceId" } },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "resourceType" },
                      value: { kind: "StringValue", value: "project", block: false },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "resourceId" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewChatMutation, NewChatMutationVariables>;
export const GetMessagesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetMessages" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "chatId" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "messages" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "filter" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "chatId" },
                            value: { kind: "Variable", name: { kind: "Name", value: "chatId" } },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "sortBy" },
                      value: { kind: "StringValue", value: "created_at", block: false },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "sortOrder" },
                      value: { kind: "EnumValue", value: "DESC" },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "limit" },
                      value: { kind: "IntValue", value: "20" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "content" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMessagesQuery, GetMessagesQueryVariables>;
export const LabelsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Labels" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "labels" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "color" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LabelsQuery, LabelsQueryVariables>;
export const CreateLabelDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateLabel" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "CreateLabelInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createLabel" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "color" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateLabelMutation, CreateLabelMutationVariables>;
export const UpdateLabelDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateLabel" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UpdateLabelInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateLabel" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "color" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateLabelMutation, UpdateLabelMutationVariables>;
export const DeleteLabelDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteLabel" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "labelId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteLabel" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "labelId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "color" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteLabelMutation, DeleteLabelMutationVariables>;
export const MembersDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Members" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "members" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "role" } },
                { kind: "Field", name: { kind: "Name", value: "githubId" } },
                { kind: "Field", name: { kind: "Name", value: "googleId" } },
                { kind: "Field", name: { kind: "Name", value: "photoUrl" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MembersQuery, MembersQueryVariables>;
export const UpdateMemberDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateMember" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UpdateMemberInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateMember" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "role" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateMemberMutation, UpdateMemberMutationVariables>;
export const DeleteMemberDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteMember" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteMember" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteMemberMutation, DeleteMemberMutationVariables>;
export const ProjectsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Projects" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "projects" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "prefix" } },
                { kind: "Field", name: { kind: "Name", value: "ownerId" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "leadId" } },
                { kind: "Field", name: { kind: "Name", value: "startDate" } },
                { kind: "Field", name: { kind: "Name", value: "dueDate" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "owner" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "tasks" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "members" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "lead" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "photoUrl" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProjectsQuery, ProjectsQueryVariables>;
export const ProjectByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ProjectById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "projectId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "projectId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "prefix" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "leadId" } },
                { kind: "Field", name: { kind: "Name", value: "startDate" } },
                { kind: "Field", name: { kind: "Name", value: "dueDate" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "visibility" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "owner" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "lead" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "photoUrl" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "members" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "tasks" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "teams" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProjectByIdQuery, ProjectByIdQueryVariables>;
export const NewProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "NewProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "CreateProjectInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createProject" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewProjectMutation, NewProjectMutationVariables>;
export const DeleteProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "projectId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteProject" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "projectId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const UpdateProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UpdateProjectInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateProject" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const SuggestProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SuggestProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ProjectSuggestionInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "suggestNextProject" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "visibility" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "tasks" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "priority" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SuggestProjectQuery, SuggestProjectQueryVariables>;
export const TasksDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Tasks" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "tasks" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "priority" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "count" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "leadId" } },
                { kind: "Field", name: { kind: "Name", value: "ownerId" } },
                { kind: "Field", name: { kind: "Name", value: "projectId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "labels" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "color" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "lead" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "photoUrl" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "assignees" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TasksQuery, TasksQueryVariables>;
export const TaskByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "TaskById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "taskId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "task" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "taskId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "ownerId" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "priority" } },
                { kind: "Field", name: { kind: "Name", value: "dueDate" } },
                { kind: "Field", name: { kind: "Name", value: "count" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "parent" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "labels" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "assignees" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "lead" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "photoUrl" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subtasks" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "priority" } },
                      { kind: "Field", name: { kind: "Name", value: "ownerId" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "labels" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "color" } },
                          ],
                        },
                      },
                      { kind: "Field", name: { kind: "Name", value: "leadId" } },
                      { kind: "Field", name: { kind: "Name", value: "projectId" } },
                      { kind: "Field", name: { kind: "Name", value: "dueDate" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "owner" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "assignees" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "lead" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TaskByIdQuery, TaskByIdQueryVariables>;
export const NewTaskDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "NewTask" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "CreateTaskInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createTask" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewTaskMutation, NewTaskMutationVariables>;
export const DeleteTaskDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteTask" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "taskId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteTask" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "taskId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const UpdateTaskDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateTask" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UpdateTaskInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateTask" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "__typename" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const SuggestNewTaskDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SuggestNewTask" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "TaskSuggestionInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "suggestNextTask" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "priority" } },
                { kind: "Field", name: { kind: "Name", value: "dueDate" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SuggestNewTaskQuery, SuggestNewTaskQueryVariables>;
export const SubdivideTaskDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SubdivideTask" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "SubdivideTaskInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "subdivideTask" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "priority" } },
                { kind: "Field", name: { kind: "Name", value: "dueDate" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SubdivideTaskQuery, SubdivideTaskQueryVariables>;
export const CreateTasksDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateTasks" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "CreateTasksInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createTasks" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateTasksMutation, CreateTasksMutationVariables>;
export const TaskChangesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "TaskChanges" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "GetChangesInput" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "changes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "resourceId" } },
                { kind: "Field", name: { kind: "Name", value: "operation" } },
                { kind: "Field", name: { kind: "Name", value: "resourceType" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "owner" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "photoUrl" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TaskChangesQuery, TaskChangesQueryVariables>;
export const TeamsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Teams" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "teams" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "ownerId" } },
                { kind: "Field", name: { kind: "Name", value: "visibility" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "owner" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "members" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamsQuery, TeamsQueryVariables>;
export const TeamByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "TeamById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "teamId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "team" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "teamId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "prefix" } },
                { kind: "Field", name: { kind: "Name", value: "visibility" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "members" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "projects" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamByIdQuery, TeamByIdQueryVariables>;
export const NewTeamDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "NewTeam" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "CreateTeamInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createTeam" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewTeamMutation, NewTeamMutationVariables>;
export const DeleteTeamDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteTeam" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "teamId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteTeam" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "teamId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteTeamMutation, DeleteTeamMutationVariables>;
export const UpdateTeamDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateTeam" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UpdateTeamInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateTeam" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateTeamMutation, UpdateTeamMutationVariables>;
export const UserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "User" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "photoUrl" } },
                { kind: "Field", name: { kind: "Name", value: "role" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const UpdateProfileDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProfile" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UpdateProfileInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateProfile" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const UpdatePasswordDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdatePassword" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UpdatePasswordInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updatePassword" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdatePasswordMutation, UpdatePasswordMutationVariables>;
