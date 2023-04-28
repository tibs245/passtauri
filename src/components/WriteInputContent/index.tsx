import { CircularProgress, CircularProgressLabel, Icon, InputRightElement } from "@chakra-ui/react";
import { readText, writeText } from "@tauri-apps/api/clipboard";
import { useState } from "react";
import { FiClipboard } from "react-icons/fi";

const SECOND_DURING_CONTENT_COPIED = 30;

type WriteInputContentProps = {
    content: string;
}

export default function WriteInputContent({ content }: WriteInputContentProps) {
    const [secondBeforeReset, setSecondBeforeReset] = useState<number>(0)
    const [oldTextClipboard, setOldTextClipboard] = useState<string | null>(null)

    const handleClipboardClick = async () => {
        setOldTextClipboard(await readText())
        await writeText(content);
        setSecondBeforeReset(30); // Pour l'affichage
        let secondBeforeResetIntern = 30; // Pour la fonction
        console.log({ secondBeforeReset })

        let resetInterval = setInterval(() => {
            setSecondBeforeReset(secondBeforeResetIntern - 1);
            secondBeforeResetIntern = secondBeforeResetIntern - 1
        }, 1000)

        setTimeout(() => {
            writeText(oldTextClipboard || '');
            setOldTextClipboard(null);
            if (resetInterval) {
                clearInterval(resetInterval)
            }
            setSecondBeforeReset(0);
        }, SECOND_DURING_CONTENT_COPIED * 1000)

    }

    return <InputRightElement>
        {secondBeforeReset !== 0 ?
            <CircularProgress value={secondBeforeReset} min={0} max={SECOND_DURING_CONTENT_COPIED} color='blue.400' size="1.5em">
                <CircularProgressLabel>{secondBeforeReset}</CircularProgressLabel>
            </CircularProgress>
            :
            <Icon as={FiClipboard} color='gray.500' onClick={handleClipboardClick} cursor="pointer" />}
    </InputRightElement>
}