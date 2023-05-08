import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import theme from '@/theme';
import Head from 'next/head'
import { Box, Heading, Flex, Stack, Button, Icon, Spacer } from '@chakra-ui/react'
import PasswordList from '@/components/PasswordList'
import PassBreadcrumb from '@/components/PassBreadcrumb';
import SearchBar from '@/components/SearchBar';
import SearchResult from '@/components/SearchResult';
import { FiFilePlus, FiFolderPlus, FiSettings, FiShield } from 'react-icons/fi';
import { useState } from 'react';
import Link from 'next/link';

export default function App({ Component, pageProps }: AppProps) {
  const [path, setPath] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");

  const goBackToFolder = (folder: string) => {
    if (folder === "ROOT") {
      setPath([]);
    }
  }

  const goToFolder = (folder: string) => {
    setPath(folder.split('/'))
    setSearch("")
  }

  return <ChakraProvider theme={theme}>
    <Head>
      <title>Passtauri</title>
      <meta name="description" content="Parcourir les mots de passes" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main style={{ height: "100vh" }}>
      <Flex as="header" bgColor="gray.200" height="5em" alignItems="center" padding={9}>
        <Stack>
          <Link href="/">
            <Heading as="h1" fontSize="2xl">
              <Icon as={FiShield} color="brand.800" fill="brand.800" fontSize="3xl" verticalAlign="text-bottom" mr={2} />
              PassTauri
            </Heading>
          </Link>
          <PassBreadcrumb path={path} onClickFolder={goBackToFolder} />
        </Stack>
        <Spacer />
        <Icon as={FiSettings} fontSize="2xl" />
      </Flex>
      <Flex minHeight="calc(100vh - 5em)">
        <Box overflowY="scroll" maxHeight="calc(100vh - 5em)" minWidth="20em" maxWidth="20vw" borderRightColor="gray.200" borderRightWidth="1px">
          <Flex>
            <Button colorScheme='blue' leftIcon={<Icon as={FiFolderPlus} />} isDisabled flex="1" rounded={0}>Add Folder</Button>
            <Button as={Link} colorScheme='green' leftIcon={<Icon as={FiFilePlus} />} flex="1" href={`/password/create/${path.join('/')}`} rounded={0}>Add Password</Button>
          </Flex>
          <SearchBar onSearch={setSearch} />
          {search === "" ?
            <PasswordList path={path} onClickFolder={goToFolder} />
            :
            <SearchResult searchWord={search} path={path} onClickFolder={goToFolder} />
          }
        </Box>
        <Box flex="1" padding={5}>
          <Component {...pageProps} />
        </Box>
      </Flex>
    </main >
  </ChakraProvider>
}
