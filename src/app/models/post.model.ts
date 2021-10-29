export class Post {
  constructor(
    public id: number,
    public userId: string,
    public groupId: number,
    public text: string,
    public createdAt: string,
    public updatedAt: string,
    public imageId?: number
  ){}
}
