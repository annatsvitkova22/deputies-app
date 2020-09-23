import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { UserAvatal } from '../../models';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    shortName: string;
    imageUrl: string;
    dropdownLinks = [
        {name: 'Мій профіль', path: '/profile'},
        {name: 'Налаштування', path: '/edit'},
        {name: 'Вийти', path: 'signout'}
    ];
    links = [
        {name: 'Запити', path: '/'},
        {name: 'Депутати', path: '/deputies'},
        {name: 'Про проект', path: '/about'}
    ];
    isOpen: boolean;
    isDropdown: boolean;

    constructor(
        private authService: AuthService,
        private router: Router
    ){}

    async ngOnInit(): Promise<void> {
        const userAvatar: UserAvatal = await this.authService.getUserImage();
        if (userAvatar && userAvatar.imageUrl) {
            this.imageUrl = userAvatar.imageUrl;
        } else if (userAvatar && userAvatar.shortName) {
            this.shortName = userAvatar.shortName;
        }
    }

    isCurrentRoute(route: string): boolean {
        return this.router.url === route;
    }

    onOpenMenu(): void {
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            const bodyElement = document.getElementsByTagName('body');
            bodyElement[0].style.overflow = 'hidden';
        } else {
            const bodyElement = document.getElementsByTagName('body');
            bodyElement[0].style.overflow = 'auto';
        }
    }

    onOpenDropdown(): void {
        this.isDropdown = !this.isDropdown;
    }

    onDropdown(link: string): void {
        if (link === 'signout') {
            this.authService.signOut();
            this.router.navigate(['/sign-in']);
        } else {
            this.router.navigate([link]);
        }
    }
}
