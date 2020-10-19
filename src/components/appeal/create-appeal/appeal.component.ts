import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

import { AppealService } from '.././appeal.service';
import { District, Deputy, ResultModel, LoadedFile, Location } from '../../../models';
import { AuthService } from '../../auth/auth.service';
import { NgbdModalContent } from '../../modal/modal.component';


@Component({
    selector: 'app-appeal',
    templateUrl: './appeal.component.html',
    styleUrls: ['./appeal.component.scss']
})
export class AppealComponent implements OnInit {
    form = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        district: new FormControl(null, [Validators.required]),
        deputy: new FormControl(null, [Validators.required])
    });

    isError: boolean;
    message: string;
    districts: District[];
    allDeputies: Deputy[];
    deputies: Deputy[];
    loadedFiles: LoadedFile[] = [];
    // tslint:disable-next-line: no-inferrable-types
    isLoader: boolean = true;
    isLoadFile: boolean;
    @ViewChild('search') searchElementRef: ElementRef;
    @ViewChild('map') mapElementRef: ElementRef;
    map: google.maps.Map;
    addressLocation: Location;
    deputyId: string;

    constructor(
        private appealService: AppealService,
        private authService: AuthService,
        private modalService: NgbModal,
        private router: Router,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private route: ActivatedRoute,
    ){}

    async ngOnInit(): Promise<void> {
        this.route.params.subscribe(params => {
            this.deputyId = params['id'];
        });

        const userRole = await this.authService.getUserRole();
        if (userRole !== 'deputy') {
            this.districts = await this.appealService.getDistricts();
            this.allDeputies = await this.appealService.getDeputy();
            this.deputies = this.allDeputies;
            if (this.deputyId) {
                const deputy = this.allDeputies.find(deputy => deputy.id === this.deputyId);
                const district = this.districts.find(district => district.id === deputy.district);
                this.form.patchValue({
                    district: district ? district : null,
                    deputy: deputy ? deputy : null,
                });

            }
        } else {
            this.router.navigate(['/']);
        }
        this.loadMap();
        this.isLoader = false;
    }

    loadMap(): void {
        this.mapsAPILoader.load().then(() => {
            this.map = new google.maps.Map(this.mapElementRef.nativeElement, {
                center: {lng: 34.5514169, lat: 49.5882669},
                zoom: 11,
                disableDefaultUI: true
            });
            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    this.onPlaceChange(autocomplete.getPlace());
                });
            });
        });
    }

    onPlaceChange(place: google.maps.places.PlaceResult): void {
        this.map.setCenter(place.geometry.location);
        this.addressLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };
        this.map.setZoom(15);
        // tslint:disable-next-line: no-unused-expression
        new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
        });
    }

    async onFileChange(event): Promise<void> {
        this.isLoadFile = true;
        const file: File = event.target.files[0];
        if (file) {
            const size: string = (event.target.files[0].size * 0.001).toFixed(1) + ' mb';
            const fileInfo: LoadedFile = await this.appealService.uploadFile(file);
            if (file.type !== 'image/png' && file.type !== 'image/x-png' && file.type !== 'image/gif' && file.type !== 'image/jpeg') {
                fileInfo.imageUrl = 'assets/images/file.png';
            }
            const loadedFile: LoadedFile = {
                name: file.name,
                size,
                imageUrl: fileInfo.imageUrl,
                pathFile: fileInfo.pathFile,
            };
            this.loadedFiles.push(loadedFile);
        }
        this.isLoadFile = false;
    }

    async onSubmit(): Promise<void> {
        const result: ResultModel = await this.appealService.createAppeal(this.form.value, this.addressLocation, this.loadedFiles);
        if (result.status) {
            const modalRef = this.modalService.open(NgbdModalContent);
            modalRef.componentInstance.name = 'Вашу заявку успiшно створено';
        } else {
            this.isError = !result.status;
            this.message = result.message;
        }
    }

    onDistrictsChange(value): void {
        this.deputies = this.allDeputies.filter(deputy => deputy.district === value.id);
    }

    onDeputyChange(value): void {
        if (this.form.value.district === '') {
            this.districts = this.districts.filter(district => district.id === value.district);
        }
    }

    deleteFile(path: string): void {
        this.loadedFiles = this.loadedFiles.filter(file => file.pathFile !== path);
        this.appealService.deleteFileStore(path);
    }
}
