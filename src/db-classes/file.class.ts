export class Files {
    id: string;
    mime_type: string;
    size: number;
    file: string;
    file_path: string;
    original: string;
    created_at: Date;
    text: string;

    constructor(partial: Partial<Files>) {
        Object.assign(this, partial);
    }
}