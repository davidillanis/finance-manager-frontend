import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GroupService } from '../../service/group.service';
import { AuthService } from '../../service/auth.service';
import { GroupEntity } from '../../model/group-entity';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InputImageComponent } from "../../widgets/input-image/input-image.component";
import { AppComponent } from '../../app.component';
import { FileService } from '../../service/file.service';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './social.component.html',
  styleUrl: './social.component.css'
})
export class SocialComponent implements OnInit {
  protected userUid = "";
  protected token = "";
  protected limit = 10;
  protected myGroupList: GroupEntity[] = [];
  protected isLoading = false;

  readonly dialog = inject(MatDialog);


  constructor(
    private groupService: GroupService,
    private fileService: FileService,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userUid = this.authService.getUser()?.uid + "";
    this.token = this.authService.getUser()?.stsTokenManager.accessToken + "";
    this.loadGroups();
  }

  loadGroups(usingCache: boolean = true): void {
    this.isLoading = true;
    this.groupService.list(this.userUid, this.token, this.limit, usingCache).subscribe(
      (data) => this.myGroupList = data,
      (error) => console.error('Error loading bills', error),
      () => this.isLoading = false
    );
  }

  routeMyGroup(id: string) {
    this.router.navigate(["/social", "myGroup", id]);
  }

  newGroup() {
    const dialogRef = this.dialog.open(ModalSaveGroup, { data: { name: undefined, urlImage: undefined, description: undefined } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        AppComponent.setViewSpinner(true);

        const createGroup = (imageUrl: string) => {
          const entity: GroupEntity = {
            id: '',
            name: result.name,
            description: result.description,
            imageUrl: imageUrl,
            owner: this.userUid,
            members: [],
            creationDate: ''
          };

          this.groupService.create(this.userUid, this.token, entity).subscribe({
            next: (response) => {
              AppComponent.setViewSpinner(false);
              if (response.isSuccess) {
                this.alertService.successful("Group created successfully");
                this.loadGroups(false);
              } else {
                this.alertService.warning("Error creating group");
              }
            },
            error: (error) => {
              AppComponent.setViewSpinner(false);
              console.error("Error creating group:", error);
              this.alertService.warning("Error creating group");
            }
          });
        };

        if (!result.file) {
          createGroup('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');
        } else {
          this.fileService.uploadFile2(result.file).url$.subscribe({
            next: (url) => createGroup(url),
            error: (error) => {
              AppComponent.setViewSpinner(false);
              console.error("Error uploading file:", error);
              this.alertService.warning("Error uploading file");
            }
          });
        }
      }
    });
  }

  updateGroup(entity: GroupEntity, id:string) {
    const dialogRef = this.dialog.open(ModalSaveGroup, { data: { name: entity.name, urlImage: entity.imageUrl, description: entity.description } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        AppComponent.setViewSpinner(true);

        const updateGroup = (imageUrl: string) => {
          const entity: Partial<GroupEntity> = {
            name: result.name,
            description: result.description,
            imageUrl: imageUrl
          };

          this.groupService.update(this.userUid, id, this.token, entity).subscribe({
            next: (response) => {
              AppComponent.setViewSpinner(false);
              if (response.isSuccess) {
                this.alertService.successful("Group updated successfully");
                this.loadGroups(false);
              } else {
                this.alertService.warning("Error updating group");
              }
            },
            error: (error) => {
              AppComponent.setViewSpinner(false);
              console.error("Error updating group:", error);
              this.alertService.warning("Error updating group");
            }
          });
        };

        if (!result.file) {
          updateGroup('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');
        } else {
          this.fileService.uploadFile2(result.file).url$.subscribe({
            next: (url) => updateGroup(url),
            error: (error) => {
              AppComponent.setViewSpinner(false);
              console.error("Error uploading file:", error);
              this.alertService.warning("Error uploading file");
            }
          });
        }
      }
    });
  }

}

@Component({
  selector: 'modal-widgets',
  templateUrl: './modal-save-group.html',
  standalone: true,
  imports: [MatDialogModule, MatInputModule, MatButtonModule, FormsModule, InputImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSaveGroup {
  name: string = "";
  description: string = "";
  urlImage: string = "";
  file: File | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string, urlImage: string, description: string }
  ) {
    this.name = data.name ? data.name : "";
    this.urlImage = data.urlImage ? data.urlImage : "";
    this.description = data.description ? data.description : "";
  }

  onPhotoChange(file: File) {
    this.file = file;
  }

  isDisabled() {
    return this.name.length > 3;
  }

}

