import {
  Alert,
  Button,
  Center,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { AlertCircle, BrandGithub } from "tabler-icons-react";
import { useRouter } from "next/router";

import PlexoLogo from "components/resources/PlexoLogo";
import { useForm } from "@mantine/form";
import { loginWithEmail } from "lib/auth";
import { useEffect, useState } from "react";
import { usePlexoContext } from "context/PlexoContext";
// import { InferGetServerSidePropsType } from "next";

type AuthResponse = {
  error: boolean;
  message: any;
};

// {
//   plexoAPIEndpoint,
// }: InferGetServerSidePropsType<typeof getServerSideProps>

const LoginPage = () => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const router = useRouter();

  const plexo = usePlexoContext();

  const [authResponse, setAuthResponse] = useState<AuthResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plexo.authCookie) {
      router.replace("/", undefined, { shallow: true });
    }
  }, [router, plexo.authCookie]);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: val => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: val => (val.length < 5 ? "Password should include at least 5 characters" : null),
    },
  });

  const loginEmailEndpoint = `${plexo.plexoAPIEndpoint}/auth/email/login`;
  const loginGithubEndpoint = `${plexo.plexoAPIEndpoint}/auth/github`;

  const onLogin = async (values: typeof form.values) => {
    setLoading(true);
    setAuthResponse(undefined);

    const response = await loginWithEmail(loginEmailEndpoint, {
      email: values.email,
      password: values.password,
    });

    setLoading(false);
    setAuthResponse(response);

    //Login successful
    if (response && !response.error) {
      plexo.setAuthCookie(response.message.access_token);
    }
  };

  return (
    <Center style={{ height: "100vh" }}>
      <Stack w={420} miw={200} align={"center"} m={20}>
        <PlexoLogo typographyColor={colorScheme === "light" ? theme.colors.gray[9] : undefined} />
        <Paper w={"100%"} radius="md" p="xl" withBorder>
          <Stack>
            <form onSubmit={form.onSubmit(onLogin)}>
              <Stack>
                <TextInput
                  withAsterisk
                  label="Email"
                  placeholder="hello@plexo.app"
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  withAsterisk
                  label="Password"
                  placeholder="Your password"
                  {...form.getInputProps("password")}
                />
                <Button type="submit" loading={loading}>
                  Login
                </Button>
                {authResponse && authResponse.error && (
                  <Alert
                    color="red"
                    icon={<AlertCircle size={18} />}
                    styles={{
                      message: {
                        color: "red",
                      },
                    }}
                  >
                    {authResponse.message}
                  </Alert>
                )}
              </Stack>
            </form>

            <Divider label="Or, continue with" labelPosition="center" />

            <Button
              disabled
              component="a"
              href={loginGithubEndpoint}
              leftIcon={<BrandGithub />}
              color="dark"
            >
              Login with Github
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Center>
  );
};

// export const getServerSideProps = async () => {
//   console.log("getServerSideProps");
//   console.log(process.env.PLEXO_API_ENDPOINT);

//   return {
//     props: {
//       plexoAPIEndpoint: process.env.PLEXO_API_ENDPOINT,
//     },
//   };
// };

export default LoginPage;
