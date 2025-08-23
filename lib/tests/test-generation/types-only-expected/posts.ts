type Post = Timestamp & {
  id: number;
  title: string;
  content: string;
  authorId: number;
  status: Status;
  tags?: Array<string> | undefined;
};
type CreatePostRequest = {
  title: string;
  content: string;
  tags?: Array<string> | undefined;
};
