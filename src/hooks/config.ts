import { InvokeArgs, invoke } from "@tauri-apps/api/tauri"

export type TauriFetcherArgs = {
    command: string,
    args?: InvokeArgs
}

export const TauriFetcher = <T>({ command, args }: TauriFetcherArgs, argsMutation: InvokeArgs = {}): Promise<T> => {

    console.log({ invoke: command, args, argsMutation: argsMutation?.arg })
    const argMut = argsMutation?.arg as Object
    return invoke<string>(command, { ...args, ...argMut }).then(v => JSON.parse(v))
}