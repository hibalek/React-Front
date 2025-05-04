// src/types.ts
export type Availability = {
    [key: string]: string;
  };
  
  export type Certificate = {
    id: string;
    name: string;
    year: string;
  };
  
  export type ContactInfo = {
    email: string;
    phone: string;
    address: string;
  };
  
  export type Follower = {
    id: string;
    name: string;
    avatar: string;
  };
  
  export type Patient = {
    id: string;
    name: string;
    avatar: string;
    lastVisit: string;
  };
  
  export type DoctorProfileData = {
    fullName: string;
    specialty: string;
    profileImage: string;
    bannerImage: string;
    availability: Availability;
    certificates: Certificate[];
    contactInfo: ContactInfo;
    followers: Follower[];
    patients: Patient[];
  };