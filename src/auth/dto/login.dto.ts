export class LoginInput {
  constructor(
    private readonly _email: string,
    private readonly _password: string,
  ) {}

  public get email() {
    return this._email;
  }
  public get password() {
    return this._password;
  }
}
