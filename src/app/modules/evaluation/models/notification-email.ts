class UserEmail {
    name: string;
    email: string;
}

class Attachments {
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
}
