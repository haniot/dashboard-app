export class UserEmail {
    name: string;
    email: string;
}

export class Attachments {
    filename: string;
    path: string;
    content_type: string;
}

export class NotificationEmail {
    reply: UserEmail;
    to: Array<UserEmail>;
    cc: Array<UserEmail>;
    bcc: Array<UserEmail>;
    subject: string;
    text: string;
    html: string;
    attachments: Array<Attachments>;

    constructor() {
        this.reply = new UserEmail();
        this.to = new Array<UserEmail>();
        this.cc = new Array<UserEmail>();
        this.bcc = new Array<UserEmail>();
        this.attachments = new Array<Attachments>();
    }
}
