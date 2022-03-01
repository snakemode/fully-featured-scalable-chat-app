import { CosmosDbMetadataRepository } from "../dataaccess/CosmosDbMetadataRepository";
import { JwtGenerator } from "../JwtGenerator";
import { User } from "../metadata/User";
import { Role } from "../metadata/Role";
import { RoleService } from "./RoleService";
import { UserProfileSelection } from "./features/UserProfileSelection";

export type LoginMetadata = {
  username: string;
  firstName: string;
  lastName: string;
};

export type UserCreationRequest = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  oauthSub?: string;
  oauthPicture?: string;
};

type TokenAndMetadata = { token: string; userDetails: LoginMetadata; };

export class UserService {
  private _repo: CosmosDbMetadataRepository;
  private _jwtValidator: JwtGenerator;

  public constructor() {
    this._repo = new CosmosDbMetadataRepository();
    this._jwtValidator = JwtGenerator.fromEnvironment();
  }

  public async getUserByUsername(username: string): Promise<{ exists: boolean; user?: User }> {
    const existing = await this._repo.getByProperty<User>("User", "username", username);

    if (existing.length > 0) {
      const asUserType = Object.assign(new User(), existing[0]);
      return { exists: true, user: asUserType };
    }

    return { exists: false, user: undefined };
  }

  public async getUserByOAuthSubscription(sub: string): Promise<{ exists: boolean; user?: User }> {
    const existing = await this._repo.getByProperty<User>("User", "oauthSub", sub);

    if (existing.length > 0) {
      const asUserType = Object.assign(new User(), existing[0]);
      return { exists: true, user: asUserType };
    }

    return { exists: false, user: undefined };
  }

  public async getRoleByUsername(username: string): Promise<{ exists: boolean; role?: Role }> {
    const { exists, user } = await this.getUserByUsername(username);
    if (!exists) {
      return { exists: false, role: undefined };
    }

    const roleService = new RoleService();
    const result = await roleService.getRoleByName(user.roleName);

    const { exists: roleExists, role } = result;

    if (!roleExists) {
      return { exists: false, role: undefined };
    }

    return { exists: true, role: role };
  }

  public async getUserById(id: string): Promise<{ exists: boolean; user?: User }> {
    const existing = await this._repo.getByProperty<User>("User", "id", id);

    if (existing.length > 0) {
      const asUserType = Object.assign(new User(), existing[0]);
      return { exists: true, user: asUserType };
    }
    return { exists: false, user: undefined };
  }

  public async createUser(request: UserCreationRequest): Promise<User> {
    const profilePicker = new UserProfileSelection();

    const { small, large } = profilePicker.assignProfileImages(request.email, request.oauthPicture);

    const requestWithProfileImg = {
      ...request,
      profileImgSmallUrl: small,
      profileImgLargeUrl: large,
      roleName: "normal"
    };

    const user = User.fromJSON(requestWithProfileImg);
    await this._repo.saveOrUpdate<User>(user);
    return user;
  }

  public generateLoginMetadataFor(user: User): TokenAndMetadata {
    const token = this._jwtValidator.generate(user.id, user.roleName);
    const userDetails = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImgSmallUrl: user.profileImgSmallUrl,
      profileImgLargeUrl: user.profileImgLargeUrl
    };
    return { token, userDetails };
  }

}

