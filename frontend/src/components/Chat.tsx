'use client'

import { useState, useEffect, useRef } from 'react'
import {
  VStack,
  Box,
  useToast,
  Select,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import ApiKeyModal from './ApiKeyModal'
import { sendChatMessage, checkHealth } from '../lib/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

const AVAILABLE_MODELS = [
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
]

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].value)
  const [apiKey, setApiKey] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key')
    if (storedApiKey) {
      setApiKey(storedApiKey)
    } else {
      onOpen()
    }
  }, [onOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!apiKey) {
      onOpen()
      return
    }

    const userMessage: Message = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const assistantMessage: Message = { role: 'assistant', content: '', isStreaming: true }
      setMessages(prev => [...prev, assistantMessage])

      let accumulatedContent = ''
      await sendChatMessage(
        {
          developer_message: "You are a helpful AI assistant.",
          user_message: content,
          model: selectedModel,
          api_key: apiKey,
        },
        (chunk) => {
          if (chunk && chunk.trim()) {
            accumulatedContent += chunk
            setMessages(prev => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]
              if (lastMessage.role === 'assistant') {
                lastMessage.content = accumulatedContent
              }
              return newMessages
            })
          }
        }
      )

      setMessages(prev => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage.role === 'assistant') {
          lastMessage.isStreaming = false
        }
        return newMessages
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key)
    localStorage.setItem('openai_api_key', key)
    onClose()
  }

  return (
    <Box h="calc(100vh - 200px)" display="flex" flexDirection="column">
      <Box mb={4} display="flex" gap={4}>
        <Select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          maxW="200px"
        >
          {AVAILABLE_MODELS.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </Select>
        <Button onClick={onOpen} size="md">
          {apiKey ? 'Change API Key' : 'Set API Key'}
        </Button>
      </Box>

      <VStack
        flex={1}
        overflowY="auto"
        spacing={4}
        align="stretch"
        mb={4}
        p={4}
        borderRadius="md"
        bg="gray.50"
      >
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </VStack>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

      <ApiKeyModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleApiKeySubmit}
        initialApiKey={apiKey}
      />
    </Box>
  )
} 