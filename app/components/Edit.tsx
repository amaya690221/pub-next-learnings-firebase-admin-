// /app/components/Edit.tsx

"use client";

import React, { useRef, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { StudyData } from "../utils/studyData";

type Props = {
  learning: StudyData;
  loading: boolean;
  updateDb: (data: StudyData) => void;
};

const Edit: React.FC<Props> = ({ learning, updateDb, loading }) => {
  const [updateLearning, setUpdateLearning] = useState(learning);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const toast = useToast();

  //input変更時の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateLearning({
      ...updateLearning,
      [name]: name === "time" ? Number(value) : value,
    });
  };

  //更新ボタンクリック時の処理
  const handleUpdate = async () => {
    await updateDb(updateLearning);
    if (!loading) {
      onClose();
    }
  };

  return (
    <>
      {/*モーダル開閉ボタン*/}
      <Button variant="ghost" onClick={onOpen}>
        <FiEdit color="black" />
      </Button>

      {/*モーダル本体 */}
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>記録編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>学習内容</FormLabel>
              <Input
                ref={initialRef}
                placeholder="学習内容"
                name="title"
                value={updateLearning.title}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>学習時間</FormLabel>
              <Input
                type="number"
                placeholder="学習時間"
                name="time"
                value={updateLearning.time}
                onChange={handleInputChange}
              />
            </FormControl>
            <div>入力されている学習内容：{updateLearning.title}</div>
            <div>入力されている学習時間：{updateLearning.time}</div>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              loadingText="Loading"
              spinnerPlacement="start"
              colorScheme="green"
              mr={3}
              onClick={() => {
                if (updateLearning.title !== "" && updateLearning.time > 0) {
                  handleUpdate();
                } else {
                  toast({
                    title: "学習内容と時間を入力してください",
                    position: "top",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                  });
                }
              }}
            >
              データを更新
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Edit;
