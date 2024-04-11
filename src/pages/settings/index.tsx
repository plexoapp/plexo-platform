import { useEffect, type ReactElement } from "react";

import Layout from "components/ui/Layout";
import { SettingsPageContent } from "modules/settings";
import { NextPageWithLayout } from "pages/_app";
import { usePlexoContext } from "context/PlexoContext";
import { useRouter } from "next/router";

const SettingsPage: NextPageWithLayout = () => {
  const plexo = usePlexoContext();
  const router = useRouter();

  useEffect(() => {
    if (!plexo.authCookie) {
      router.push("/login");
    }
  }, [router, plexo.authCookie]);

  return <SettingsPageContent />;
};

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageTitle="Settings">{page}</Layout>;
};

export default SettingsPage;
