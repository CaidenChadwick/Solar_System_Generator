type NewGroupRequest = {
  name: string;
};

type GroupIdParams = {
  groupId: string;
};

type GroupSystemRequest = {
  groupId: string;
  targetSystemId: string;
};

type GroupUserRequest = {
  groupId: string;
  targetUserId: string;
};
