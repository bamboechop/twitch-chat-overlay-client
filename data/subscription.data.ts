import { ISubscription } from "../src/common/interfaces/index.interface";

export const subscriptionDummy: ISubscription = {
  color: '#ffac12',
  displayName: 'SubscriptionDummy',
  emotes: {
    305054953: ['31-43'],
    emotesv2_097331d1b466434da9a5a59ec13a2a9b: ['45-56'],
  },
  id: 'abc-subscription-dummy-123',
  msgId: 'sub',
  msgType: 'subscription',
  plan: 1,
  show: true,
  timestamp: Date.now(),
  userId: 'subscriptiondummyuser',
  userImage: 'https://placekitten.com/35/35',
  userName: 'subscriptiondummyuser',
  viewerCount: 2,
};
