import Head from 'next/head'
import { Box, Heading, Flex, Stack } from '@chakra-ui/react'
import PasswordList from '@/components/PasswordList'
import { useState } from 'react'
import PassBreadcrumb from '@/components/PassBreadcrumb';
import NoSelectedPassword from '@/components/NoSelectedPassword';
import PasswordDetails from '@/components/PasswordDetails';
import { FileDto } from '@/types/file';
import SearchBar from '@/components/SearchBar';
import SearchResult from '@/components/searchResult';
import PasswordForm from '@/components/PasswordForm';

export default function Home() {
  const [path, setPath] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [passwordSelectionned, setPasswordSelectionned] = useState<FileDto | undefined>();
  const [isModeEdition, setIsModeEdition] = useState(false);

  const addFolderToPath = (newFolder: string) => setPath([...path, newFolder])

  const goBackToFolder = (folder: string) => {
    if (folder === "ROOT") {
      setPath([]);
    }

    const indexPath = path.indexOf(folder);
    setPath(path.slice(0, indexPath + 1))
  }

  const goToFolder = (folder: string) => {
    setPath(folder.split('/'))
    setSearch("")
  }

  const handleClickPassword = (passwordFile: FileDto) => {
    setIsModeEdition(false);
    setPasswordSelectionned(passwordFile);
  }

  const handleUpdatePassword = (newName: string) => {
    setIsModeEdition(false);
    setPasswordSelectionned({
      ...(passwordSelectionned ?? { filetype: "FILE", lastModified: "TODO anticipate problem" }),
      filename: newName + '.gpg',
      path: passwordSelectionned?.path.replace(passwordSelectionned.filename, newName + '.gpg') ?? ''
    });
  }


  return (
    <>
      <Head>
        <title>Passtauri</title>
        <meta name="description" content="Parcourir les mots de passes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ height: "100vh" }}>
        <Flex as="header" bgColor="gray.200" height="5em" alignItems="center" padding={9}>
          <Stack>
            <Heading as="h1" fontSize="2xl">PassTauri</Heading>

            <PassBreadcrumb path={path} onClickFolder={goBackToFolder} />
          </Stack>
        </Flex>
        <Flex minHeight="calc(100vh - 5em)">
          <Box overflowY="scroll" maxHeight="calc(100vh - 5em)" minWidth="20em" maxWidth="20vw" borderRightColor="grau.400" borderRightWidth="1px">
            <SearchBar onSearch={setSearch} />
            {search === "" ?
              <PasswordList path={path} onClickFolder={addFolderToPath} onClickPassword={handleClickPassword} />
              :
              <SearchResult searchWord={search} path={path} onClickFolder={goToFolder} onClickPassword={handleClickPassword} />
            }
          </Box>
          <Box flex="1" padding={5}>
            {passwordSelectionned ?
              isModeEdition ?
                <PasswordForm passwordFile={passwordSelectionned} onDeletePassword={() => setPasswordSelectionned(undefined)} onUpdatePassword={handleUpdatePassword} onCancel={() => setIsModeEdition(false)} />
                :
                <PasswordDetails passwordFile={passwordSelectionned} onEditAsked={() => setIsModeEdition(true)} onDeletePassword={() => setPasswordSelectionned(undefined)} />
              :
              <NoSelectedPassword />}
          </Box>
        </Flex>
      </main >
    </>
  )
}
