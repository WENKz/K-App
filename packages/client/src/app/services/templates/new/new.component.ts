import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TemplateService } from '../../../core/api-services/template.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { Template, TemplateDateUnit, TemplateServiceUnit } from '../../../shared/models';

@Component({
  templateUrl: './new.component.html',
})
export class NewComponent {

  templateNameFormGroup: FormGroup;
  servicesFormArray: FormArray;
  generalFormArray: FormArray;
  generalFormGroup: FormGroup;

  WEEK_DAY = [
    { id: '1', value: 'Lundi' },
    { id: '2', value: 'Mardi' },
    { id: '3', value: 'Mercredi' },
    { id: '4', value: 'Jeudi' },
    { id: '5', value: 'Vendredi' },
    { id: '6', value: 'Samedi' },
    { id: '7', value: 'Dimanche' },
  ];

  constructor(
    private fb: FormBuilder,
    private templateService: TemplateService,
    private toasterService: ToasterService,
    private router: Router,
  ) {
    this.createForms();
  }

  createForms(): void {
    this.templateNameFormGroup = this.fb.group({
      templateNameFormControl: ['', Validators.required],
    });
    this.servicesFormArray = this.fb.array([]);
    this.generalFormArray = this.fb.array([
      this.templateNameFormGroup,
      this.servicesFormArray,
    ]);
    this.generalFormGroup = this.fb.group({
      generalFormArray: this.generalFormArray,
    });
  }

  addServiceForm(nbMax: number, startAt: Date, endAt: Date, startDay: number, endDay: number): void {
    const serviceFormGroup = this.fb.group({
      startFormControl: [startAt, Validators.required],
      startDayFormControl: [startDay, Validators.required],
      endFormControl: [endAt, Validators.required],
      endDayFormControl: [endDay, Validators.required],
      nbMaxFormControl: [nbMax, Validators.required],
    });
    serviceFormGroup.valueChanges.subscribe(() => {
      this.sortServiceForm();
    });
    this.servicesFormArray.push(serviceFormGroup);
  }

  sortServiceForm(): void {
    this.servicesFormArray.controls.sort((a, b) => {
      const aStartAt = (a as FormGroup).controls.startAtFormControl.value;
      const bStartAt = (b as FormGroup).controls.startAtFormControl.value;
      if (aStartAt < bStartAt) {
        return -1;
      }
      if (aStartAt > bStartAt) {
        return 1;
      }
      return 0;
    });
  }

  getControls(): AbstractControl[] {
    return (this.generalFormArray.get([1]) as FormArray).controls;
  }

  removeServiceForm(fromGroupId: number): void {
    this.servicesFormArray.removeAt(+fromGroupId);
  }

  toNumber(date: string, selectedDay): TemplateDateUnit {
    return {
      day: +selectedDay,
      hours: +date.split(':')[0],
      minutes: +date.split(':')[1],
    };
  }

  async addTemplate() {
    const template = new Template();
    template.name = this.templateNameFormGroup.controls.templateNameFormControl.value;
    template.services = this.servicesFormArray.controls.map((formGroup) => {
      return this.prepareService((formGroup as FormGroup).controls);
    });
    await this.templateService.create(template);
    this.toasterService.showToaster('Template créé');
    this.router.navigate(['/services/templates']);
  }

  prepareService(controls): TemplateServiceUnit {
    return {
      nbMax: controls.nbMaxFormControl.value,
      startAt: this.toNumber(controls.startFormControl.value, controls.startDayFormControl.value),
      endAt: this.toNumber(controls.endFormControl.value, controls.endDayFormControl.value),
    };
  }

  findWeekDay(dayId: string): string {
    return this.WEEK_DAY.find(day => day.id === dayId).value;
  }
}
