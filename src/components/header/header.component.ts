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
    links = [
        {name: 'Запити', path: '/'},
        {name: 'Депутати', path: '/deputies'},
        {name: 'Про проект', path: '/about'}
    ];
    isOpen: boolean;

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
    }
}
