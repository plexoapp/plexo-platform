import type { ReactElement } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";

import { useData } from "lib/useData";
import Layout from "components/ui/Layout";
import TeamDetailPageContent from "modules/teamDetail";
import { NextPageWithLayout } from "pages/_app";

const TeamPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { teamData, isLoadingTeams } = useData({ teamId: id as string });

  return <TeamDetailPageContent team={teamData?.teamById} isLoading={isLoadingTeams} />;
};

TeamPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default TeamPage;