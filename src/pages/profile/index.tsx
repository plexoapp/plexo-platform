import { useEffect, type ReactElement } from "react";

import Layout from "components/ui/Layout";
import { NextPageWithLayout } from "pages/_app";
import { usePlexoContext } from "context/PlexoContext";
import { useRouter } from "next/router";
import { ProfilePageContent } from "modules/profile";

const ProfilePage: NextPageWithLayout = () => {
  const plexo = usePlexoContext();
  const router = useRouter();

  useEffect(() => {
    if (!plexo.authCookie) {
      router.push("/login");
    }
  }, [router, plexo.authCookie]);

  return <ProfilePageContent />;
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageTitle="Profile">{page}</Layout>;
};

export default ProfilePage;
