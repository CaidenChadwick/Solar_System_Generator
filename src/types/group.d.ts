type NewGroupRequest = {
  name: string;
};

type GroupIdParmas = {
  groupId: string;
};

type GroupSystemRequest = {
  groupId: string;
  targetSystemId: string;
};

type GroupUserRequest = {
  groupId: string;
  username: string;
  targetUserId: string;
};
