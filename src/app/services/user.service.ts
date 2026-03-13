import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private static USERNAME_STORAGE_KEY = 'username';
  private username: string | null = null;

  async getUsername() {
    if (this.username === null) {
      const { value } = await Preferences.get({ key: UserService.USERNAME_STORAGE_KEY });
      this.username = value ? value.trim() : '';
    }
    return this.username;
  }

  setUsername(username: string) {
    this.username = username.trim();
    void Preferences.set({
      key: UserService.USERNAME_STORAGE_KEY,
      value: this.username,
    });
  }
}
