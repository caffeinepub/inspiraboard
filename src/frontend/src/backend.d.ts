import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Message {
    id: bigint;
    content: string;
    recipient: Principal;
    sender: Principal;
    timestamp: Time;
}
export interface Author {
    id: Principal;
    displayName: string;
    avatar?: ExternalBlob;
}
export interface UserProfile {
    bio: string;
    displayName: string;
    avatar?: ExternalBlob;
}
export interface PostMetadata {
    id: string;
    createdAt: Time;
    tags: Array<string>;
    author: Author;
    caption: string;
    image: ExternalBlob;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPost(caption: string, image: ExternalBlob, tags: Array<string>): Promise<PostMetadata>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllTags(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeed(): Promise<Array<PostMetadata>>;
    getMessages(otherUser: Principal): Promise<Array<Message>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchPosts(term: string, tag: string | null): Promise<Array<PostMetadata>>;
    sendMessage(to: Principal, content: string): Promise<void>;
}
