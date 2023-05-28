import React, { useEffect, useState } from "react";
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from "@mantine/core";
import { useRouter } from "next/router";

import { ApiError } from "@/api/request";
import { showNotification } from "@mantine/notifications";
import { useSignUpMutation } from "@/hooks/mutations/useSignUpMutation";
import { GetServerSidePropsContext } from "next";
import { changePageTitle } from "@/utils";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const signUp = useSignUpMutation();

  const handleSignUp = () => {
    signUp.mutate(
      { name: name, email: email, password: password },
      {
        onSuccess: async () => {
          await router.push("/login");
        },
        onError: (error) => {
          const message =
            error instanceof ApiError && error.statusCode === 400
              ? error.message
              : "An unexpected error occurred.";

          showNotification({
            title: "Something went wrong.",
            message: message,
            color: "red",
          });
        },
      }
    );
  };

  useEffect(() => {
    changePageTitle("Sign Up - Mally");
  }, []);

  return (
    <Container size={420} my={100}>
      <Title
        align="center"
        sx={() => ({
          fontWeight: 900,
        })}
      >
        Sign Up
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Anchor<"a"> href="/login" size="sm">
          Log In
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextInput
          label="Email"
          placeholder="your-email@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          mt="md"
        />
        <Button
          onClick={handleSignUp}
          loading={signUp.isLoading}
          fullWidth
          mt="xl"
        >
          Sign Up
        </Button>
      </Paper>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (context.req.cookies.accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
}
