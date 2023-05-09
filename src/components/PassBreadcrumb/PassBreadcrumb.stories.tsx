// PasswordItem.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react';

import PassBreadcrumb from './index';

const meta: Meta<typeof PassBreadcrumb> = {
    /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
    title: 'PassBreadcrumb',
    component: PassBreadcrumb,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof PassBreadcrumb>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
    args: {
        path: ["My first folder", "a second", "a third", "the last"],
        onClickFolder: (result) => console.log(result)
    },
};