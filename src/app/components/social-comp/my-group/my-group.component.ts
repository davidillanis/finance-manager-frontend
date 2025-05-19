import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../service/group.service';
import { AuthService } from '../../../service/auth.service';
import { GroupEntity } from '../../../model/group-entity';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable, of, Subject } from 'rxjs';
import { TableLoanComponent } from "../table-loan/table-loan.component";
import { MatDialog } from '@angular/material/dialog';
import { InviteUserDialogComponent } from '../invite-user-dialog/invite-user-dialog.component';
import { UserService } from '../../../service/user.service';
import { UserEntity } from '../../../model/user-entity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-group',
  standalone: true,
  imports: [MatTabsModule, TableLoanComponent, CommonModule],
  templateUrl: './my-group.component.html',
  styleUrl: './my-group.component.css'
})
export class MyGroupComponent implements OnInit {
  protected groupId: string = "";
  protected userUid = "";
  protected token = "";
  groupEntity: GroupEntity | undefined;
  usersMap = new Map<string, UserEntity>();
  //update table
  private reloadTableSubject = new Subject<void>();
  reloadTable$ = this.reloadTableSubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private authService: AuthService,
    private userService:UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userUid = this.authService.getUser()?.uid + "";
    this.token = this.authService.getUser()?.stsTokenManager.accessToken + "";
    this.updateData();
  }

  updateData(){
    this.route.paramMap.subscribe(params => {
      this.groupId = params.get('id') || "";
      this.groupService.getById(this.groupId, this.token).subscribe(t => {
        this.groupEntity = t;
        this.groupEntity?.members.forEach(uid=>this.userService.getUserById(uid, this.token).subscribe(user=>this.usersMap.set(uid, user)));

        this.reloadTableSubject.next();
      });
    });
  }

  openInviteDialog() {
    this.updateData();
    const dialogRef = this.dialog.open(InviteUserDialogComponent, {
      width: '400px',
      data: {'token':this.token, 'group':this.groupEntity} // puedes pasar datos si quieres
    });

    dialogRef.afterClosed().subscribe(result => this.updateData());
  }

  getUser(uid:string){
    return this.userService.getUserById(uid, this.token);
  }

  get isOwner$(): Observable<boolean> {
    return of(this.groupEntity?.owner === this.userUid);
  }
}







