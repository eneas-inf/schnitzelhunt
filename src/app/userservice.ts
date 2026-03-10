import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Userservice {
  private username: string = "";

  getUsername() {
    return this.username;
  }

  setUsername(username: string) {
    this.username = username;
  }
}
