// PasswordItem.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react';

import FolderItem from './index';

const meta: Meta<typeof FolderItem> = {
    /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
    title: 'FolderItem',
    component: FolderItem,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FolderItem>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
    args: {
        children: "My Folder",
        folder: {
            filename: "My Folder",
            path: "/myPath/My Folder",
            filetype: "DIRECTORY",
            lastModified: "None",
            encryptKeysId: ["AABBCC"],
        }
    },
};