export class User {
  constructor(
    public id: string,
    public name: string,
    public birth: string,
    public createdAt: string,
    public updatedAt: string,
    public bio?: string,
    public imageUrl?: string
  ){}
}
