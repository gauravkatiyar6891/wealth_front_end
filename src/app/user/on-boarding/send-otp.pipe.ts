import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sendOtp'
})
export class SendOtpPipe implements PipeTransform {

  transform(value: number, args: any): string {
    let otpTimer = value;
    if (!args) return "Send OTP";
    else {
      if (otpTimer == 0) return "Resend";
      else return "Resend" + "(" + otpTimer + ")";
    }
  }

}