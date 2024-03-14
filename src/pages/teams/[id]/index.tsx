import { useEffect, type ReactElement } from "react";
import { useRouter } from "next/router";
import { useQuery } from "urql";

import Layout from "components/ui/Layout";
import TeamDetailPageContent from "modules/teamDetail";
import { NextPageWithLayout } from "pages/_app";
import { usePlexoContext } from "context/PlexoContext";
import { TeamByIdDocument } from "integration/graphql";

const TeamPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const [{ data: teamData, fetching: isLoadingTeam }] = useQuery({
    query: TeamByIdDocument,
    variables: {
      teamId: id,
    },
  });

  const plexo = usePlexoContext();

  useEffect(() => {
    if (!plexo.authCookie) {
      router.push("/login");
    }
  }, [router, plexo.authCookie]);

  return <TeamDetailPageContent team={teamData?.team} isLoading={isLoadingTeam} />;
};

TeamPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default TeamPage;
