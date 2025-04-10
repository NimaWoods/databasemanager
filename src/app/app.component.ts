import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs/operators';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {SidebarComponent} from './shared/sidebar/sidebar.component';
import {LoadingComponent} from './shared/loading/loading.component';
import {NgIf} from '@angular/common';
import {LogService} from './services/LogService';
import {LogLevel} from '@angular/compiler-cli';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, LoadingComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TPS DB Manager';
  isSidebarCollapsed = true;
  isLoading = true;
  routeName = '';

  constructor(private router: Router, private logService: LogService) {
  }

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoading = false;
        this.updateRouteName(event.urlAfterRedirects);
        this.logService.addLog(`Application initiated. Navigated to: ${event.urlAfterRedirects}`, LogLevel.info);
      }
    });
  }

  private updateRouteName(url: string) {
    this.routeName = url === '/home' ? 'Home' : '';
  }

  onSidebarCollapsed(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
  }
}
