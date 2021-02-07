export class User {
  constructor(
    public _id: string,
    public email: string,
    public password: string,
    public nick: string,
    public name: string,
    public image: string,
    public banner: string,
    public biography: string,
    public role: string
  ) {
  }
}
