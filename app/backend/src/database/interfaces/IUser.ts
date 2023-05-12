interface IUser {
  id: number;
  username:string;
  role: string;
  email:string;
  password:string;
}

type IUserWithoutPassword = Omit<IUser, 'password'>;

export { IUserWithoutPassword };
export default IUser;
