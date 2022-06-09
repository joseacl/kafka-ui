import React from 'react';
import { render, WithRoute } from 'lib/testHelpers';
import { screen } from '@testing-library/react';
import Topic from 'components/Topics/Topic/Topic';
import {
  clusterTopicPath,
  clusterTopicEditPath,
  clusterTopicSendMessagePath,
  getNonExactPath,
} from 'lib/paths';

const topicText = {
  edit: 'Edit Container',
  send: 'Send Message',
  detail: 'Details Container',
  loading: 'Loading',
};

vi.mock('components/Topics/Topic/Edit/EditContainer', () => ({
  default: () => <div>{topicText.edit}</div>,
}));
vi.mock('components/Topics/Topic/SendMessage/SendMessage', () => ({
  default: () => <div>{topicText.send}</div>,
}));
vi.mock('components/Topics/Topic/Details/DetailsContainer', () => ({
  default: () => <div>{topicText.detail}</div>,
}));
vi.mock('components/common/PageLoader/PageLoader', () => ({
  default: () => <div>{topicText.loading}</div>,
}));

describe('Topic Component', () => {
  const resetTopicMessages = vi.fn();
  const fetchTopicDetailsMock = vi.fn();

  const renderComponent = (pathname: string, topicFetching: boolean) =>
    render(
      <WithRoute path={getNonExactPath(clusterTopicPath())}>
        <Topic
          isTopicFetching={topicFetching}
          resetTopicMessages={resetTopicMessages}
          fetchTopicDetails={fetchTopicDetailsMock}
        />
      </WithRoute>,
      { initialEntries: [pathname] }
    );

  afterEach(() => {
    resetTopicMessages.mockClear();
    fetchTopicDetailsMock.mockClear();
  });

  it('renders Edit page', () => {
    renderComponent(clusterTopicEditPath('local', 'myTopicName'), false);
    expect(screen.getByText(topicText.edit)).toBeInTheDocument();
  });

  it('renders Send Message page', () => {
    renderComponent(clusterTopicSendMessagePath('local', 'myTopicName'), false);
    expect(screen.getByText(topicText.send)).toBeInTheDocument();
  });

  it('renders Details Container page', () => {
    renderComponent(clusterTopicPath('local', 'myTopicName'), false);
    expect(screen.getByText(topicText.detail)).toBeInTheDocument();
  });

  it('renders Page loader', () => {
    renderComponent(clusterTopicPath('local', 'myTopicName'), true);
    expect(screen.getByText(topicText.loading)).toBeInTheDocument();
  });

  it('fetches topicDetails', () => {
    renderComponent(clusterTopicPath('local', 'myTopicName'), false);
    expect(fetchTopicDetailsMock).toHaveBeenCalledTimes(1);
  });

  it('resets topic messages after unmount', () => {
    const component = renderComponent(
      clusterTopicPath('local', 'myTopicName'),
      false
    );
    component.unmount();
    expect(resetTopicMessages).toHaveBeenCalledTimes(1);
  });
});
