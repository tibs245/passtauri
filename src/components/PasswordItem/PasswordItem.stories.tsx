// PasswordItem.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react';

import PasswordItem from './index';

const meta: Meta<typeof PasswordItem> = {
    /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
    title: 'PasswordItem',
    component: PasswordItem,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof PasswordItem>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
    args: {
    },
};