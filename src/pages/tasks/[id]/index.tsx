import { useEffect, type ReactElement } from "react";
import { useRouter } from "next/router";
import { useQuery } from "urql";

import { NextPageWithLayout } from "pages/_app";
import TaskDetailPageContent from "modules/taskDetail";
import Layout from "components/ui/Layout";
import { usePlexoContext } from "context/PlexoContext";
import { TaskByIdDocument } from "integration/graphql";

const TaskPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const plexo = usePlexoContext();

  const [{ data: taskData, fetching: isLoadingTask }] = useQuery({
    query: TaskByIdDocument,
    variables: {
      taskId: id,
    },
  });

  useEffect(() => {
    if (!plexo.authCookie) {
      router.push("/login");
    }
  }, [router, plexo.authCookie]);

  return <TaskDetailPageContent task={taskData?.task} isLoading={isLoadingTask} />;
};

TaskPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default TaskPage;
