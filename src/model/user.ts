export class User {
  id: string;
  name: string;
  avatarUrl: string;
  tag?: string;

  constructor(id: string, name: string, avatarUrl: string, tag?: string) {
    this.id = id;
    this.name = name;
    this.avatarUrl = avatarUrl;
    this.tag = tag;
  }
}
