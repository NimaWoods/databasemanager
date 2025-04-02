import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  NgZone,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('resizeHandle') resizeHandle!: ElementRef;
  @Output() collapsedChange = new EventEmitter<boolean>();
  isCollapsed = false;
  isResizing = false;
  startX = 0;
  initialWidth = 0;
  minWidth = 200;
  maxWidth = 500;
  currentWidth = 250;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private mouseUpHandler: (() => void) | null = null;
  private sidebarEl: HTMLElement | null = null;

  constructor(private renderer: Renderer2, private ngZone: NgZone) {}

  @HostBinding('class.collapsed') get isCollapsedHost() { return this.isCollapsed; }

  ngAfterViewInit(): void {
    if (this.sidebar && this.sidebar.nativeElement) {
      this.sidebarEl = this.sidebar.nativeElement;
      this.setupResizeEvents();
    }
  }

  ngOnDestroy(): void {
    this.cleanupEventListeners();
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);

    // Füge dem Body eine Klasse hinzu/entferne sie, wenn die Sidebar ein-/ausgeklappt wird
    if (this.isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }

  setupResizeEvents(): void {
    if (!this.resizeHandle || !this.resizeHandle.nativeElement) return;

    // Direkte DOM-Manipulation für bessere Performance
    this.ngZone.runOutsideAngular(() => {
      this.resizeHandle.nativeElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
    });
  }

  handleMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.sidebarEl) return;

    this.isResizing = true;
    this.startX = event.clientX;
    this.initialWidth = this.sidebarEl.offsetWidth;

    // Für bessere Performance außerhalb der Angular-Zone
    this.ngZone.runOutsideAngular(() => {
      this.mouseMoveHandler = this.handleMouseMove.bind(this);
      this.mouseUpHandler = this.handleMouseUp.bind(this);

      window.addEventListener('mousemove', this.mouseMoveHandler);
      window.addEventListener('mouseup', this.mouseUpHandler);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    });
  }

  handleMouseMove(event: MouseEvent): void {
    if (!this.isResizing || !this.sidebarEl) return;

    // Berechnung und Anwendung in einem Schritt für bessere Performance
    const diffX = event.clientX - this.startX;
    const newWidth = Math.max(this.minWidth, Math.min(this.maxWidth, this.initialWidth + diffX));

    // Direktes Setzen der Breite ohne Angular-Change-Detection
    this.sidebarEl.style.width = `${newWidth}px`;

    // Aktualisiere auch den Host für flüssige UX
    const hostElement = this.sidebar.nativeElement.parentElement;
    if (hostElement) {
      hostElement.style.width = `${newWidth}px`;
    }
  }

  handleMouseUp(): void {
    if (!this.isResizing) return;

    this.isResizing = false;

    if (this.sidebarEl) {
      // Aktualisiere die aktuelle Breite für zukünftige Berechnungen
      this.currentWidth = this.sidebarEl.offsetWidth;
    }

    // Aufräumen
    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
      this.mouseMoveHandler = null;
    }

    if (this.mouseUpHandler) {
      window.removeEventListener('mouseup', this.mouseUpHandler);
      this.mouseUpHandler = null;
    }

    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    // Zurück in die Angular-Zone für UI-Updates
    this.ngZone.run(() => {});
  }

  private cleanupEventListeners(): void {
    if (this.isResizing) {
      this.handleMouseUp();
    }

    if (this.resizeHandle && this.resizeHandle.nativeElement) {
      this.resizeHandle.nativeElement.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    }
  }
}
