type Comment = Timestamp & {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  status: Status;
};
