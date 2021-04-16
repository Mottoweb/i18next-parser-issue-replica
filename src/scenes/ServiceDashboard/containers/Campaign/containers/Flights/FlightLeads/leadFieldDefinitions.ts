export enum LeadFieldType {
  FirstName = 'firstName',
  LastName = 'lastName',
  Email = 'email',
  Phone = 'phone',
  Gender = 'gender',
  Location = 'location',
  City = 'city',
  StreetName = 'streetName',
  StreetNumber = 'streetNumber',
  ZipCode = 'zip',
  Comment = 'comment',
}

export type LeadFieldDefinition = {
  type: LeadFieldType;
  label: string;
};

export const leadFieldDefinitions: LeadFieldDefinition[] = [
  { type: LeadFieldType.FirstName, label: 'FIRST_NAME' },
  { type: LeadFieldType.LastName, label: 'LAST_NAME' },
  { type: LeadFieldType.Email, label: 'EMAIL' },
  { type: LeadFieldType.Phone, label: 'PHONE' },
  { type: LeadFieldType.Gender, label: 'GENDER' },
  { type: LeadFieldType.Location, label: 'LOCATION' },
  { type: LeadFieldType.City, label: 'CITY' },
  { type: LeadFieldType.StreetName, label: 'FIELD_STREET' },
  { type: LeadFieldType.StreetNumber, label: 'HOUSE_NUMBER' },
  { type: LeadFieldType.ZipCode, label: 'ZIP_CODE' },
  { type: LeadFieldType.Comment, label: 'COMMENT' },
];
