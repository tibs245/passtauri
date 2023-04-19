import { InvokeArgs, invoke } from "@tauri-apps/api/tauri"

export type TauriFetcherArgs = {
    command: string,
    args?: InvokeArgs
}

export const TauriFetcher = <T>({ command, args }: TauriFetcherArgs): Promise<T> => {
    return invoke<string>(command, args).then(v => JSON.parse(v))
}