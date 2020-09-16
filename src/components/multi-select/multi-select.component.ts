import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-multi',
    templateUrl: './multi-select.component.html',
    styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {

    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};

    constructor() { }

    ngOnInit() {
        this.dropdownList = [
            { "id": 1, "countryName": "India" },
            { "id": 2, "countryName": "Singapore" },
            { "id": 3, "countryName": "Australia" },
            { "id": 4, "countryName": "Canada" }
        ];

        this.dropdownSettings = {
            singleSelection: false,
            text: 'Район',
            enableCheckAll: false,
            enableSearchFilter: false,
            labelKey: 'countryName',
            classes: 'multi-select',
            badgeShowLimit: 1
        };

    }

    onItemSelect(item: any) {
        console.log('onItemSelect');
        console.log(this.selectedItems);
    }
    OnItemDeSelect(item: any) {
        console.log('OnItemDeSelect');
        console.log(this.selectedItems);
    }

    resetForm(f: NgForm) {
        f.reset();
        this.selectedItems = [];
    }

}