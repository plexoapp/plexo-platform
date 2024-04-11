import { Select } from "@mantine/core";
import { usePlexoContext } from "context/PlexoContext";
import { GetChatDocument, NewChatDocument } from "integration/graphql";
import { ErrorNotification, SuccessNotification } from "lib/notifications";
import { SelectDataProps } from "lib/types";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";

type ChatProjectSelectorProps = {
  setChatId: (chatId: string | null) => void;
  selectedProject: string | null;
  setSelectedProject: (selectedProject: string | null) => void;
};

const ChatProjectSelector = ({
  setChatId,
  selectedProject,
  setSelectedProject,
}: ChatProjectSelectorProps) => {
  const { projectsData, isLoadingProjects } = usePlexoContext();

  const [projects, setProjects] = useState<SelectDataProps[]>([]);

  const [newChatResult, newChat] = useMutation(NewChatDocument);

  const [{ data: chat, fetching: isLoadingChat }, handlerGetChat] = useQuery({
    pause: true,
    query: GetChatDocument,
    variables: { id: selectedProject },
  });

  const onNewChat = async () => {
    const res = await newChat({
      resourceId: selectedProject,
    });

    if (res.data) {
      SuccessNotification("Created!", "A new chat has been created for the project.");
      close();
    }

    if (res.error) {
      ErrorNotification();
    }
  };

  // Handle change project selector
  useEffect(() => {
    if (projectsData) {
      const parseData: SelectDataProps[] = projectsData.map(item => ({
        value: item.id,
        label: item.name,
      }));
      setProjects(parseData);
    }
  }, [projectsData]);

  // Get chat of a project
  useEffect(() => {
    if (selectedProject) {
      handlerGetChat();
    }
  }, [selectedProject]);

  // Get chat of a project
  useEffect(() => {
    if (chat) {
      if (chat.chats.length) {
        const data = chat.chats;
        setChatId(data[0].id);
      } else {
        onNewChat();
      }
    }
  }, [chat]);

  // Set chatId after created it
  useEffect(() => {
    if (newChatResult.data) {
      const id = newChatResult.data.createChat.id;
      setChatId(id);
    }
  }, [newChatResult]);

  return (
    <Select
      size="sm"
      variant="default"
      placeholder="Select a project"
      disabled={isLoadingProjects || isLoadingChat}
      data={projects}
      value={selectedProject}
      onChange={setSelectedProject}
    />
  );
};

export default ChatProjectSelector;
