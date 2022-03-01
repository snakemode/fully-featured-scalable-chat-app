import * as md5 from "md5";

export class UserProfileSelection {
    public assignProfileImages(email?: string, oauthPicture?: string): { small: string; large: string; } {
        const defaultImage = this.randomDefaultImage();
        const small = this.assignProfileImage(80, defaultImage, email, oauthPicture);
        const large = this.assignProfileImage(600, defaultImage, email, oauthPicture);
        return { small, large };
    }

    private assignProfileImage(size: number, defaultImage: string, email?: string, oauthPicture?: string): string {
        if (oauthPicture) {
            return this.oAuthImageFor(oauthPicture, size);
        }

        if (email) {
            return this.gravatarImageFor(email, defaultImage, size);
        }

        return defaultImage;
    }

    private oAuthImageFor(oauthPicture: string, size: number): string {
        const sizeDelimiter = oauthPicture.indexOf("=s");
        return sizeDelimiter !== -1 ? `${oauthPicture.substring(0, sizeDelimiter)}=s${size}` : oauthPicture;
    }

    private gravatarImageFor(email: string, defaultImage: string, size: number): string {
        const emailHash = md5(email.toLowerCase().trim());
        const encodedUri = encodeURIComponent(defaultImage);
        return `https://www.gravatar.com/avatar/${emailHash}?d=${encodedUri}&s=${size}`;
    }

    private randomDefaultImage() {
        const min = 1;
        const max = 9;
        const profileImageNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        const imageFile = `pattern${profileImageNumber}.jpg`;

        const randomProfile = imageFile;
        const webRoot = process.env.WEB_ROOT;
        return `${webRoot}/images/default-profile-images/${randomProfile}`;
    }
}
