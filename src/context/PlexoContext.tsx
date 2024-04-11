import {
  LabelsDocument,
  MembersDocument,
  ProjectsDocument,
  TeamsDocument,
  UserDocument,
} from "integration/graphql";
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useQuery } from "urql";

import { Label, Member, Project, Task, Team, User } from "lib/types";

type PlexoProviderProps = {
  children: ReactNode;
  plexoAPIEndpoint: string;
  authCookie?: string;
};

type PlexoContextProps = {
  plexoAPIEndpoint: string;
  taskId: string | undefined;
  setTaskId: (taskId: string | undefined) => void;
  tasks: Task[] | undefined;
  setTasks: (tasks: Task[] | undefined) => void;
  navBarOpened: boolean;
  setNavBarOpened: (navBarOpened: boolean) => void;
  newTaskOpened: boolean;
  setNewTaskOpened: (newTaskOpened: boolean) => void;
  createMoreTasks: boolean;
  setCreateMoreTasks: (createMoreTasks: boolean) => void;
  authCookie: string | undefined;
  setAuthCookie: (authCookie: string) => void;
  userData: User | undefined;
  isLoadingUser: boolean;
  projectsData: Project[] | undefined;
  isLoadingProjects: boolean;
  membersData: Member[] | undefined;
  isLoadingMembers: boolean;
  teamsData: Team[] | undefined;
  isLoadingTeams: boolean;
  labelsData: Label[] | undefined;
  isLoadingLabels: boolean;
  chatOpened: boolean;
  setChatOpened: (chatOpened: boolean) => void;
  designProjectOpened: boolean;
  setDesignProjectOpened: (designProjectOpened: boolean) => void;
  newProjectOpened: boolean;
  setNewProjectOpened: (newProjectOpened: boolean) => void;
  newTeamOpened: boolean;
  setNewTeamOpened: (newTeamOpened: boolean) => void;
};

export const PlexoContext = createContext<PlexoContextProps | null>(null);

export const usePlexoContext = () => {
  const context = useContext(PlexoContext);
  if (context === null) {
    throw new Error("usePlexoContext debe estar dentro del PlexoProvider");
  }
  return context;
};

const PlexoProvider = ({
  authCookie: initialAuthCookie,
  plexoAPIEndpoint: initialPlexoAPIEndpoint,
  children,
}: PlexoProviderProps) => {
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[] | undefined>(undefined);

  const [navBarOpened, setNavBarOpened] = useState(false);
  const [newTaskOpened, setNewTaskOpened] = useState(false);
  const [createMoreTasks, setCreateMoreTasks] = useState(false);
  const [chatOpened, setChatOpened] = useState(false);
  const [designProjectOpened, setDesignProjectOpened] = useState(false);
  const [newProjectOpened, setNewProjectOpened] = useState(false);
  const [newTeamOpened, setNewTeamOpened] = useState(false);

  const [authCookie, setAuthCookie] = useState(initialAuthCookie);

  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [projectsData, setProjectsData] = useState<Project[] | undefined>(undefined);
  const [membersData, setMembersData] = useState<Member[] | undefined>(undefined);
  const [teamsData, setTeamsData] = useState<Team[] | undefined>(undefined);
  const [labelsData, setLabelsData] = useState<Label[] | undefined>(undefined);

  const [{ data: user, fetching: isLoadingUser }] = useQuery({
    pause: authCookie ? false : true,
    query: UserDocument,
  });

  const [{ data: projects, fetching: isLoadingProjects }] = useQuery({
    pause: authCookie ? false : true,
    query: ProjectsDocument,
  });

  const [{ data: members, fetching: isLoadingMembers }] = useQuery({
    pause: authCookie ? false : true,
    query: MembersDocument,
  });

  const [{ data: teams, fetching: isLoadingTeams }] = useQuery({
    pause: authCookie ? false : true,
    query: TeamsDocument,
  });

  const [{ data: labels, fetching: isLoadingLabels }] = useQuery({
    pause: authCookie ? false : true,
    query: LabelsDocument,
  });

  useEffect(() => {
    if (!isLoadingProjects && projects) {
      setProjectsData(projects.projects);
    }
  }, [projects, isLoadingProjects]);

  useEffect(() => {
    if (!isLoadingMembers && members) {
      setMembersData(members.members);
    }
  }, [members, isLoadingMembers]);

  useEffect(() => {
    if (!isLoadingTeams && teams) {
      setTeamsData(teams.teams);
    }
  }, [teams, isLoadingTeams]);

  useEffect(() => {
    if (!isLoadingLabels && labels) {
      setLabelsData(labels.labels);
    }
  }, [labels, isLoadingLabels]);

  useEffect(() => {
    if (!isLoadingUser && user) {
      setUserData(user.me);
    }
  }, [user, isLoadingUser]);

  const [plexoAPIEndpoint, _] = useState(initialPlexoAPIEndpoint);

  return (
    <PlexoContext.Provider
      value={{
        plexoAPIEndpoint,
        navBarOpened,
        setNavBarOpened,
        newTaskOpened,
        setNewTaskOpened,
        createMoreTasks,
        setCreateMoreTasks,
        authCookie,
        setAuthCookie,
        taskId,
        setTaskId,
        tasks,
        setTasks,
        userData,
        isLoadingUser,
        projectsData,
        isLoadingProjects,
        membersData,
        isLoadingMembers,
        teamsData,
        isLoadingTeams,
        labelsData,
        isLoadingLabels,
        chatOpened,
        setChatOpened,
        designProjectOpened,
        setDesignProjectOpened,
        newProjectOpened,
        setNewProjectOpened,
        newTeamOpened,
        setNewTeamOpened,
      }}
    >
      {children}
    </PlexoContext.Provider>
  );
};

export default PlexoProvider;
