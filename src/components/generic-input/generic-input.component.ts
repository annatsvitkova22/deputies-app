import { Component, OnInit, Input, ViewChild, ElementRef, Self, Optional, forwardRef } from '@angular/core';
import {
  ControlValueAccessor, Validator, AbstractControl,
  ValidatorFn, Validators, NgControl,
} from '@angular/forms';

@Component({
  selector: 'app-generic-input',
  templateUrl: './generic-input.component.html',
  styleUrls: ['./generic-input.component.scss'],
})
export class GenericInputComponent implements ControlValueAccessor, Validator, OnInit {


  @ViewChild('input') input: ElementRef;
  disabled;

  // tslint:disable-next-line: no-inferrable-types
  @Input() type: string = 'text';
  // tslint:disable-next-line: no-inferrable-types
  @Input() isRequired: boolean = false;
  @Input() pattern: string = null;
  @Input() label: string = null;
  @Input() id: string;
  @Input() errorMsg: string;
  @Input() placeholder: string;
  isShowPassword: boolean = false;

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit() {
    const control = this.controlDir.control;
    const validators: ValidatorFn[] = control.validator ? [control.validator] : [];
    if (this.isRequired) {
      validators.push(Validators.required);
    }
    if (this.pattern) {
      validators.push(Validators.pattern(this.pattern));
    }

    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  onChange(event) {}

  onTouched() { }

  writeValue(obj: any): void {
    this.input.nativeElement.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(c: AbstractControl): { [key: string]: any; } {
    const validators: ValidatorFn[] = [];
    if (this.isRequired) {
      validators.push(Validators.required);
    }
    if (this.pattern) {
      validators.push(Validators.pattern(this.pattern));
    }

    return validators;
  }

  onEye(): void {
    this.isShowPassword = !this.isShowPassword;
    if (this.isShowPassword) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
}
