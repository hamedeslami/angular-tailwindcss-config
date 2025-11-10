import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from '@core/services/toast.service';
import { Toast } from '@shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'angular-config';


  constructor(private toast: ToastService) { }

  ngOnInit() {
    this.toast.show('عملیات با موفقیت انجام شد', 'success', 100000000000);
    this.toast.show('عملیات با موفقیت انجام شد', 'error', 100000000000);
    this.toast.show('عملیات با موفقیت انجام شد', 'warning', 100000000000);
    this.toast.show('عملیات با موفقیت انجام شد', 'info', 100000000000);



  }


}
