import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { User } from '../entities/User';

// ['1-sa34-21sd', '2-sa34-21sd', ...]
// [{id: '1-sa34-21sd', username: 'tim'}, {}, ...]
export const createUserLoader = () =>
  new DataLoader<string, User>(async (userIds) => {
    const users = await User.findBy({ id: In([userIds]) });
    const userIdToUser: Record<string, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    const sortedUsers = userIds.map((userId) => userIdToUser[userId]);
    return sortedUsers;
  });
