import { AfterViewInit, Component, ElementRef, input, OnDestroy, output, viewChild } from '@angular/core';
import { TaskComponent } from '../tasks.page';
import { QrTask } from '../../../models/task';
import { Haptics } from '@capacitor/haptics';
import jsQR from 'jsqr';

@Component({
  selector: 'app-qr-task',
  templateUrl: './qr-task.component.html',
  styleUrls: ['./qr-task.component.scss'],
})
export class QrTaskComponent implements TaskComponent<QrTask>, AfterViewInit, OnDestroy {
  private readonly videoRef = viewChild.required<ElementRef<HTMLVideoElement>>('previewVideo');
  readonly task = input.required<QrTask>();
  readonly taskSolved = output();

  protected cameraState: 'starting' | 'active' | 'noCamera' = 'starting';
  protected previewErrorFlash = false;
  protected hasSolved = false;

  private stream: MediaStream | null = null;
  private scanFrameId: number | null = null;
  private scanCanvas: HTMLCanvasElement | null = null;
  private isStopped = false;
  private wrongCodeCooldown = false;

  async ngAfterViewInit(): Promise<void> {
    await this.startLiveScan();
  }

  getTitle(): string {
    return 'Scan the QR-Code';
  }

  getInstructions(): string | null {
    if (this.hasSolved) {
      return null;
    }
    return 'Point your camera at the QR code to complete the task.';
  }

  protected async startLiveScan(): Promise<void> {
    if (this.stream || this.isStopped) {
      return;
    }

    this.cameraState = 'starting';

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      const videoEl = this.videoRef().nativeElement;
      videoEl.srcObject = this.stream;
      videoEl.setAttribute('playsinline', 'true');
      await videoEl.play();
      this.cameraState = 'active';
      this.scanLoop();
    } catch {
      this.cameraState = 'noCamera';
    }
  }

  private scanLoop(): void {
    const videoEl = this.videoRef().nativeElement;
    if (this.isStopped || !videoEl.videoWidth || !videoEl.videoHeight) {
      this.scanFrameId = requestAnimationFrame(() => this.scanLoop());
      return;
    }

    const canvas = this.getScanCanvas(videoEl.videoWidth, videoEl.videoHeight);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      this.scanFrameId = requestAnimationFrame(() => this.scanLoop());
      return;
    }

    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = jsQR(imageData.data, imageData.width, imageData.height);

    if (result?.data) {
      void this.handleDetectedCode(result.data);
    }

    this.scanFrameId = requestAnimationFrame(() => this.scanLoop());
  }

  private getScanCanvas(width: number, height: number): HTMLCanvasElement {
    if (!this.scanCanvas) {
      this.scanCanvas = document.createElement('canvas');
    }
    if (this.scanCanvas.width !== width || this.scanCanvas.height !== height) {
      this.scanCanvas.width = width;
      this.scanCanvas.height = height;
    }
    return this.scanCanvas;
  }

  private async handleDetectedCode(scannedValue: string): Promise<void> {
    if (scannedValue === this.task().targetValue) {
      this.hasSolved = true;
      this.stopScan();
      this.taskSolved.emit();
      return;
    }

    if (this.wrongCodeCooldown) {
      return;
    }
    this.wrongCodeCooldown = true;
    await this.wrongCodeFeedback();
    window.setTimeout(() => {
      this.wrongCodeCooldown = false;
    }, 800);
  }

  protected getStatusMessage(): string {
    if (this.cameraState === 'starting') {
      return 'Starting camera...';
    }
    return 'no camera found';
  }

  private async wrongCodeFeedback(): Promise<void> {
    this.previewErrorFlash = true;
    window.setTimeout(() => {
      this.previewErrorFlash = false;
    }, 250);

    try {
      await Haptics.vibrate({ duration: 150 });
    } catch {
      if (navigator.vibrate) {
        navigator.vibrate(150);
      }
    }
  }

  private stopScan(): void {
    this.isStopped = true;
    if (this.scanFrameId !== null) {
      cancelAnimationFrame(this.scanFrameId);
      this.scanFrameId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}
