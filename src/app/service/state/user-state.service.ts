import { inject, Injectable } from '@angular/core';
import { UserEntity } from '../../model/user-entity';
import { UserService } from '../user.service';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';
//import { signalSlice } from 'ngxtension/signal-slice';

interface State {
  user: UserEntity[];
  status: 'loading' | 'success' | 'error';
  page: number;
}


@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private userService = inject(UserService);

  private initialState: State = {
    user: [],
    status: 'loading' as const,
    page: 1,
  };

  changePage$ = new Subject<number>();

  loadProducts$ = this.changePage$.pipe(
    startWith(1),
    switchMap(() => this.userService.getList()),
    map((users) => ({ users, status: 'success' as const })),
    catchError(() => {
      return of({
        products: [],
        status: 'error' as const,
      });
    }),
  );

  /*state = signalSlice({
    initialState: this.initialState,
    sources: [
      this.changePage$.pipe(
        map((page) => ({ page, status: 'loading' as const })),
      ),
      this.loadProducts$,
    ],
  });*/
}
