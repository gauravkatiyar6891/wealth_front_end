export const OCCUPATION_LIST: FormSelectModel[] = [
    {
        value: '01',
        name: 'Business'
    },
    {
        value: '02',
        name: 'Service'
    },
    {
        value: '03',
        name: 'Professional'
    },
    {
        value: '04',
        name: 'Agriculture'
    },
    {
        value: '05',
        name: 'Retired'
    },
    {
        value: '06',
        name: 'HouseWife'
    },
    {
        value: '07',
        name: 'Student'
    },
    {
        value: '08',
        name: 'Others'
    }
];
export const BANK_ACCOUNT_TYPE: FormSelectModel[] = [
    {
        value: 'SB',
        name: 'Savings Account'
    },
    {
        value: 'CB',
        name: 'Current Account'
    },
    {
        value: 'NE',
        name: 'NRE Account'
    },
    {
        value: 'NO',
        name: 'NRO Account'
    },
    {
        value: 'OTHER',
        name: 'Other Account'
    },
];
export const NOMINEE_RELATIONS: FormSelectModel[] = [
    {
        value: 'Mother',
        name: 'Mother'
    },
    {
        value: 'Father',
        name: 'Father'
    },
    {
        value: 'Spouse',
        name: 'Spouse'
    },
    {
        value: 'Son',
        name: 'Son'
    },
    {
        value: 'Daughter',
        name: 'Daughter'
    },
];
export const ADDRESS_TYPE_LIST: FormSelectModel[] = [
    {
        value: '2',
        name: 'Residential'
    },
    {
        value: '3',
        name: 'Business'
    },
    {
        value: '5',
        name: 'Others'
    }
];
export const INCOME_SLAB_LIST: FormSelectModel[] = [
    {
        value: '31',
        name: 'Below 1 Lakh'
    },
    {
        value: '32',
        name: '1-5 Lacs'
    },
    {
        value: '33',
        name: '5-10 Lacs'
    },
    {
        value: '34',
        name: '10-25 Lacs'
    },
    {
        value: '35',
        name: '25 Lacs-1 Crore'
    },
    {
        value: '36',
        name: 'Above 1 Crore'
    }
];
export const PEP_LIST: FormSelectModel[] = [
    {
        value: 'Y',
        name: 'Yes'
    },
    {
        value: 'N',
        name: 'No'
    },
    {
        value: 'R',
        name: 'Related to PEP'
    }
]
export const NAME_REGEX: string = "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$";
export const PAN_REGEX: string = "[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}";

export interface FormSelectModel {
    value: string,
    name: string
}