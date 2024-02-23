import React, { useState, useEffect } from "react";
import { Box, VStack, Textarea, Button, Input, Heading, useToast } from "@chakra-ui/react";
import { FaLock, FaUnlock } from "react-icons/fa";
// Remarkable import removed and replaced with mock function
const md = {
  render: (markdown) => `Markdown rendering of: ${markdown}`,
};

const Index = () => {
  const [notebooks, setNotebooks] = useState({});
  const [currentNotebook, setCurrentNotebook] = useState("");
  const [passwords, setPasswords] = useState({});
  const [unlockPassword, setUnlockPassword] = useState("");
  const [locked, setLocked] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // Load notebooks from localStorage
    const loadedNotebooks = localStorage.getItem("notebooks");
    const loadedPasswords = localStorage.getItem("passwords");
    if (loadedNotebooks) {
      setNotebooks(JSON.parse(loadedNotebooks));
    }
    if (loadedPasswords) {
      setPasswords(JSON.parse(loadedPasswords));
    }
  }, []);

  useEffect(() => {
    // Save notebooks to localStorage on change
    localStorage.setItem("notebooks", JSON.stringify(notebooks));
  }, [notebooks]);

  useEffect(() => {
    // Save passwords to localStorage on change
    localStorage.setItem("passwords", JSON.stringify(passwords));
  }, [passwords]);

  const handleNotebookChange = (content) => {
    setNotebooks({
      ...notebooks,
      [currentNotebook]: content,
    });
  };

  const handleLockNotebook = () => {
    if (passwords[currentNotebook]) {
      setLocked(true);
    } else {
      const newPassword = prompt("Set a password for this notebook:");
      if (newPassword) {
        setPasswords({
          ...passwords,
          [currentNotebook]: newPassword,
        });
        setLocked(true);
      }
    }
  };

  const handleUnlockNotebook = () => {
    if (unlockPassword === passwords[currentNotebook]) {
      setLocked(false);
      setUnlockPassword("");
    } else {
      toast({
        title: "Incorrect password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4}>
      <Heading>Note Taking App</Heading>
      <Button leftIcon={locked ? <FaLock /> : <FaUnlock />} onClick={locked ? handleUnlockNotebook : handleLockNotebook} isDisabled={Object.keys(notebooks).length === 0}>
        {locked ? "Unlock Notebook" : "Lock Notebook"}
      </Button>
      {Object.keys(notebooks).length === 0 ? (
        <Box>Please create a notebook to get started.</Box>
      ) : locked ? (
        <Input placeholder="Enter password to unlock" type="password" value={unlockPassword} onChange={(e) => setUnlockPassword(e.target.value)} />
      ) : (
        <Box w="100%" p={4} borderWidth="1px" borderRadius="md">
          <Textarea placeholder="Type your markdown notes here..." rows={10} value={notebooks[currentNotebook] || ""} onChange={(e) => handleNotebookChange(e.target.value)} />
          <Box
            mt={4}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg="gray.50"
            dangerouslySetInnerHTML={{
              __html: md.render(notebooks[currentNotebook] || ""),
            }}
          />
        </Box>
      )}
    </VStack>
  );
};

export default Index;
