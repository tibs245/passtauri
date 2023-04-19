import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Container, Stack, StackDivider, Text } from '@chakra-ui/react'
import { useListPassword } from '@/hooks/password'
import FolderItem from '@/components/FolderItem'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: listPassword, isLoading, error } = useListPassword();
  console.log({ listPassword, isLoading })

  return (
    <>
      <Head>
        <title>Passtauri</title>
        <meta name="description" content="Parcourir les mots de passes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container>
          <Text as="h1" fontSize="6xl">PassTauri</Text>
          {error}
          <Stack
            spacing={0}
            divider={<StackDivider borderColor='gray.200' />}>
            {listPassword?.map(password => <FolderItem key={password}
              _hover={{ backgroundColor: 'gray.100' }}>{password}</FolderItem>)}
          </Stack>
        </Container>
      </main>
    </>
  )
}
