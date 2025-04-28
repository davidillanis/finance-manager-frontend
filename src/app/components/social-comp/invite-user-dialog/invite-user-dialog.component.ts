import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { MatButtonModule } from '@angular/material/button';
import { UserEntity } from '../../../model/user-entity';
import { GroupEntity } from '../../../model/group-entity';
import { GroupService } from '../../../service/group.service';
import { AppComponent } from '../../../app.component';
import { AlertService } from '../../../service/alert.service';

@Component({
  selector: 'app-invite-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatListModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './invite-user-dialog.component.html',
  styleUrl: './invite-user-dialog.component.css'
})
export class InviteUserDialogComponent implements OnInit {
  searchTerm = '';
  userList: UserEntity[] = [];
  selectedUsers = new Set<string>();
  groupEntity:GroupEntity|undefined

  token = '';

  constructor(
    public dialogRef: MatDialogRef<InviteUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { token: string; group: GroupEntity },
    private userService: UserService,
    private groupService: GroupService,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    if (!this.data?.token || !this.data?.group) {
      return;
    }
    this.groupEntity = this.data.group;
    this.token = this.data.token;
    this.userService.getList(this.token).subscribe(users => {
      if (this.groupEntity) {
        const groupMembers = new Set(this.groupEntity.members || []);
        this.userList = users.filter(user => !groupMembers.has(user.id));
      }
    });
  }

  filteredUsers() {
    const term = this.searchTerm.toLowerCase();
    return this.userList.filter(user => user.firstName?.toLowerCase().includes(term));
  }

  toggleSelection(user: string) {
    if (this.selectedUsers.has(user)) {
      this.selectedUsers.delete(user);
    } else {
      this.selectedUsers.add(user);
    }
  }

  async agregarUsuarios() {
    if (!this.groupEntity?.id || !this.token) {
      console.error("Group ID or token is missing");
      return;
    }

    try {
      const addMemberPromises = Array.from(this.selectedUsers).map(userId =>
        this.groupService.addMember(userId, this.groupEntity?.id+"", this.token).toPromise()
      );
      await Promise.all(addMemberPromises);
      this.dialogRef.close(Array.from(this.selectedUsers));
      this.alertService.successful("Users added successfully");
    } catch (error) {
      this.alertService.warning("Error adding users");
    } finally {
      this.dialogRef.close(Array.from(this.selectedUsers));
    }
  }

  isDisabled(){
    return this.selectedUsers.size === 0;
  }
}
