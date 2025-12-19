export class CreateUserDto {
  constructor(
    private _username: string,
    private _email: string,
    private _password: string,
  ) {}

  public get username() {
    return this._username;
  }

  public get email() {
    return this._email;
  }
  public get password() {
    return this._password;
  }

  public set password(newPassword: string) {
    this._password = newPassword;
  }
}
