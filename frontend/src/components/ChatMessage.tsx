'use client'

import { Box, Text, useColorModeValue } from '@chakra-ui/react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const bgColor = useColorModeValue(
    message.role === 'user' ? 'blue.50' : 'gray.50',
    message.role === 'user' ? 'blue.900' : 'gray.700'
  )
  const borderColor = useColorModeValue(
    message.role === 'user' ? 'blue.200' : 'gray.200',
    message.role === 'user' ? 'blue.700' : 'gray.600'
  )

  return (
    <Box
      alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
      maxW="80%"
      bg={bgColor}
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Text
        whiteSpace="pre-wrap"
        wordBreak="break-word"
      >
        {message.content}
        {message.isStreaming && (
          <Text as="span" opacity={0.5}>
            ▋
          </Text>
        )}
      </Text>
    </Box>
  )
} 