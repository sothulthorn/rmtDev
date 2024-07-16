export type TJobItems = {
  id: number;
  badgeLetters: string;
  title: string;
  company: string;
  relevanceScore: number;
  daysAgo: number;
};

export type TJobItemExpanded = TJobItems & {
  description: string;
  qualifications: string[];
  reviews: string[];
  duration: string;
  location: string;
  salary: string;
  coverImgURL: string;
  companyURL: string;
};
