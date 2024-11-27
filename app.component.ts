import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { trigger, transition, style, animate } from '@angular/animations';
import { BioCardComponent } from './bio-card/bio-card.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProjectsCardsComponent } from './projects-cards/projects-cards.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, BioCardComponent, NavBarComponent, ProjectsCardsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('600ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ]),
    trigger('slideInOutBio', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('600ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent {
  currentView: 'bio' | 'projects' = 'bio';  
  private isScrolling = false;

  private touchStartY = 0;
  private touchEndY = 0;

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    this.handleScroll(event.deltaY > 0 ? 'down' : 'up');
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndY = event.changedTouches[0].clientY;
    const direction = this.touchStartY > this.touchEndY ? 'down' : 'up';
    this.handleScroll(direction);
  }

  private handleScroll(direction: 'up' | 'down') {
    if (this.isScrolling) {
      return;
    }

    this.isScrolling = true;

    if (direction === 'down' && this.currentView === 'bio') {
      this.currentView = 'projects';
    } else if (direction === 'up' && this.currentView === 'projects') {
      this.currentView = 'bio';
    }

    setTimeout(() => {
      this.isScrolling = false;
    }, 600);
  }
}
