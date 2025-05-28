'use client'

import { useState, KeyboardEvent } from 'react'
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Box,
} from '@chakra-ui/react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Box>
      <InputGroup size="md">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          pr="4.5rem"
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={handleSend}
            isLoading={isLoading}
            disabled={!message.trim() || isLoading}
          >
            Send
          </Button>
        </InputRightElement>
      </InputGroup>
    </Box>
  )
} 