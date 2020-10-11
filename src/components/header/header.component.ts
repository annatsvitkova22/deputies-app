import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
        {name: 'Про проект', path: '/about-project'}
    ];
    isOpen: boolean;
    isDropdown: boolean = false;
    isCreateAppeal: boolean;
    path: string;
    counter: number = 0;
    isMobile: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router,
    ){ }

    outside(event) {
        if(event && this.isDropdown) {
            this.counter = this.counter + 1;
            if( this.counter !== 1) {
                this.isDropdown = false;
                this.counter = 0;
            }
        }
    }

    async ngOnInit(): Promise<void> {
        this.route.url.subscribe(res => {
            if (res.length) {
                this.path = res[0].path;
            }
        });

        if (window.innerWidth < 769) {
            this.isMobile = true;
        }
        const userAvatar: UserAvatal = await this.authService.getUserImage();
        if (userAvatar && userAvatar.imageUrl) {
            this.imageUrl = userAvatar.imageUrl;
        } else if (userAvatar && userAvatar.shortName) {
            this.shortName = userAvatar.shortName;
        }
        const userRole: string = await this.authService.getUserRole();
        if (userRole === 'deputy' || this.path === 'create-appeal'  || this.path === 'sign-in'
        || this.path === 'sign-up'  || this.path === 'reset-password') {
            this.isCreateAppeal = false;
        } else {
            this.isCreateAppeal = true;
        }
    }

    @HostListener('window:resize', ['$event'])
	onResize(event) {
        const width: number = event.target.innerWidth;
        if (width < 769) {
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }
	}

    onMobileLink() {
        const bodyElement = document.getElementsByTagName('body');
        bodyElement[0].style.overflow = 'visible';
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
            bodyElement[0].style.overflow = 'visible';
        }
    }

    onOpenDropdown(): void {
        this.isDropdown = !this.isDropdown;
        this.counter = 0;
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
