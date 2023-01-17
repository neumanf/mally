import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useLoginMutation } from "@/hooks/mutations/useLoginMutation";
import { useRouter } from "next/router";
import { ApiError } from "@/api/request";
import { showNotification } from "@mantine/notifications";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const login = useLoginMutation();

  const handleLogin = () => {
    login.mutate(
      { username: email, password: password },
      {
        onSuccess: async () => {
          await router.push("/");
        },
        onError: (error) => {
          const message =
            error instanceof ApiError && error.statusCode === 401
              ? "Invalid credentials."
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

  return (
    <Container size={420} my={100}>
      <Title
        align="center"
        sx={(theme) => ({
          fontWeight: 900,
        })}
      >
        Log In
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor<"a"> href="/signup" size="sm">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
        <Group position="apart" mt="lg">
          <Checkbox label="Remember me" sx={{ lineHeight: 1 }} />
          <Anchor<"a">
            onClick={(event) => event.preventDefault()}
            href="#"
            size="sm"
          >
            Forgot password?
          </Anchor>
        </Group>
        <Button
          onClick={handleLogin}
          loading={login.isLoading}
          fullWidth
          mt="xl"
        >
          Log In
        </Button>
      </Paper>
    </Container>
  );
}
