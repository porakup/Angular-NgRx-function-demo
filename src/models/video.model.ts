export default interface Video {
    videoId: string;
    title: string;
    duration: string;
    createdDate: Date;
    thumbnail: string;
    tags: Array<any>;
    views: number;
    like: number;
    username: string;
    profile: string;
 }