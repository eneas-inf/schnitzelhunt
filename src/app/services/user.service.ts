import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private username: string = '';

  getUsername() {
    return this.username;
  }

  setUsername(username: string) {
    this.username = username;
  }
}
