import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-team-member-desc',
  templateUrl: './team-member-desc.component.html',
  styleUrls: ['./team-member-desc.component.scss']
})
export class TeamMemberDescComponent implements OnInit {

  memberId: number = 0;
  teamMember: TeamMember[] = [
    {
      image: '../../../../assets/images/manu-profile.jpg',
      name: 'Manu Pushkar',
      designation: 'Founder & CEO',
      socialMediaHandle: {
        twitter: '',
        linkedIn: 'https://www.linkedin.com/in/manupushkar/'
      },
      info: ['Manu sets the vision and direction for Go4Wealth. He is focussed on making customer journey to wealth creation simple, and rewarding.',
        'Manu has wroked in various Finance and E-commerce organizations for over 15 years in various leadership positions - at Makemytrip, Max Life, ICICI Prudential, etc']
    },
    {
      image: '../../../../assets/images/rashmi-profile.jpg',
      name: 'Rashmi Pushkar',
      designation: 'Co-Founder & Director',
      socialMediaHandle: {
        twitter: '',
        linkedIn: 'https://www.linkedin.com/in/rashmipushkar/'
      },
      info: ['A welath creation expert, Rashmi has over 8 years of experience in Indian Equity market and posses rich knowledge of investment basics and trading techniques. She expounds wealth creation through well-researched long-term picks, backed with patience and conviction',
        'She believes that by using common-sensical approach one can make trading and investing really simple and profitable.']
    },
    {
      image: '../../../../assets/images/saurabh-katiyar-profile-1.png',
      name: 'Saurabh Katiyar',
      designation: 'Technical Advisor',
      socialMediaHandle: {
        twitter: '',
        linkedIn: 'https://www.linkedin.com/in/saurabh-katiyar-a6431524/'
      },
      info: []
    },
    {
      image: '../../../../assets/images/praveen.jpeg',
      name: 'Praveen Pushkar',
      designation: 'Co-Founder & Distribution Head',
      socialMediaHandle: {
        twitter: '',
        linkedIn: ''
      },
      info: []
    }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: data) {
    this.memberId = data.memberId;
  }

  ngOnInit() {
  }

}

interface TeamMember {
  image: string,
  name: string,
  designation: string,
  socialMediaHandle: {
    linkedIn: string,
    twitter: string
  },
  info: Array<string>
}

interface data {
  memberId: number
}