import {Component} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs/operators';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {SidebarComponent} from './shared/sidebar/sidebar.component';
import {LoadingComponent} from './shared/loading/loading.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, LoadingComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'W-DBM';
  isSidebarCollapsed = true;
  isLoading = true;
  routeName = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateRouteName(event.urlAfterRedirects);
      }
    });
  }

  updateRouteName(url: string) {
    if (url === '/home') {
      this.routeName = 'Home';
    } else {
      this.routeName = '';
    }
  }

  getRouteName(): string {
    return this.routeName;
  }

  onSidebarCollapsed(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
    isCollapsed
      ? document.body.classList.add('sidebar-collapsed')
      : document.body.classList.remove('sidebar-collapsed');
  }
}
