import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProgressiveLoadDirective } from './progressive-load.directive';

@Component({
  standalone: true,
  imports: [ProgressiveLoadDirective],
  template: `<button [appProgressiveLoad]="enabled" (progressiveLoad)="loaded()" (click)="loaded()">Cargar mas</button>`,
})
class Host {
  enabled = true;
  loaded = vi.fn();
}

describe('ProgressiveLoadDirective', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('requests the next page when the sentinel approaches the viewport', () => {
    let callback: IntersectionObserverCallback | undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal('IntersectionObserver', vi.fn(function (cb: IntersectionObserverCallback) {
      callback = cb;
      return { observe, disconnect } as unknown as IntersectionObserver;
    }));

    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(observe).toHaveBeenCalled();

    callback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(fixture.componentInstance.loaded).toHaveBeenCalledTimes(1);

    fixture.componentInstance.enabled = false;
    fixture.detectChanges();
    callback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(fixture.componentInstance.loaded).toHaveBeenCalledTimes(1);

    fixture.destroy();
    expect(disconnect).toHaveBeenCalled();
  });

  it('keeps the manual button usable when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.loaded).toHaveBeenCalledTimes(1);
    fixture.destroy();
  });
});