// /app/user/updatepass/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
} from "@chakra-ui/react";
import { RiLockPasswordFill } from "react-icons/ri";
import {
  User,
} from "firebase/auth";
import { auth } from "@/app/utils/firebase";
import { getToken } from "@/app/utils/getToken";

const UpdatePass = () => {
  const [formState, setFormState] = useState({
    password: "",
    passwordConf: "",
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const toast = useToast();
  const [token, setToken] = useState(""); 

  useEffect(() => {
    const authUser = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      const currentToken = await getToken(); 
      setToken(currentToken);
    });
    return () => {
      authUser();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.password !== formState.passwordConf) {
      toast({
        title: "パスワードが一致しません",
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (formState.password.length < 6) {
      toast({
        title: "パスワードは6文字以上にしてください",
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);

      const password = formState.password;
      const response = await fetch("/api/user/updatePass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unknown error");
      }
      console.log("User Signuped:", result);

      toast({
        title: "パスワード更新が完了しました。",
        position: "top",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      router.push("/");
    } catch (error: unknown) {
      toast({
        title: "パスワード更新に失敗しました",
        description: `${error}`,
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Flex justifyContent="center" boxSize="fit-content" mx="auto" p={5}>
        <Card size={{ base: "sm", md: "lg" }} p={4}>
          <Heading size="md" textAlign="center">
            パスワード更新
          </Heading>
          <CardBody>
            <form onSubmit={handleUpdatePassword}>
              {/* 　削除
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <RiLockPasswordFill color="gray" />
                </InputLeftElement>
                <Input
                  type="password"
                  placeholder="現在のパスワードを入力"
                  name="currentPassword"
                  value={formState.currentPassword}
                  required
                  mb={2}
                  onChange={handleInputChange}
                />
              </InputGroup> */}
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <RiLockPasswordFill color="gray" />
                </InputLeftElement>
                <Input
                  type="password"
                  placeholder="新パスワードを入力"
                  name="password"
                  value={formState.password}
                  required
                  mb={2}
                  onChange={handleInputChange}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <RiLockPasswordFill color="gray" />
                </InputLeftElement>
                <Input
                  type="password"
                  placeholder="新パスワードを入力(確認)"
                  name="passwordConf"
                  value={formState.passwordConf}
                  required
                  mb={2}
                  onChange={handleInputChange}
                />
              </InputGroup>
              <Box mt={4} mb={2} textAlign="center">
                <Button
                  isLoading={loading}
                  loadingText="Loading"
                  spinnerPlacement="start"
                  type="submit"
                  colorScheme="green"
                >
                  パスワードを更新する
                </Button>
                <Button
                  colorScheme="gray"
                  onClick={() => router.push("/")}
                  mx={2}
                >
                  戻る
                </Button>
              </Box>
            </form>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};
export default UpdatePass;
