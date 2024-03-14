import {
  TasksQuery,
  MembersQuery,
  ProjectsQuery,
  TeamsQuery,
  TaskByIdQuery,
  LabelsQuery,
  UserQuery,
  ProjectByIdQuery,
  TeamByIdQuery,
  SubdivideTaskQuery,
  TaskChangesQuery,
} from "integration/graphql";

export type Task = TasksQuery["tasks"][number];
export type TaskById = TaskByIdQuery["task"];
export type Project = ProjectsQuery["projects"][number];
export type Member = MembersQuery["members"][number];
export type Team = TeamsQuery["teams"][number];
export type Label = LabelsQuery["labels"][number];
export type ProjectById = ProjectByIdQuery["project"];
export type TeamById = TeamByIdQuery["team"];
export type User = UserQuery["me"];
export type TaskSuggestion = SubdivideTaskQuery["subdivideTask"][number];
export type TaskChanges = TaskChangesQuery["changes"][number];
