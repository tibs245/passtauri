// File to mock default SWR response for components
import { unstable_serialize } from "swr";

export const fallback = { [unstable_serialize({ _key: "get_all_keys", command: 'get_all_keys', args: {} })]: [{ fingerprint: "AABBCC", canSign: true }] }