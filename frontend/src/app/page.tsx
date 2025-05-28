'use client'

import dynamic from 'next/dynamic'
import { Box, Container, Heading, VStack } from '@chakra-ui/react'

// Dynamically import the Chat component with no SSR
const Chat = dynamic(() => import('../components/Chat'), {
  ssr: false
})

export default function HomePage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          AI Engineer Challenge
        </Heading>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          bg="white"
          boxShadow="sm"
        >
          <Chat />
        </Box>
      </VStack>
    </Container>
  )
} 