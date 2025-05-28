'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'

interface ApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (apiKey: string) => void
  initialApiKey: string
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  onSubmit,
  initialApiKey,
}: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState(initialApiKey)
  const toast = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    onSubmit(apiKey.trim())
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>OpenAI API Key</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>API Key</FormLabel>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Save API Key
              </Button>
            </VStack>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  )
} 