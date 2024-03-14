import { useEffect, type ReactElement } from "react";
import { useRouter } from "next/router";
import { useQuery } from "urql";

import Layout from "components/ui/Layout";
import ProjectDetailContent from "modules/projectDetail";
import { NextPageWithLayout } from "pages/_app";
import { usePlexoContext } from "context/PlexoContext";
import { ProjectByIdDocument } from "integration/graphql";

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const [{ data: projectData, fetching: isLoadingProject }] = useQuery({
    query: ProjectByIdDocument,
    variables: {
      projectId: id,
    },
  });

  const plexo = usePlexoContext();

  useEffect(() => {
    if (!plexo.authCookie) {
      router.push("/login");
    }
  }, [router, plexo.authCookie]);

  return <ProjectDetailContent project={projectData?.project} isLoading={isLoadingProject} />;
};

ProjectPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProjectPage;
