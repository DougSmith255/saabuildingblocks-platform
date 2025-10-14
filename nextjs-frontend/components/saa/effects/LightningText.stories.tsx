import type { Meta, StoryObj } from '@storybook/react';
import { LightningText } from './LightningText';

const meta: Meta<typeof LightningText> = {
  title: 'SAA/Effects/LightningText',
  component: LightningText,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'light', value: '#ffffff' }
      ]
    }
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Text to display with lightning effects'
    },
    glassStyle: {
      control: 'select',
      options: ['frosted', 'clear', 'tinted'],
      description: 'Glass effect style'
    },
    lightningIntensity: {
      control: 'select',
      options: ['low', 'medium', 'high'],
      description: 'Lightning strike frequency'
    }
  }
};

export default meta;
type Story = StoryObj<typeof LightningText>;

export const Default: Story = {
  args: {
    text: 'POWER',
    glassStyle: 'frosted',
    lightningIntensity: 'medium'
  }
};

export const HighIntensity: Story = {
  args: {
    text: 'ELECTRIC',
    glassStyle: 'frosted',
    lightningIntensity: 'high'
  }
};

export const LowIntensity: Story = {
  args: {
    text: 'SPARK',
    glassStyle: 'clear',
    lightningIntensity: 'low'
  }
};

export const TintedGlass: Story = {
  args: {
    text: 'ENERGY',
    glassStyle: 'tinted',
    lightningIntensity: 'medium'
  }
};

export const ShortWord: Story = {
  args: {
    text: 'ZAP',
    glassStyle: 'frosted',
    lightningIntensity: 'high'
  }
};

export const LongPhrase: Story = {
  args: {
    text: 'THUNDERSTORM',
    glassStyle: 'frosted',
    lightningIntensity: 'medium'
  }
};
