import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatFollowUpSuggestions } from '@/components/chat/ChatFollowUpSuggestions';
import { ChatToolCallIndicator } from '@/components/chat/ChatToolCallIndicator';

describe('ChatMessage', () => {
  it('renders user message with correct styling', () => {
    render(<ChatMessage role="user" content="Hello" />);
    const message = screen.getByText('Hello');
    expect(message).toBeInTheDocument();
    expect(message.closest('.bg-primary')).toBeInTheDocument();
  });

  it('renders assistant message with correct styling', () => {
    render(<ChatMessage role="assistant" content="Hi there" />);
    const message = screen.getByText('Hi there');
    expect(message).toBeInTheDocument();
    expect(message.closest('.bg-muted')).toBeInTheDocument();
  });

  it('shows timestamp when provided', () => {
    const timestamp = new Date('2024-01-15T10:30:00');
    render(<ChatMessage role="user" content="Test" timestamp={timestamp} />);
    expect(screen.getByText(/10:30/)).toBeInTheDocument();
  });

  it('shows streaming cursor when isStreaming is true', () => {
    const { container } = render(
      <ChatMessage role="assistant" content="Typing..." isStreaming />
    );
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});

describe('ChatFollowUpSuggestions', () => {
  it('renders suggestion chips', () => {
    render(
      <ChatFollowUpSuggestions
        suggestions={['Show apartments', 'Filter by price']}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Show apartments')).toBeInTheDocument();
    expect(screen.getByText('Filter by price')).toBeInTheDocument();
  });

  it('calls onSelect when suggestion is clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <ChatFollowUpSuggestions
        suggestions={['Show apartments']}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByText('Show apartments'));
    expect(onSelect).toHaveBeenCalledWith('Show apartments');
  });

  it('renders nothing when suggestions are empty', () => {
    const { container } = render(
      <ChatFollowUpSuggestions suggestions={[]} onSelect={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });
});

describe('ChatToolCallIndicator', () => {
  it('displays tool name with loading spinner', () => {
    const { container } = render(<ChatToolCallIndicator toolName="searchProperties" />);
    expect(screen.getByText('Searching properties...')).toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows raw tool name for unknown tools', () => {
    render(<ChatToolCallIndicator toolName="unknownTool" />);
    expect(screen.getByText('unknownTool...')).toBeInTheDocument();
  });
});
