import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Mobile / Tab sidebar open state
  isMobileOpen = signal<boolean>(false);

  toggleMobile(): void {
    this.isMobileOpen.update(open => !open);
  }

  closeMobile(): void {
    this.isMobileOpen.set(false);
  }

  openMobile(): void {
    this.isMobileOpen.set(true);
  }
}
