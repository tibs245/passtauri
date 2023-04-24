import { Input } from "@chakra-ui/react";
import { useState } from "react";


type SearchBarProps = {
    onSearch: (value: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [lastChange, setLastChange] = useState<null | NodeJS.Timer>();

    const handleChangeSearchValue = (newValue: string) => {
        if (lastChange) {
            clearTimeout(lastChange);
        }

        setLastChange(setTimeout(() => {
            onSearch(newValue)
        }))
    }

    return <Input placeholder="Search .." onChange={(e) => handleChangeSearchValue(e.target.value)}>
    </Input>
}
