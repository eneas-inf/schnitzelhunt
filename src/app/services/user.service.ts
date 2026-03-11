import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const USERNAME_STORAGE_KEY = 'username';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private username: string = '';
  private readonly restorePromise: Promise<void>;

  constructor() {
    this.restorePromise = this.restoreStoredUsername();
  }

  async ensureLoaded(): Promise<void> {
    await this.restorePromise;
  }

  getUsername() {
    return this.username;
  }

  setUsername(username: string) {
    this.username = username.trim();
    void Preferences.set({
      key: USERNAME_STORAGE_KEY,
      value: this.username,
    });
  }

  private async restoreStoredUsername(): Promise<void> {
    const { value } = await Preferences.get({ key: USERNAME_STORAGE_KEY });
    if (!value) {
      return;
    }
    this.username = value.trim();
  }
}
