import { TauriFetcher } from "@/hooks/config";
import { Key } from "@/types/key";
import { TauriError } from "@/types/tauriError";
import useSWR from "swr";

export const useKeys = (options = {}) => useSWR<Key[], TauriError>(
    { _key: "get_all_keys", command: 'get_all_keys', args: {} },
    TauriFetcher,
    options
)
