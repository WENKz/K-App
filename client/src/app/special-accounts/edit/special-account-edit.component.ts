import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SpecialAccount, Permission } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { SpecialAccountService, PermissionService } from '../../_services/index';

@Component({
  templateUrl: './special-account-edit.component.html',
})

export class SpecialAccountEditComponent implements OnInit {
    // TODO add reset password option

    specialAccountForm: FormArray;
    detailsForm: FormGroup;
    permissionFormArray: FormArray;

    permissions: Array<{
        permission: Permission,
        isChecked: Boolean,
    }>;

    constructor(
        private specialAccountService: SpecialAccountService,
        private permissionService: PermissionService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.createForms();
    }

    createForms() {
        this.detailsForm = this.fb.group({
            username: new FormControl('', [Validators.required]),
            description: new FormControl(''),
        });
        this.permissionFormArray = this.fb.array([]);
        this.specialAccountForm = this.fb.array([
            this.detailsForm,
            this.permissionFormArray,
        ]);
    }

    addPermissionForm(permission: Permission): void {
        const permissionForm = new FormGroup({
            name: new FormControl(permission.name)
        });
        this.permissionFormArray.push(permissionForm);
    }

    ngOnInit() {
        this.permissionService.getAll().subscribe(permissions => {
            permissions.forEach(permission => {
                this.permissions.push({
                    permission: permission,
                    isChecked: false,
                });
                this.addPermissionForm(permission);
            });
        });
        this.route.params.subscribe(params => {
            this.specialAccountService.getById(params['id']).subscribe((specialAccount: SpecialAccount) => {
                this.detailsForm.controls.username.setValue(specialAccount.connection.username);
                this.detailsForm.controls.description.setValue(specialAccount.description ? specialAccount.description : '');
                if (specialAccount.permissions) {
                    specialAccount.permissions.forEach(specialAccountPermission => {
                        this.permissions.find(permission => {
                            return specialAccountPermission === permission.permission;
                        });
                    });
                }
            },
            error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
        });
    }

    edit() {
        const specialAccount = new SpecialAccount();
        Object.keys(this.specialAccountForm.controls).forEach(key => {
            if (this.specialAccountForm.get(key).dirty) {
                switch (key) {
                    case 'username':
                        specialAccount.connection.username = this.specialAccountForm.get(key).value;
                        break;
                    default:
                        specialAccount[key] = this.specialAccountForm.get(key).value;
                        break;
                }
            }
        });
        // TODO implement code dialog
        const code = null;
        this.specialAccountService.update(specialAccount, code).subscribe(() => {
            this.toasterService.showToaster('Compte special modifié', 'Fermer');
            this.router.navigate(['/specialaccounts']);
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
