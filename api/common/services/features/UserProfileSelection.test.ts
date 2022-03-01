import { UserProfileSelection } from "./UserProfileSelection";

describe("UserProfileSelection", () => {
  let sut: UserProfileSelection;
  beforeEach(() => {
    sut = new UserProfileSelection();
  });

  it("Can get a google based profile image url.", async () => {
    const email = "foo@bar.com";
    const oauthPicture = "https://lh3.googleusercontent.com/a-/ADh14GguMNzvfLXJIbvlIdYVq-p2H4KIrFojBg2p6897=s90-c";

    const { small, large } = sut.assignProfileImages(email, oauthPicture);

    expect(small).toBe("https://lh3.googleusercontent.com/a-/ADh14GguMNzvfLXJIbvlIdYVq-p2H4KIrFojBg2p6897=s80");
  });

  it("Can get a gravatar based profile image url that contains a default image link.", async () => {
    process.env.WEB_ROOT = "http://localhost:8080";

    const { small, large } = sut.assignProfileImages("foo@bar.com", "");

    expect(large).toContain("https://www.gravatar.com/avatar/f3ada405ce890b6f8204094deb12d8a8");
    expect(large).toContain("?d=http%3A%2F%2Flocalhost%3A8080%2Fimages%2Fdefault-profile-images%2F");
    expect(large).toContain("&s=600");
  });
});
