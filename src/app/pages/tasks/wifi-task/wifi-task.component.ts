import { Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { WifiTask } from '../../../models/task';
import { NgClass } from '@angular/common';
import { ConnectionStatus, Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-wifi-task',
  templateUrl: './wifi-task.component.html',
  styleUrls: ['./wifi-task.component.scss'],
  imports: [
    NgClass,
  ],
})
export class WifiTaskComponent implements TaskComponent<WifiTask>, OnInit, OnDestroy {
  readonly task = input.required<WifiTask>();
  readonly taskSolved = output();
  readonly icon = 'wifi-outline';
  readonly iconType = 'large';
  protected status: 'Connected' | 'Disconnected' = 'Disconnected';

  private listenerHandle: PluginListenerHandle | null = null;
  private sawConnect = false;
  private sawDisconnect = false;

  async ngOnInit(): Promise<void> {
    const status = await Network.getStatus();
    this.updateStatus(status);
    this.listenerHandle = await Network.addListener('networkStatusChange', (newStatus) => {
      this.updateStatus(newStatus);
    });
  }

  async ngOnDestroy(): Promise<void> {
    if (this.listenerHandle) {
      await this.listenerHandle.remove();
      this.listenerHandle = null;
    }
  }

  getTitle(): string {
    if (this.task().requireConnect && this.task().requireDisconnect) {
      return 'Reconnect WIFI';
    }
    return this.task().requireDisconnect ? 'Disconnect from WIFI' : 'Connect to WIFI';
  }

  getInstructions(): string | null {
    if (this.task().requireConnect && this.task().requireDisconnect) {
      return 'Disconnect and reconnect WIFI.';
    }
    if (this.task().requireDisconnect) {
      return 'Disconnect the device from WIFI.';
    }
    return 'Connect the device to WIFI.';
  }

  getCustomInstructions(): string {
    return this.getInstructions() ?? '';
  }

  getTargetStatus(): 'Connected' | 'Disconnected' {
    return this.task().requireDisconnect ? 'Disconnected' : 'Connected';
  }

  getStatus(): 'Connected' | 'Disconnected' {
    return this.status;
  }

  private updateStatus(networkStatus: ConnectionStatus): void {
    const isWifiConnected = networkStatus.connected && networkStatus.connectionType === 'wifi';
    const wasConnected = this.status === 'Connected';
    this.status = isWifiConnected ? 'Connected' : 'Disconnected';

    if (!wasConnected && this.status === 'Connected') {
      this.sawConnect = true;
    }
    if (wasConnected && this.status === 'Disconnected') {
      this.sawDisconnect = true;
    }

    const requiresConnect = this.task().requireConnect;
    const requiresDisconnect = this.task().requireDisconnect;
    const connectDone = !requiresConnect || this.sawConnect || this.status === 'Connected';
    const disconnectDone = !requiresDisconnect || this.sawDisconnect || this.status === 'Disconnected';

    if (connectDone && disconnectDone) {
      this.taskSolved.emit();
    }
  }
}
