import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  message: string = '';
  status: boolean = false;
  showLoader: boolean = true;

  public constructor(
    private title: Title,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {
    this.title.setTitle("Verify Email - Go4Wealth");
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userService.emailUrlVerification(params["token"]).subscribe((res) => {
        this.showLoader = false;
        this.message = res.data;
        if (res.data == "EmailId verified successfully.") this.status = true;
        else this.status = false;
      }, error => console.log(error));
    });
  }

}
