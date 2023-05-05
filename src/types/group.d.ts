type NewGroupRequest = {
  name: string;
};

type GroupIdParams = {
  groupId: string;
};

type GroupSystemRequest = {
  groupId: string;
  targetSystemId: string;
  name: string;
};

type GroupUserRequest = {
  groupId: string;
  username: string;
  targetUserId: string;
};
