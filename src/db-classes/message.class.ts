export class Message {
    id: string;
    message: string;
    created_at: Date;

    constructor(partial: Partial<Message>) {
        Object.assign(this, partial);
    }
}